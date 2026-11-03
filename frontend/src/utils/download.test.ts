import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadFile, filenameFromDisposition } from './download'

describe('filenameFromDisposition', () => {
  it('reads a quoted filename', () => {
    expect(filenameFromDisposition('attachment; filename="mission.pbo"')).toBe('mission.pbo')
  })

  it('reads an unquoted filename', () => {
    expect(filenameFromDisposition('attachment; filename=server.log')).toBe('server.log')
  })

  it('decodes the escaped name the API sends', () => {
    expect(filenameFromDisposition('attachment; filename="my%20mission.pbo"')).toBe('my mission.pbo')
  })

  it('prefers the RFC 5987 form', () => {
    expect(
      filenameFromDisposition("attachment; filename=\"fallback.pbo\"; filename*=UTF-8''citt%C3%A0.pbo"),
    ).toBe('città.pbo')
  })

  it('ignores a path in the suggested name', () => {
    expect(filenameFromDisposition('attachment; filename="../../etc/passwd"')).toBe('passwd')
    expect(filenameFromDisposition('attachment; filename="C:\\\\logs\\\\arma.log"')).toBe('arma.log')
  })

  it('returns null when the header carries no filename', () => {
    expect(filenameFromDisposition(null)).toBeNull()
    expect(filenameFromDisposition('attachment')).toBeNull()
    expect(filenameFromDisposition('attachment; filename=""')).toBeNull()
  })

  it('keeps the raw value when the escape is invalid', () => {
    expect(filenameFromDisposition('attachment; filename="100%.log"')).toBe('100%.log')
  })
})

describe('downloadFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects with the status instead of opening an empty tab', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('scenario not found', { status: 404, statusText: 'Not Found' })),
    )

    await expect(downloadFile('/api/scenarios/arma3/missing.pbo', 'missing.pbo')).rejects.toThrow(
      /Download failed: 404 Not Found — scenario not found/,
    )
  })

  it('downloads a successful response under the server filename', async () => {
    const click = vi.fn()
    const revoke = vi.fn()
    const appendChild = vi.fn()

    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response('content', {
            status: 200,
            headers: { 'Content-Disposition': 'attachment; filename="from-server.log"' },
          }),
      ),
    )
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:test',
      revokeObjectURL: revoke,
    })
    vi.stubGlobal('document', {
      createElement: () => ({ href: '', download: '', click, remove: vi.fn() }),
      body: { appendChild },
    })

    await expect(downloadFile('/api/logs/download/a.log', 'a.log')).resolves.toBe('from-server.log')
    expect(click).toHaveBeenCalledTimes(1)
    expect(appendChild).toHaveBeenCalledTimes(1)
    expect(revoke).toHaveBeenCalledWith('blob:test')
  })
})
