/* =====================================================================
   buildDashboardModel — the pure read-model behind the Learner Dashboard.

   It turns the live `progress` object (the shape returned by useProgress:
   { completed, totalStars, completedCount, streak, isUnlocked, starsFor, ... })
   into everything the Dashboard renders. It is intentionally framework-free and
   total (it returns a sensible model for a brand-new user with zero progress),
   so it can be unit-tested without React and reused later by the Practice Hub.

   No data-model changes: this only READS existing progress + the static
   TRACKS/LEVELS curriculum. It never writes, and adds no Supabase fields.

   Returned shape:
   {
     hasProgress: boolean,            // false for a brand-new learner
     counts: { completed, total, percent },     // lessons
     xp: { stars, maxStars, percent },          // stars == XP
     streak: { current, longest, activeToday },
     continueLesson: { id, title, index, levelTag, isStart } | null,
     recommended:    { id, title, index, levelTag } | null,   // same target, framed as "next"
     recentLessons:  [{ id, title, levelTag, stars }],         // most-recently completed first-ish
     reviewTopics:   [{ id, title, levelTag, stars, index }],  // low-star completed, weakest first
     levels: [{ id, tag, title, total, completed, stars, maxStars, percent,
                state: 'done'|'in-progress'|'unlocked'|'locked', pro, comingSoon }],
   }
   ===================================================================== */
import { TRACKS_WITH_OFFSETS, LEVELS, MAX_STARS } from './tracks.js'

const STARS_PER_LESSON = 3
// A completed lesson scoring at or below this is a "review" candidate (1–2 of 3).
const LOW_STAR_THRESHOLD = 2
const MAX_RECENT = 4
const MAX_REVIEW = 4

const pct = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0)

/**
 * @param {object} progress  the useProgress() return value (or a compatible mock)
 * @returns {object} the dashboard view-model (see file header)
 */
export function buildDashboardModel(progress) {
  // Defensive defaults so a partial/mocked progress never throws.
  const completed = progress?.completed ?? {}
  const starsFor = progress?.starsFor ?? ((id) => completed[id] ?? 0)
  const isUnlocked = progress?.isUnlocked ?? (() => false)
  const completedCount = progress?.completedCount ?? Object.keys(completed).length
  const totalStars = progress?.totalStars ?? Object.values(completed).reduce((a, b) => a + b, 0)
  const streak = progress?.streak ?? { current: 0, longest: 0, activeToday: false }

  const total = LEVELS.length
  const hasProgress = completedCount > 0

  // Flat lesson list annotated with its track tag + flat index, in play order.
  const flat = []
  for (const track of TRACKS_WITH_OFFSETS) {
    for (const { level, index } of track.levels) {
      flat.push({ id: level.id, title: level.title, levelTag: track.tag, trackTitle: track.title, index })
    }
  }

  // --- Continue / Recommended -------------------------------------------------
  // The next lesson to play: first unlocked AND not completed. -1 if all done.
  const continueIdx = flat.findIndex((l) => isUnlocked(l.index) && !completed[l.id])
  let continueLesson = null
  if (continueIdx !== -1) {
    const l = flat[continueIdx]
    continueLesson = {
      id: l.id,
      title: l.title,
      index: l.index,
      levelTag: l.levelTag,
      // "Start" framing when the learner has done nothing yet.
      isStart: !hasProgress,
    }
  }
  // Recommended is the same target, framed as "what's next". (When everything is
  // done, there's nothing to recommend.)
  const recommended = continueLesson
    ? { id: continueLesson.id, title: continueLesson.title, index: continueLesson.index, levelTag: continueLesson.levelTag }
    : null

  // --- Recent completions -----------------------------------------------------
  // We have no per-lesson completion timestamp, so "recent" approximates as the
  // completed lessons nearest the learner's current position in play order
  // (the most-recently reached). This is stable and needs no schema change.
  const completedFlat = flat.filter((l) => completed[l.id])
  const anchor = continueIdx === -1 ? total : continueIdx // play frontier
  const recentLessons = completedFlat
    .slice()
    .sort((a, b) => Math.abs(a.index - anchor) - Math.abs(b.index - anchor) || b.index - a.index)
    .slice(0, MAX_RECENT)
    .map((l) => ({ id: l.id, title: l.title, levelTag: l.levelTag, stars: starsFor(l.id) }))

  // --- Review topics (low-star completed lessons) -----------------------------
  // Weakest first (fewest stars), then earliest in the course.
  const reviewTopics = completedFlat
    .filter((l) => starsFor(l.id) > 0 && starsFor(l.id) <= LOW_STAR_THRESHOLD)
    .sort((a, b) => starsFor(a.id) - starsFor(b.id) || a.index - b.index)
    .slice(0, MAX_REVIEW)
    .map((l) => ({ id: l.id, title: l.title, levelTag: l.levelTag, stars: starsFor(l.id), index: l.index }))

  // --- Per-level rollup cards (L0–L5) ----------------------------------------
  const levels = TRACKS_WITH_OFFSETS.map((track) => {
    const lessons = track.levels
    const doneCount = lessons.filter(({ level }) => completed[level.id]).length
    const stars = lessons.reduce((sum, { level }) => sum + starsFor(level.id), 0)
    const maxStars = lessons.length * STARS_PER_LESSON
    const firstIdx = lessons[0]?.index ?? 0
    const unlocked = isUnlocked(firstIdx)
    let state
    if (doneCount === lessons.length && lessons.length > 0) state = 'done'
    else if (doneCount > 0) state = 'in-progress'
    else if (unlocked) state = 'unlocked'
    else state = 'locked'
    return {
      id: track.id,
      tag: track.tag,
      title: track.title,
      total: lessons.length,
      completed: doneCount,
      stars,
      maxStars,
      percent: pct(doneCount, lessons.length),
      state,
      pro: Boolean(track.pro),
      comingSoon: track.comingSoon ?? null,
      firstIndex: firstIdx,
    }
  })

  // The level the learner is currently working through (for "current level
  // progress"): the track containing the continue target, else the last with
  // any progress, else the first.
  let currentLevel = levels[0]
  if (continueLesson) {
    const tag = continueLesson.levelTag
    currentLevel = levels.find((l) => l.tag === tag) ?? currentLevel
  } else if (hasProgress) {
    currentLevel = [...levels].reverse().find((l) => l.completed > 0) ?? currentLevel
  }

  return {
    hasProgress,
    counts: { completed: completedCount, total, percent: pct(completedCount, total) },
    xp: { stars: totalStars, maxStars: MAX_STARS, percent: pct(totalStars, MAX_STARS) },
    streak: {
      current: streak.current ?? 0,
      longest: streak.longest ?? 0,
      activeToday: Boolean(streak.activeToday),
    },
    continueLesson,
    recommended,
    recentLessons,
    reviewTopics,
    currentLevel,
    levels,
  }
}
