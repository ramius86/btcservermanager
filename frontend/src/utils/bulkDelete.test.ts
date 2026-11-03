import { describe, expect, it, vi } from 'vitest'
import { deleteEach, describeBulkDelete } from './bulkDelete'

type Item = { name: string }

const nameOf = (item: Item) => item.name

describe('deleteEach', () => {
  it('deletes every item and counts them', async () => {
    const remove = vi.fn(async () => undefined)
    const outcome = await deleteEach<Item>([{ name: 'a' }, { name: 'b' }], remove)

    expect(outcome).toEqual({ deleted: 2, failures: [] })
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('keeps going after a failure and reports the item', async () => {
    const remove = vi.fn(async (item: Item) => {
      if (item.name === 'b') throw new Error('403 forbidden')
    })
    const outcome = await deleteEach<Item>([{ name: 'a' }, { name: 'b' }, { name: 'c' }], remove)

    expect(outcome.deleted).toBe(2)
    expect(outcome.failures).toEqual([{ item: { name: 'b' }, message: '403 forbidden' }])
    expect(remove).toHaveBeenCalledTimes(3)
  })

  it('stringifies a non-Error rejection', async () => {
    const outcome = await deleteEach<Item>([{ name: 'a' }], async () => {
      throw 'boom' // eslint-disable-line no-throw-literal
    })

    expect(outcome.failures).toEqual([{ item: { name: 'a' }, message: 'boom' }])
  })

  it('does nothing for an empty selection', async () => {
    const remove = vi.fn(async () => undefined)
    expect(await deleteEach<Item>([], remove)).toEqual({ deleted: 0, failures: [] })
    expect(remove).not.toHaveBeenCalled()
  })
})

describe('describeBulkDelete', () => {
  it('reports a clean run', () => {
    expect(describeBulkDelete({ deleted: 1, failures: [] }, nameOf)).toBe('Deleted 1 item')
    expect(describeBulkDelete({ deleted: 3, failures: [] }, nameOf)).toBe('Deleted 3 items')
  })

  it('names the failures and counts both sides', () => {
    const message = describeBulkDelete(
      { deleted: 1, failures: [{ item: { name: 'mod.cfg' }, message: '403' }] },
      nameOf,
    )

    expect(message).toBe('1 deleted, 1 failed: mod.cfg (403)')
  })

  it('summarises the tail instead of listing every failure', () => {
    const failures = ['a', 'b', 'c', 'd', 'e'].map((name) => ({ item: { name }, message: '500' }))
    const message = describeBulkDelete({ deleted: 0, failures }, nameOf)

    expect(message).toContain('a (500), b (500), c (500) and 2 more')
  })
})
