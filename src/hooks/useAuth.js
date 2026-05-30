import { useCallback, useEffect, useState } from 'react'
import * as cloud from '../utils/cloudProgressService.js'

/*
 * useAuth — a thin React wrapper over cloudProgressService's auth surface.
 *
 * It exposes the current user/session and the auth actions, plus `configured`
 * (false when Supabase env vars are absent → the UI shows local-only mode and
 * hides sign-in). All Supabase access stays in the service; this hook only
 * holds React state.
 */
export function useAuth() {
  const configured = cloud.isConfigured()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(configured) // only "loading" if we can have a session

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    let active = true
    cloud
      .getSession()
      .then((s) => active && setSession(s))
      .catch(() => {})
      .finally(() => active && setLoading(false))

    const unsub = cloud.onAuthChange((s) => active && setSession(s))
    return () => {
      active = false
      unsub?.()
    }
  }, [configured])

  const signUp = useCallback((email, password) => cloud.signUp(email, password), [])
  const signIn = useCallback((email, password) => cloud.signIn(email, password), [])
  const signOut = useCallback(() => cloud.signOut(), [])
  const resetPassword = useCallback((email) => cloud.resetPassword(email), [])

  return {
    configured,
    loading,
    session,
    user: session?.user ?? null,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }
}
