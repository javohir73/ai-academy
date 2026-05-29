import { useCallback, useEffect, useState } from 'react'
import { LEVELS } from '../data/tracks.js'

/*
 * useProgress — owns everything we save about the learner and persists it to
 * localStorage so progress survives a page refresh. No backend required.
 *
 * Stored shape:
 *   {
 *     onboarded: boolean,             // has the learner passed the welcome screen?
 *     completed: { [levelId]: stars } // best star score (1-3) per finished level
 *     streak:    { current, longest, lastDay }  // daily-practice streak (retention)
 *   }
 *
 * Unlock rule: the first level is always unlocked; every other level unlocks
 * once the level before it is completed.
 */

const STORAGE_KEY = 'ai-academy:progress.v1'

const EMPTY = { onboarded: false, completed: {}, streak: { current: 0, longest: 0, lastDay: null } }

/** Local calendar day as YYYY-MM-DD (so a streak is about *days*, not 24h windows). */
function dayKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function offsetDayKey(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return dayKey(d)
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    const s = parsed.streak && typeof parsed.streak === 'object' ? parsed.streak : {}
    return {
      onboarded: Boolean(parsed.onboarded),
      completed: parsed.completed && typeof parsed.completed === 'object' ? parsed.completed : {},
      streak: {
        current: Number(s.current) || 0,
        longest: Number(s.longest) || 0,
        lastDay: typeof s.lastDay === 'string' ? s.lastDay : null,
      },
    }
  } catch {
    // Corrupted or unavailable storage — start fresh rather than crash.
    return EMPTY
  }
}

export function useProgress() {
  const [state, setState] = useState(loadInitial)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage might be full or blocked; the app still works in-memory */
    }
  }, [state])

  const setOnboarded = useCallback(() => {
    setState((s) => (s.onboarded ? s : { ...s, onboarded: true }))
  }, [])

  /**
   * Record a level as complete. Keeps the learner's BEST star score, and
   * advances the daily streak the first time a lesson is finished on a new day.
   */
  const completeLevel = useCallback((levelId, stars) => {
    setState((s) => {
      const today = dayKey(new Date())
      const yesterday = offsetDayKey(-1)

      // Streak advances once per calendar day on any completion.
      let streak = s.streak
      if (s.streak.lastDay !== today) {
        const current = s.streak.lastDay === yesterday ? s.streak.current + 1 : 1
        streak = { current, longest: Math.max(s.streak.longest, current), lastDay: today }
      }

      const prev = s.completed[levelId] ?? 0
      const completed = stars > prev ? { ...s.completed, [levelId]: stars } : s.completed

      if (completed === s.completed && streak === s.streak) return s
      return { ...s, completed, streak }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setState({ onboarded: true, completed: {}, streak: { current: 0, longest: 0, lastDay: null } })
  }, [])

  /** Is the level at this index unlocked yet? */
  const isUnlocked = useCallback(
    (index) => {
      if (index <= 0) return true
      const prevLevel = LEVELS[index - 1]
      return Boolean(state.completed[prevLevel.id])
    },
    [state.completed],
  )

  const starsFor = useCallback((levelId) => state.completed[levelId] ?? 0, [state.completed])

  const totalStars = Object.values(state.completed).reduce((sum, n) => sum + n, 0)
  const completedCount = Object.keys(state.completed).length

  // A streak only counts if the learner practised today or yesterday; otherwise
  // it has lapsed and we show 0 (the stored value stays until the next session).
  const today = dayKey(new Date())
  const streakActive = state.streak.lastDay === today || state.streak.lastDay === offsetDayKey(-1)
  const streak = {
    current: streakActive ? state.streak.current : 0,
    longest: state.streak.longest,
    activeToday: state.streak.lastDay === today,
  }

  return {
    onboarded: state.onboarded,
    completed: state.completed,
    setOnboarded,
    completeLevel,
    resetProgress,
    isUnlocked,
    starsFor,
    totalStars,
    completedCount,
    streak,
  }
}
