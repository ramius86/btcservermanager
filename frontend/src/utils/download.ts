/**
 * Single download path for the app.
 *
 * The pages used window.open(url): a 404 or a 500 opened an empty tab, the
 * browser could not tell whether anything happened, and the filename came from
 * the URL instead of the server. Here the response is checked, the name comes
 * from Content-Disposition when present, and the caller can show a real error.
 */

/** Extracts the filename from a Content-Disposition header, if any. */
export function filenameFromDisposition(header: string | null | undefined): string | null {
  if (!header) return null

  // RFC 5987 form: filename*=UTF-8''name%20with%20spaces
  const extended = /filename\*\s*=\s*([^;]+)/i.exec(header)
  if (extended) {
    const raw = extended[1].trim().replace(/^["']|["']$/g, '')
    const encoded = /^[^']*''(.*)$/.exec(raw)
    const value = encoded ? encoded[1] : raw
    return sanitize(decode(value))
  }

  const plain = /filename\s*=\s*(?:"([^"]*)"|([^;]+))/i.exec(header)
  if (!plain) return null

  return sanitize(decode((plain[1] ?? plain[2] ?? '').trim()))
}

function decode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function sanitize(value: string): string | null {
  // The server escapes the name with url.PathEscape, and a hostile or buggy
  // backend must not be able to suggest a path.
  const base = value.split(/[\\/]/).pop() ?? ''
  const cleaned = base.replace(/[\u0000-\u001f\u007f]/g, '').trim()

  return cleaned === '' ? null : cleaned
}

/** Triggers a browser download for an in-memory blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

/**
 * Fetches url and saves it under the name the server suggests, falling back to
 * fallbackName. Throws with the HTTP status and a slice of the body so the
 * caller can show why the download failed.
 */
export async function downloadFile(url: string, fallbackName: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const detail = body.trim().slice(0, 200)
    throw new Error(
      `Download failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`,
    )
  }

  const filename = filenameFromDisposition(res.headers.get('Content-Disposition')) ?? fallbackName
  downloadBlob(await res.blob(), filename)

  return filename
}
