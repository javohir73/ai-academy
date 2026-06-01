import { describe, it, expect } from 'vitest'
import { buildDashboardModel } from './dashboardModel.js'
import { LEVELS, MAX_STARS } from './tracks.js'

/*
 * A faithful stand-in for the useProgress() return value, driven by a
 * { lessonId: stars } map. isUnlocked mirrors the real flat-index rule
 * (lesson N unlocks when lesson N-1 is completed) so the selector is exercised
 * against the genuine unlock semantics.
 */
function mockProgress(completed = {}, streak = { current: 0, longest: 0, activeToday: false }) {
  const idIndex = (id) => LEVELS.findIndex((l) => l.id === id)
  return {
    completed,
    starsFor: (id) => completed[id] ?? 0,
    isUnlocked: (index) => index <= 0 || Boolean(completed[LEVELS[index - 1]?.id]),
    completedCount: Object.keys(completed).length,
    totalStars: Object.values(completed).reduce((a, b) => a + b, 0),
    streak,
    _idIndex: idIndex,
  }
}

describe('buildDashboardModel — empty / new user', () => {
  const m = buildDashboardModel(mockProgress({}))

  it('reports no progress and zeroed counts', () => {
    expect(m.hasProgress).toBe(false)
    expect(m.counts).toEqual({ completed: 0, total: LEVELS.length, percent: 0 })
    expect(m.xp).toEqual({ stars: 0, maxStars: MAX_STARS, percent: 0 })
  })

  it('points the continue card at the very first lesson, framed as "start"', () => {
    expect(m.continueLesson).toBeTruthy()
    expect(m.continueLesson.id).toBe(LEVELS[0].id)
    expect(m.continueLesson.index).toBe(0)
    expect(m.continueLesson.isStart).toBe(true)
  })

  it('has empty recent + review lists and an intentional first-level current', () => {
    expect(m.recentLessons).toEqual([])
    expect(m.reviewTopics).toEqual([])
    expect(m.currentLevel.tag).toBe('Level 0')
    expect(m.levels.length).toBe(6) // L0–L5
  })

  it('survives a totally empty/undefined progress object without throwing', () => {
    expect(() => buildDashboardModel(undefined)).not.toThrow()
    expect(() => buildDashboardModel({})).not.toThrow()
    const z = buildDashboardModel({})
    expect(z.hasProgress).toBe(false)
  })
})

describe('buildDashboardModel — recommendation / continue logic', () => {
  it('recommends the first unlocked, not-yet-completed lesson', () => {
    // Completed the first 3 lessons → next is index 3 (what-ml).
    const completed = { 'what-is-data': 3, 'what-ai': 3, 'ai-ethics': 2 }
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.continueLesson.id).toBe(LEVELS[3].id)
    expect(m.continueLesson.index).toBe(3)
    expect(m.continueLesson.isStart).toBe(false)
    // recommended mirrors the continue target
    expect(m.recommended.id).toBe(m.continueLesson.id)
  })

  it('returns null continue/recommended when every lesson is complete', () => {
    const all = Object.fromEntries(LEVELS.map((l) => [l.id, 3]))
    const m = buildDashboardModel(mockProgress(all))
    expect(m.continueLesson).toBeNull()
    expect(m.recommended).toBeNull()
    expect(m.counts.percent).toBe(100)
    expect(m.levels.every((lv) => lv.state === 'done')).toBe(true)
  })

  it('the current level tracks the continue target’s track', () => {
    // Finish all of L0 + L1 + part of L2 → current level is Level 2.
    const completed = { 'what-is-data': 3, 'what-ai': 3, 'ai-ethics': 3, 'what-ml': 2 }
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.currentLevel.tag).toBe('Level 2')
  })
})

describe('buildDashboardModel — review topics (low-star ordering)', () => {
  it('selects only completed lessons scoring 1–2, weakest first', () => {
    const completed = {
      'what-is-data': 3, // perfect → excluded
      'what-ai': 2, // low
      'ai-ethics': 1, // lowest
      'what-ml': 3, // perfect → excluded
      'training-data': 2, // low
    }
    const m = buildDashboardModel(mockProgress(completed))
    const ids = m.reviewTopics.map((r) => r.id)
    // 3-star lessons excluded entirely
    expect(ids).not.toContain('what-is-data')
    expect(ids).not.toContain('what-ml')
    // weakest (1 star) first
    expect(m.reviewTopics[0].id).toBe('ai-ethics')
    expect(m.reviewTopics[0].stars).toBe(1)
    // remaining two are the 2-star lessons, earliest-in-course first
    expect(ids).toEqual(['ai-ethics', 'what-ai', 'training-data'])
  })

  it('caps the review list at 4 entries', () => {
    const completed = {}
    // 6 low-star completed lessons in a row
    for (const id of LEVELS.slice(0, 6).map((l) => l.id)) completed[id] = 1
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.reviewTopics.length).toBe(4)
  })
})

describe('buildDashboardModel — counts, XP, and level rollups', () => {
  it('counts completed lessons, stars, and percentages correctly', () => {
    const completed = { 'what-is-data': 3, 'what-ai': 2, 'ai-ethics': 1 }
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.counts.completed).toBe(3)
    expect(m.counts.total).toBe(LEVELS.length)
    expect(m.xp.stars).toBe(6) // 3+2+1
    expect(m.xp.maxStars).toBe(MAX_STARS)
  })

  it('rolls each level up to a state and per-level stars', () => {
    // Complete all of Level 0 (1 lesson) and start Level 1.
    const completed = { 'what-is-data': 3, 'what-ai': 2 }
    const m = buildDashboardModel(mockProgress(completed))
    const l0 = m.levels.find((l) => l.tag === 'Level 0')
    const l1 = m.levels.find((l) => l.tag === 'Level 1')
    const l2 = m.levels.find((l) => l.tag === 'Level 2')
    expect(l0.state).toBe('done')
    expect(l0.percent).toBe(100)
    expect(l1.state).toBe('in-progress')
    expect(l1.stars).toBe(2)
    // L2 is unlocked only once L1 finishes; here L1 is not done → L2 locked.
    expect(l2.state).toBe('locked')
  })

  it('marks a level unlocked (not locked) once its first lesson is reachable', () => {
    // Finish L0 entirely → L1 becomes unlocked but untouched.
    const m = buildDashboardModel(mockProgress({ 'what-is-data': 3 }))
    const l1 = m.levels.find((l) => l.tag === 'Level 1')
    expect(l1.state).toBe('unlocked')
  })
})

describe('buildDashboardModel — recent lessons', () => {
  it('surfaces completed lessons and reports their stars', () => {
    const completed = { 'what-is-data': 3, 'what-ai': 2, 'ai-ethics': 3 }
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.recentLessons.length).toBe(3)
    expect(m.recentLessons.every((r) => r.stars >= 1)).toBe(true)
    // every recent entry is actually a completed lesson
    for (const r of m.recentLessons) expect(completed[r.id]).toBeTruthy()
  })

  it('caps the recent list at 4 entries', () => {
    const completed = {}
    for (const id of LEVELS.slice(0, 6).map((l) => l.id)) completed[id] = 3
    const m = buildDashboardModel(mockProgress(completed))
    expect(m.recentLessons.length).toBe(4)
  })
})
