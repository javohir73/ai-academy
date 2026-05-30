/*
 * cloudProgressService — the single boundary between the app and Supabase.
 *
 * Design goals:
 *   - NO Supabase calls anywhere else in the app (hooks/components use this).
 *   - Graceful local-only mode: if env vars are missing, isConfigured() is
 *     false and nothing ever hits the network — the app is a pure offline PWA.
 *   - Only the PUBLIC anon key is used (never a service_role key). RLS in the
 *     database is what actually protects each user's rows.
 *   - Testable: __setClientForTest() injects a fake client so tests never need
 *     real credentials or network (mirrors pyodideService's test seam).
 *
 * Progress row shape in the `progress` table (see supabase/schema.sql):
 *   { user_id uuid PK, onboarded bool, completed jsonb, streak jsonb,
 *     updated_at timestamptz }
 */

const URL = import.meta.env?.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY

let client = null // lazily created real client (or an injected fake in tests)
let clientPromise = null
let testClient = undefined // set by __setClientForTest

/** True only when both public env vars are present. */
export function isConfigured() {
  if (testClient !== undefined) return true
  return Boolean(URL && ANON_KEY)
}

/** TEST ONLY: inject a fake Supabase client. Use a fake to simulate "configured";
 *  pass null to simulate a configured-but-clientless edge; call
 *  __resetForTest() to return to the real (env-driven) behaviour. */
export function __setClientForTest(fake) {
  testClient = fake
  client = fake ?? null
  clientPromise = null
}

/** TEST ONLY: clear the injected client so isConfigured() reflects env again. */
export function __resetForTest() {
  testClient = undefined
  client = null
  clientPromise = null
}

/**
 * Get (lazily creating) the Supabase client, or null if not configured.
 * The real client is dynamically imported so the SDK isn't bundled into the
 * critical path for local-only users.
 */
async function getClient() {
  if (testClient !== undefined) return testClient
  if (!isConfigured()) return null
  if (client) return client
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      client = createClient(URL, ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
      return client
    })
  }
  return clientPromise
}

/* --------------------------- auth --------------------------- */

/** Current session ({ user } | null). Never throws. */
export async function getSession() {
  const c = await getClient()
  if (!c) return null
  const { data } = await c.auth.getSession()
  return data?.session ?? null
}

/**
 * Subscribe to auth changes. Returns an unsubscribe function (no-op if
 * unconfigured). Callback receives the session (or null).
 */
export function onAuthChange(cb) {
  let sub
  let active = true
  getClient().then((c) => {
    if (!c || !active) return
    const res = c.auth.onAuthStateChange((_event, session) => cb(session ?? null))
    sub = res?.data?.subscription
  })
  return () => {
    active = false
    sub?.unsubscribe?.()
  }
}

export async function signUp(email, password) {
  const c = await getClient()
  if (!c) throw new Error('not-configured')
  const { data, error } = await c.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const c = await getClient()
  if (!c) throw new Error('not-configured')
  const { data, error } = await c.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const c = await getClient()
  if (!c) return
  await c.auth.signOut()
}

/** Send a password-reset email (redirects back to the app). */
export async function resetPassword(email) {
  const c = await getClient()
  if (!c) throw new Error('not-configured')
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined
  const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) throw error
}

/* ------------------------- progress ------------------------- */

/**
 * Fetch the signed-in user's progress row, or null if none yet.
 * @returns {Promise<object|null>} a progress snapshot or null
 */
export async function fetchProgress(userId) {
  const c = await getClient()
  if (!c || !userId) return null
  const { data, error } = await c
    .from('progress')
    .select('onboarded, completed, streak, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    onboarded: Boolean(data.onboarded),
    completed: data.completed ?? {},
    streak: data.streak ?? { current: 0, longest: 0, lastDay: null },
    updatedAt: data.updated_at ?? null,
  }
}

/**
 * Upsert the signed-in user's progress. `state` is a progress snapshot.
 * RLS ensures a user can only write their own row.
 */
export async function saveProgress(userId, state) {
  const c = await getClient()
  if (!c || !userId) return { ok: false, skipped: true }
  const row = {
    user_id: userId,
    onboarded: Boolean(state.onboarded),
    completed: state.completed ?? {},
    streak: state.streak ?? { current: 0, longest: 0, lastDay: null },
    updated_at: state.updatedAt ?? new Date().toISOString(),
  }
  const { error } = await c.from('progress').upsert(row, { onConflict: 'user_id' })
  if (error) throw error
  return { ok: true }
}
