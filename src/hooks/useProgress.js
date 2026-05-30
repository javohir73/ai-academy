import { useCallback, useEffect, useRef, useState } from 'react'
import { LEVELS } from '../data/tracks.js'
import * as cloud from '../utils/cloudProgressService.js'
import { mergeProgress } from '../utils/mergeProgress.js'

/*
 * useProgress — owns everything we save about the learner.
 *
 * localStorage is ALWAYS the source of truth on this device (so the app works
 * fully offline / for anonymous users — the original behaviour is unchanged).
 *
 * Optionally, when a signed-in `user` is passed, progress also syncs to the
 * cloud (Supabase) via cloudProgressService:
 *   - on sign-in: cloud + local are MERGED (mergeProgress) so nothing is lost;
 *   - thereafter: changes are debounced-pushed to the cloud.
 * `syncState` reports 'idle' | 'syncing' | 'saved' | 'offline' | 'error'.
 *
 * Backward compatible: useProgress() with no argument behaves exactly as before
 * (pure local, syncState 'idle').
 *
 * Stored shape:
 *   { onboarded, completed: { [levelId]: stars }, streak: { current, longest, lastDay } }
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

export function useProgress(user = null) {
  const [state, setState] = useState(loadInitial)
  const [syncState, setSyncState] = useState('idle') // idle|syncing|saved|offline|error
  const userId = user?.id ?? null
  const mergedForUser = useRef(null) // which userId we've already merged for this session
  const saveTimer = useRef(null)
  const skipNextPush = useRef(false) // don't immediately re-push a cloud-sourced merge's own write

  // Persist to localStorage on every change (always — the offline source of truth).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage might be full or blocked; the app still works in-memory */
    }
  }, [state])

  // On sign-in: merge cloud progress into local once, then mark synced.
  useEffect(() => {
    if (!userId || !cloud.isConfigured()) {
      if (!userId) setSyncState('idle')
      return
    }
    if (mergedForUser.current === userId) return
    mergedForUser.current = userId
    let active = true
    setSyncState('syncing')
    ;(async () => {
      try {
        const cloudSnap = await cloud.fetchProgress(userId)
        if (!active) return
        setState((local) => {
          const merged = mergeProgress({ ...local, updatedAt: null }, cloudSnap)
          // strip helper field that local state doesn't carry
          const next = { onboarded: merged.onboarded, completed: merged.completed, streak: merged.streak }
          // push the merged result up so cloud reflects the union too
          cloud
            .saveProgress(userId, { ...next, updatedAt: new Date().toISOString() })
            .then(() => active && setSyncState('saved'))
            .catch(() => active && setSyncState('error'))
          skipNextPush.current = true // the line above is our push; don't double-send
          return next
        })
      } catch {
        if (active) setSyncState('error')
      }
    })()
    return () => {
      active = false
    }
  }, [userId])

  // Reset the "merged" guard when the user logs out, so a later login re-merges.
  useEffect(() => {
    if (!userId) mergedForUser.current = null
  }, [userId])

  // Debounced push to cloud whenever state changes while signed in.
  useEffect(() => {
    if (!userId || !cloud.isConfigured()) return
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }
    setSyncState('syncing')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      cloud
        .saveProgress(userId, { ...state, updatedAt: new Date().toISOString() })
        .then(() => setSyncState('saved'))
        .catch(() => setSyncState('error'))
    }, 800)
    return () => clearTimeout(saveTimer.current)
  }, [state, userId])

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
    syncState: userId ? syncState : 'idle',
  }
}
