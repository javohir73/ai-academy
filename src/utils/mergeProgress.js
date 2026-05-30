/*
 * mergeProgress — pure, dependency-free merge of two progress snapshots.
 *
 * Used when a learner signs in: their LOCAL (this-device) progress is merged
 * with their CLOUD (account) progress so neither is ever lost. The merge is
 * symmetric and idempotent, and it is the single source of truth for the
 * "never erase progress" rule — so it is heavily unit-tested.
 *
 * Progress snapshot shape (matches useProgress / the `progress` table):
 *   {
 *     onboarded: boolean,
 *     completed: { [lessonId: string]: number },   // best star score (1..3)
 *     streak:    { current: number, longest: number, lastDay: string|null },
 *     updatedAt: string|null,                        // ISO timestamp
 *   }
 *
 * Merge rules:
 *   - completed : UNION of lesson ids; per lesson keep the HIGHER star score.
 *   - onboarded : true if EITHER side is onboarded.
 *   - streak    : keep the higher `longest`; for `current`/`lastDay` trust the
 *                 side with the more recent `lastDay` (a streak is about the
 *                 latest activity day). Falls back gracefully if a side is empty.
 *   - updatedAt : the newer of the two timestamps (or now, stamped by caller).
 */

const EMPTY = {
  onboarded: false,
  completed: {},
  streak: { current: 0, longest: 0, lastDay: null },
  updatedAt: null,
}

/** Coerce an arbitrary value into a valid progress snapshot (never throws). */
export function normalizeProgress(p) {
  if (!p || typeof p !== 'object') return { ...EMPTY, streak: { ...EMPTY.streak } }
  const s = p.streak && typeof p.streak === 'object' ? p.streak : {}
  const completed = {}
  if (p.completed && typeof p.completed === 'object') {
    for (const [id, stars] of Object.entries(p.completed)) {
      const n = Number(stars)
      if (Number.isFinite(n) && n > 0) completed[id] = Math.min(3, Math.round(n))
    }
  }
  return {
    onboarded: Boolean(p.onboarded),
    completed,
    streak: {
      current: Number(s.current) || 0,
      longest: Number(s.longest) || 0,
      lastDay: typeof s.lastDay === 'string' ? s.lastDay : null,
    },
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : null,
  }
}

/** Higher (lexicographically-comparable ISO) timestamp, or null. */
function newerTimestamp(a, b) {
  if (a && b) return a > b ? a : b
  return a || b || null
}

/**
 * Merge two progress snapshots without ever losing progress.
 * @param {object} a one snapshot (e.g. local)
 * @param {object} b the other snapshot (e.g. cloud)
 * @returns {object} a new merged snapshot
 */
export function mergeProgress(a, b) {
  const x = normalizeProgress(a)
  const y = normalizeProgress(b)

  // completed: union, higher stars win.
  const completed = { ...x.completed }
  for (const [id, stars] of Object.entries(y.completed)) {
    completed[id] = Math.max(completed[id] ?? 0, stars)
  }

  // streak: keep the best `longest`; current/lastDay follow the latest active day.
  const longest = Math.max(x.streak.longest, y.streak.longest)
  let current, lastDay
  if (x.streak.lastDay && y.streak.lastDay) {
    if (x.streak.lastDay > y.streak.lastDay) {
      current = x.streak.current
      lastDay = x.streak.lastDay
    } else if (y.streak.lastDay > x.streak.lastDay) {
      current = y.streak.current
      lastDay = y.streak.lastDay
    } else {
      // Same day on both — keep the higher current count.
      current = Math.max(x.streak.current, y.streak.current)
      lastDay = x.streak.lastDay
    }
  } else if (x.streak.lastDay) {
    current = x.streak.current
    lastDay = x.streak.lastDay
  } else if (y.streak.lastDay) {
    current = y.streak.current
    lastDay = y.streak.lastDay
  } else {
    current = Math.max(x.streak.current, y.streak.current)
    lastDay = null
  }

  return {
    onboarded: x.onboarded || y.onboarded,
    completed,
    streak: { current, longest, lastDay },
    updatedAt: newerTimestamp(x.updatedAt, y.updatedAt),
  }
}
