import { describe, expect, it } from 'vitest'
import type { PlayerRoleStat, RosterSlot, RosterSquad } from '../../services/api'
import {
  buildRosterDiscordEmbed,
  cleanPlayerName,
  computeAssignedAndUnassigned,
  extractRosterAssignments,
  filterCandidateList,
  formatRosterForDiscord,
  rankCandidatesForRole,
  reconcileSquadsWithCandidates,
  smartFillSquads,
  type RosterCandidate,
} from './rosterUtils'

function candidate(partial: Partial<RosterCandidate> & { name: string }): RosterCandidate {
  return {
    id: partial.name.toLowerCase().replace(/\s+/g, '-'),
    isMaybe: false,
    qualifications: [],
    ...partial,
  }
}

function slot(partial: Partial<RosterSlot> = {}): RosterSlot {
  return {
    id: 'slot-1',
    role: 'RIF',
    assignedPlayerName: '',
    assignedUserId: '',
    isMaybe: false,
    isGuest: false,
    ...partial,
  }
}

function squad(name: string, slots: RosterSlot[]): RosterSquad {
  return { id: name.toLowerCase(), name, slots }
}

describe('cleanPlayerName', () => {
  it('returns an empty string for a missing name', () => {
    expect(cleanPlayerName()).toBe('')
    expect(cleanPlayerName('')).toBe('')
  })

  it('trims surrounding whitespace', () => {
    expect(cleanPlayerName('  Alice  ')).toBe('Alice')
  })

  it('strips the maybe suffix baked into historical data', () => {
    expect(cleanPlayerName('Alice (?)')).toBe('Alice')
    expect(cleanPlayerName('Alice   (?)  ')).toBe('Alice')
  })

  it('only strips a suffix, not a marker in the middle of the name', () => {
    expect(cleanPlayerName('Alice (?) Rossi')).toBe('Alice (?) Rossi')
  })
})

describe('computeAssignedAndUnassigned', () => {
  it('matches assigned names case-insensitively and trims them', () => {
    const squads = [squad('ALPHA', [slot({ assignedPlayerName: '  Alice  ' }), slot({ assignedPlayerName: 'Bob' })])]
    const pool = [candidate({ name: 'alice' }), candidate({ name: 'BOB' }), candidate({ name: 'Carla' })]

    const result = computeAssignedAndUnassigned(squads, pool)

    expect([...result.assignedNames]).toEqual(['alice', 'bob'])
    expect(result.unassignedCandidates.map(c => c.name)).toEqual(['Carla'])
  })

  it('ignores empty slots and keeps a doubly assigned player out of the pool once', () => {
    const squads = [
      squad('A', [slot({ assignedPlayerName: 'Alice' })]),
      squad('B', [slot({ assignedPlayerName: 'Alice' }), slot()]),
    ]

    const result = computeAssignedAndUnassigned(squads, [candidate({ name: 'Alice' })])

    expect(result.assignedNames.size).toBe(1)
    expect(result.unassignedCandidates).toEqual([])
  })
})

describe('filterCandidateList', () => {
  const pool = [
    candidate({ name: 'Alice', qualifications: ['Medic'] }),
    candidate({ name: 'Bruno', isMaybe: true }),
  ]

  it('splits going and maybe candidates', () => {
    expect(filterCandidateList(pool, 'going', '').map(c => c.name)).toEqual(['Alice'])
    expect(filterCandidateList(pool, 'maybe', '').map(c => c.name)).toEqual(['Bruno'])
  })

  it('searches by name or qualification, ignoring case and surrounding spaces', () => {
    expect(filterCandidateList(pool, 'all', '  ALICE ').map(c => c.name)).toEqual(['Alice'])
    expect(filterCandidateList(pool, 'all', 'medic').map(c => c.name)).toEqual(['Alice'])
  })

  it('returns every candidate for an empty query', () => {
    expect(filterCandidateList(pool, 'all', '   ')).toHaveLength(2)
  })
})

