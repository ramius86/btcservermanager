/**
 * Deletes every selected item and reports what happened.
 *
 * The file manager used to stop at the first failure and show "Could not
 * delete item(s)": after that the user could not tell which files were gone and
 * which were still there. Each item is attempted once, failures are collected,
 * and the successful ones are not retried.
 */

export type BulkDeleteFailure<T> = {
  item: T
  message: string
}

export type BulkDeleteOutcome<T> = {
  deleted: number
  failures: BulkDeleteFailure<T>[]
}

export async function deleteEach<T>(
  items: readonly T[],
  remove: (item: T) => Promise<unknown>,
): Promise<BulkDeleteOutcome<T>> {
  const outcome: BulkDeleteOutcome<T> = { deleted: 0, failures: [] }

  for (const item of items) {
    try {
      await remove(item)
      outcome.deleted++
    } catch (err) {
      outcome.failures.push({
        item,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return outcome
}

/** One toast line for the outcome, naming the files that failed. */
export function describeBulkDelete<T>(
  outcome: BulkDeleteOutcome<T>,
  nameOf: (item: T) => string,
): string {
  if (outcome.failures.length === 0) {
    return `Deleted ${outcome.deleted} item${outcome.deleted === 1 ? '' : 's'}`
  }

  const shown = outcome.failures.slice(0, 3).map((failure) => `${nameOf(failure.item)} (${failure.message})`)
  const rest = outcome.failures.length - shown.length
  const suffix = rest > 0 ? ` and ${rest} more` : ''

  return `${outcome.deleted} deleted, ${outcome.failures.length} failed: ${shown.join(', ')}${suffix}`
}
