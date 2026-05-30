import { describe, it, expect } from 'vitest'
import { mergeProgress, normalizeProgress } from './mergeProgress.js'

const snap = (over = {}) => ({
  onboarded: false,
  completed: {},
  streak: { current: 0, longest: 0, lastDay: null },
  updatedAt: null,
  ...over,
})

describe('normalizeProgress', () => {
  it('returns a safe empty snapshot for junk input', () => {
    for (const junk of [null, undefined, 42, 'x', []]) {
      const n = normalizeProgress(junk)
      expect(n.completed).toEqual({})
      expect(n.streak).toEqual({ current: 0, longest: 0, lastDay: null })
      expect(n.onboarded).toBe(false)
    }
  })

  it('drops invalid star scores and clamps to 1..3', () => {
    const n = normalizeProgress({ completed: { a: 0, b: -1, c: 'x', d: 2, e: 9 } })
    expect(n.completed).toEqual({ d: 2, e: 3 }) // 0/-1/'x' dropped, 9 clamped to 3
  })
})

describe('mergeProgress — completed lessons', () => {
  it('unions completed lessons from both sides', () => {
    const m = mergeProgress(
      snap({ completed: { a: 3, b: 1 } }),
      snap({ completed: { b: 2, c: 3 } }),
    )
    expect(Object.keys(m.completed).sort()).toEqual(['a', 'b', 'c'])
  })

  it('keeps the HIGHER star score per lesson', () => {
    const m = mergeProgress(
      snap({ completed: { a: 1, b: 3 } }),
      snap({ completed: { a: 3, b: 2 } }),
    )
    expect(m.completed.a).toBe(3)
    expect(m.completed.b).toBe(3)
  })

  it('never erases a completed lesson present on only one side', () => {
    const local = snap({ completed: { a: 2, b: 2, c: 1 } })
    const cloud = snap({ completed: {} })
    const m = mergeProgress(local, cloud)
    expect(m.completed).toEqual({ a: 2, b: 2, c: 1 })
  })
})

describe('mergeProgress — onboarded', () => {
  it('is true if either side is onboarded', () => {
    expect(mergeProgress(snap({ onboarded: true }), snap()).onboarded).toBe(true)
    expect(mergeProgress(snap(), snap({ onboarded: true })).onboarded).toBe(true)
    expect(mergeProgress(snap(), snap()).onboarded).toBe(false)
  })
})

describe('mergeProgress — streak', () => {
  it('keeps the higher longest streak', () => {
    const m = mergeProgress(
      snap({ streak: { current: 1, longest: 9, lastDay: '2026-05-01' } }),
      snap({ streak: { current: 2, longest: 3, lastDay: '2026-05-02' } }),
    )
    expect(m.streak.longest).toBe(9)
  })

  it('takes current/lastDay from the side with the more recent activity day', () => {
    const m = mergeProgress(
      snap({ streak: { current: 5, longest: 5, lastDay: '2026-05-10' } }),
      snap({ streak: { current: 2, longest: 5, lastDay: '2026-05-20' } }),
    )
    expect(m.streak.lastDay).toBe('2026-05-20')
    expect(m.streak.current).toBe(2)
  })

  it('on the same lastDay keeps the higher current count', () => {
    const m = mergeProgress(
      snap({ streak: { current: 4, longest: 4, lastDay: '2026-05-15' } }),
      snap({ streak: { current: 7, longest: 7, lastDay: '2026-05-15' } }),
    )
    expect(m.streak).toEqual({ current: 7, longest: 7, lastDay: '2026-05-15' })
  })

  it('falls back to the side that has a streak when the other is empty', () => {
    const m = mergeProgress(
      snap({ streak: { current: 3, longest: 6, lastDay: '2026-05-09' } }),
      snap(),
    )
    expect(m.streak).toEqual({ current: 3, longest: 6, lastDay: '2026-05-09' })
  })
})

describe('mergeProgress — timestamps & invariants', () => {
  it('keeps the newer updatedAt', () => {
    const m = mergeProgress(
      snap({ updatedAt: '2026-05-01T00:00:00Z' }),
      snap({ updatedAt: '2026-05-09T00:00:00Z' }),
    )
    expect(m.updatedAt).toBe('2026-05-09T00:00:00Z')
  })

  it('is symmetric for completed/onboarded/longest', () => {
    const a = snap({ onboarded: true, completed: { a: 1, b: 3 }, streak: { current: 1, longest: 8, lastDay: '2026-05-03' } })
    const b = snap({ completed: { a: 3, c: 2 }, streak: { current: 2, longest: 4, lastDay: '2026-05-03' } })
    const ab = mergeProgress(a, b)
    const ba = mergeProgress(b, a)
    expect(ab.completed).toEqual(ba.completed)
    expect(ab.onboarded).toBe(ba.onboarded)
    expect(ab.streak.longest).toBe(ba.streak.longest)
  })

  it('is idempotent (merging a snapshot with itself returns the same data)', () => {
    const a = snap({ onboarded: true, completed: { a: 2, b: 3 }, streak: { current: 4, longest: 4, lastDay: '2026-05-12' } })
    expect(mergeProgress(a, a)).toEqual(normalizeProgress(a))
  })

  it('tolerates malformed input without throwing', () => {
    expect(() => mergeProgress(null, undefined)).not.toThrow()
    expect(() => mergeProgress({ completed: 'nope' }, { streak: 5 })).not.toThrow()
  })
})