describe('extractRosterAssignments', () => {
  it('keeps only filled slots and falls back to the name for guests', () => {
    const squads = [
      squad('A', [
        slot({ role: 'SL', assignedPlayerName: 'Alice', assignedUserId: 'u1' }),
        slot({ role: 'ME', assignedPlayerName: 'Guest' }),
        slot({ role: 'RIF', assignedPlayerName: '' }),
      ]),
    ]

    expect(extractRosterAssignments(squads)).toEqual([
      { userId: 'u1', playerName: 'Alice', role: 'SL' },
      { userId: 'Guest', playerName: 'Guest', role: 'ME' },
    ])
  })

  it('skips occupied slots that have no role', () => {
    const squads = [squad('A', [slot({ role: '', assignedPlayerName: 'Alice' })])]

    expect(extractRosterAssignments(squads)).toEqual([])
  })
})

describe('reconcileSquadsWithCandidates', () => {
  it('renames a slot when the player changes nickname on Discord', () => {
    const squads = [squad('ALPHA', [slot({ assignedPlayerName: 'OldName', assignedUserId: 'u1' })])]

    const [result] = reconcileSquadsWithCandidates(squads, [
      candidate({ id: 'u1', name: 'NewName', isMaybe: true }),
    ])

    expect(result.slots[0]).toMatchObject({
      assignedPlayerName: 'NewName',
      assignedUserId: 'u1',
      isMaybe: true,
    })
  })

  it('matches a name that differs only by clan tag', () => {
    const squads = [squad('ALPHA', [slot({ assignedPlayerName: '=BTC= Alice' })])]

    const [result] = reconcileSquadsWithCandidates(squads, [candidate({ id: 'u1', name: 'Alice' })])

    expect(result.slots[0].assignedPlayerName).toBe('=BTC= Alice')
    expect(result.slots[0].assignedUserId).toBe('u1')
  })

  it('clears the maybe flag when the player left the pool', () => {
    const squads = [squad('ALPHA', [slot({ assignedPlayerName: 'Ghost (?)', isMaybe: true })])]

    const [result] = reconcileSquadsWithCandidates(squads, [candidate({ name: 'Alice' })])

    expect(result.slots[0].assignedPlayerName).toBe('Ghost')
    expect(result.slots[0].isMaybe).toBe(false)
  })

  it('cleans historical markers even without candidates', () => {
    const [result] = reconcileSquadsWithCandidates(
      [squad('A', [slot({ assignedPlayerName: 'Alice (?)' })])],
      [],
    )

    expect(result.slots[0].assignedPlayerName).toBe('Alice')
  })

  it('empties slots that have no player', () => {
    const squads = [
      squad('A', [slot({ assignedPlayerName: '   ', assignedUserId: 'u1', isMaybe: true, isGuest: true })]),
    ]

    const [result] = reconcileSquadsWithCandidates(squads, [candidate({ name: 'Alice' })])

    expect(result.slots[0]).toMatchObject({
      assignedPlayerName: '',
      assignedUserId: '',
      isMaybe: false,
      isGuest: false,
    })
  })
})

describe('rankCandidatesForRole', () => {
  it('returns nothing for an empty pool', () => {
    expect(rankCandidatesForRole([], 'ME', [])).toEqual([])
  })

  it('puts a qualified candidate ahead of an unqualified one', () => {
    const pool = [candidate({ name: 'Alice' }), candidate({ name: 'Bruno', qualifications: ['Medic'] })]

    expect(rankCandidatesForRole(pool, 'ME', []).map(r => r.candidate.name)).toEqual(['Bruno', 'Alice'])
  })

  it('prefers going over maybe when the score is equal', () => {
    const pool = [candidate({ name: 'Zed', isMaybe: true }), candidate({ name: 'Bob' })]

    expect(rankCandidatesForRole(pool, 'RIF', []).map(r => r.candidate.name)).toEqual(['Bob', 'Zed'])
  })

  it('penalises maybe candidates by ten points', () => {
    const going = candidate({ name: 'Alice', qualifications: ['Medic'] })
    const maybe = candidate({ name: 'Bruno', qualifications: ['Medic'], isMaybe: true })

    const [first, second] = rankCandidatesForRole([maybe, going], 'ME', [])

    expect(first.score).toBe(60)
    expect(second.score).toBe(50)
  })

  it('adds history for the same game type and role', () => {
    const stat: PlayerRoleStat = {
      userId: 'u1',
      playerName: 'Alice',
      role: 'ME',
      gameType: 'arma3',
      playCount: 2,
      lastUsedAt: '',
    }

    const [result] = rankCandidatesForRole([candidate({ id: 'u1', name: 'Alice' })], 'ME', [stat], 'arma3')

    expect(result.playCount).toBe(2)
    expect(result.score).toBe(30)
  })
})

