export const LOG_PAGE_SIZE = 1000

export interface LogPagingState {
  /** Lines fetched over HTTP. WebSocket lines never change it. */
  fetchedLines: number
}

export const initialLogPaging: LogPagingState = { fetchedLines: 0 }

/**
 * Offset (lines from the end) for the next page.
 *
 * The backend offset counts lines from the end of the file, so it must follow
 * only the lines fetched over HTTP: streaming appends to the view, and using
 * the rendered length made pages overlap or skip content.
 */
export function offsetForNextPage(state: LogPagingState): number {
  return state.fetchedLines
}

export function applyFetchedPage(state: LogPagingState, pageLineCount: number): LogPagingState {
  if (pageLineCount <= 0) return state
  return { fetchedLines: state.fetchedLines + pageLineCount }
}

/** A page shorter than the requested size means the file start was reached. */
export function hasMorePages(pageLineCount: number): boolean {
  return pageLineCount >= LOG_PAGE_SIZE - 1
}
