import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as svc from './cloudProgressService.js'

/*
 * The service is tested entirely against a FAKE Supabase client injected via
 * __setClientForTest — no real credentials, no network. The fake mimics just
 * the surface the service uses (auth.* and from().select()/upsert()).
 */
function makeFakeClient(over = {}) {
  const calls = { upsert: null, select: null }
  const fake = {
    __calls: calls,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: over.session ?? null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: over.row ?? null, error: null }),
        })),
      })),
      upsert: vi.fn((row) => {
        calls.upsert = row
        return Promise.resolve({ error: null })
      }),
    })),
  }
  return fake
}

afterEach(() => svc.__resetForTest())

describe('cloudProgressService — configuration', () => {
  it('isConfigured is true once a client is injected', () => {
    svc.__setClientForTest(makeFakeClient())
    expect(svc.isConfigured()).toBe(true)
  })
})

describe('cloudProgressService — auth', () => {
  beforeEach(() => svc.__setClientForTest(makeFakeClient({ session: { user: { id: 'u1' } } })))

  it('getSession returns the active session', async () => {
    const s = await svc.getSession()
    expect(s).toEqual({ user: { id: 'u1' } })
  })

  it('signUp / signIn / resetPassword call the client', async () => {
    await expect(svc.signUp('a@b.co', 'pw123456')).resolves.toBeTruthy()
    await expect(svc.signIn('a@b.co', 'pw123456')).resolves.toBeTruthy()
    await expect(svc.resetPassword('a@b.co')).resolves.toBeUndefined()
  })

  it('signUp rejects when the client returns an error', async () => {
    const fake = makeFakeClient()
    fake.auth.signUp.mockResolvedValue({ data: null, error: new Error('email taken') })
    svc.__setClientForTest(fake)
    await expect(svc.signUp('a@b.co', 'pw')).rejects.toThrow('email taken')
  })
})

describe('cloudProgressService — progress', () => {
  it('fetchProgress maps a row into a snapshot', async () => {
    svc.__setClientForTest(
      makeFakeClient({
        row: {
          onboarded: true,
          completed: { a: 3 },
          streak: { current: 2, longest: 5, lastDay: '2026-05-20' },
          updated_at: '2026-05-20T00:00:00Z',
        },
      }),
    )
    const p = await svc.fetchProgress('u1')
    expect(p).toEqual({
      onboarded: true,
      completed: { a: 3 },
      streak: { current: 2, longest: 5, lastDay: '2026-05-20' },
      updatedAt: '2026-05-20T00:00:00Z',
    })
  })

  it('fetchProgress returns null when there is no row', async () => {
    svc.__setClientForTest(makeFakeClient({ row: null }))
    expect(await svc.fetchProgress('u1')).toBeNull()
  })

  it('saveProgress upserts a row keyed by user_id with the snapshot data', async () => {
    const fake = makeFakeClient()
    svc.__setClientForTest(fake)
    await svc.saveProgress('u1', {
      onboarded: true,
      completed: { a: 2 },
      streak: { current: 1, longest: 3, lastDay: '2026-05-21' },
      updatedAt: '2026-05-21T10:00:00Z',
    })
    expect(fake.__calls.upsert).toMatchObject({
      user_id: 'u1',
      onboarded: true,
      completed: { a: 2 },
      streak: { current: 1, longest: 3, lastDay: '2026-05-21' },
      updated_at: '2026-05-21T10:00:00Z',
    })
  })

  it('saveProgress skips (no throw) when there is no user', async () => {
    svc.__setClientForTest(makeFakeClient())
    const res = await svc.saveProgress(null, { completed: {} })
    expect(res).toEqual({ ok: false, skipped: true })
  })
})