describe('smartFillSquads', () => {
  it('fills the highest-priority role first and leaves the rest empty', () => {
    const squads = [squad('ALPHA', [slot({ id: 's1', role: 'RIF' }), slot({ id: 's2', role: 'GM' })])]

    const result = smartFillSquads(squads, [candidate({ name: 'Alice' })], [])

    expect(result.updatedSquads[0].slots.find(s => s.role === 'GM')?.assignedPlayerName).toBe('Alice')
    expect(result.updatedSquads[0].slots.find(s => s.role === 'RIF')?.assignedPlayerName).toBe('')
    expect(result.remainingCandidates).toEqual([])
  })

  it('leaves everyone in the pool when there are no empty slots', () => {
    const squads = [squad('A', [slot({ assignedPlayerName: 'Bob' })])]

    const result = smartFillSquads(squads, [candidate({ name: 'Alice' })], [])

    expect(result.remainingCandidates.map(c => c.name)).toEqual(['Alice'])
  })

  it('does not mutate the input squads', () => {
    const squads = [squad('A', [slot({ id: 's1', role: 'GM' })])]

    smartFillSquads(squads, [candidate({ name: 'Alice' })], [])

    expect(squads[0].slots[0].assignedPlayerName).toBe('')
  })

  it('returns the extra candidates when there are more players than slots', () => {
    const squads = [squad('A', [slot({ id: 's1', role: 'GM' })])]

    const result = smartFillSquads(squads, [candidate({ name: 'Alice' }), candidate({ name: 'Bruno' })], [])

    expect(result.updatedSquads[0].slots[0].assignedPlayerName).toBe('Alice')
    expect(result.remainingCandidates.map(c => c.name)).toEqual(['Bruno'])
  })
})

describe('formatRosterForDiscord', () => {
  it('marks maybe players with the (?) suffix', () => {
    const text = formatRosterForDiscord('', [
      squad('ALPHA 1', [slot({ role: 'SL', assignedPlayerName: 'Alice', isMaybe: true })]),
    ])

    expect(text).toBe('ALPHA 1\nSL - Alice (?)')
  })

  it('renders an empty role with a trailing dash', () => {
    const text = formatRosterForDiscord('', [squad('ALPHA 1', [slot({ role: 'ME' })])])

    expect(text).toBe('ALPHA 1\nME -')
  })

  it('renders a one-slot NOMAD squad on a single line', () => {
    const text = formatRosterForDiscord('', [
      squad('NOMAD', [slot({ role: 'Nomad', assignedPlayerName: 'Alice' })]),
    ])

    expect(text).toBe('NOMAD - Alice')
  })
})

describe('buildRosterDiscordEmbed', () => {
  it('truncates a field that exceeds the Discord limit', () => {
    const squads = Array.from({ length: 200 }, (_, i) =>
      squad(`S${i}`, [slot({ role: 'RIF', assignedPlayerName: 'A'.repeat(20) })]),
    )

    const embed = buildRosterDiscordEmbed([{ id: 'p1', name: 'PART 1', squads }])
    const value = embed.fields?.[0]?.value ?? ''

    expect(value.length).toBeLessThanOrEqual(1024)
    expect(value.endsWith('...\n\u200b')).toBe(true)
  })
})
