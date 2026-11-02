import { describe, expect, it } from 'vitest'
import { applyFetchedPage, hasMorePages, initialLogPaging, LOG_PAGE_SIZE, offsetForNextPage } from './logPaging'

describe('log paging', () => {
  it('starts at offset 0', () => {
    expect(offsetForNextPage(initialLogPaging)).toBe(0)
  })

  it('accumulates only fetched pages', () => {
    let state = initialLogPaging
    state = applyFetchedPage(state, LOG_PAGE_SIZE)
    state = applyFetchedPage(state, 250)

    expect(offsetForNextPage(state)).toBe(1250)
  })

  it('does not move for an empty page', () => {
    const state = applyFetchedPage(initialLogPaging, 0)

    expect(state).toBe(initialLogPaging)
    expect(offsetForNextPage(state)).toBe(0)
  })

  it('reports more pages only for a full page', () => {
    expect(hasMorePages(LOG_PAGE_SIZE)).toBe(true)
    expect(hasMorePages(LOG_PAGE_SIZE - 2)).toBe(false)
  })
})
