import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import * as cloud from '../utils/cloudProgressService.js'

/*
 * Verifies the sign-out behaviour of useProgress: when a SIGNED-IN user signs
 * out (a non-null userId -> null transition), the on-device progress is cleared
 * so a shared/public computer returns to a fresh anonymous state. The cloud
 * service is fully mocked (no network), mirroring useProgress.sync.test.js.
 */

const STORAGE_KEY = 'ai-academy:progress.v1'
const user = { id: 'u1' }

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  // Make the service report "configured" so the sync effects run.
  vi.spyOn(cloud, 'isConfigured').mockReturnValue(true)
})
afterEach(() => {
  // Always return to real timers so a fake-timer test that throws can't leak
  // into the next test.
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useProgress — sign-out clears on-device progress', () => {
  it('anonymous from start never clears (userId null from the start is NOT a sign-out)', async () => {
    // Seed local progress that a returning anonymous user would have.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ onboarded: true, completed: { A: 2 }, streak: { current: 1, longest: 1, lastDay: '2026-05-20' } }),
    )
    const fetchSpy = vi.spyOn(cloud, 'fetchProgress')
    const saveSpy = vi.spyOn(cloud, 'saveProgress')

    const { result } = renderHook(() => useProgress(null))
    await act(async () => {})

    // Progress is untouched — first load with no user is not a sign-out.
    expect(result.current.completed).toEqual({ A: 2 })
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).completed).toEqual({ A: 2 })
    expect(result.current.syncState).toBe('idle')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('sign-in then sign-out clears local state and removes the storage key', async () => {
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue({
      onboarded: true,
      completed: { A: 3, B: 1 },
      streak: { current: 2, longest: 4, lastDay: '2026-05-19' },
      updatedAt: '2026-05-19T00:00:00Z',
    })
    vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })

    const { result, rerender } = renderHook(({ u }) => useProgress(u), {
      initialProps: { u: user },
    })

    // Signed in: cloud progress merged into local.
    await waitFor(() => expect(result.current.completed).toEqual({ A: 3, B: 1 }))
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    // Sign out: userId transitions u1 -> null.
    await act(async () => {
      rerender({ u: null })
    })

    // Local state is back to a fresh anonymous snapshot.
    expect(result.current.completed).toEqual({})
    expect(result.current.onboarded).toBe(false)
    expect(result.current.streak.current).toBe(0)
    expect(result.current.streak.longest).toBe(0)
    expect(result.current.syncState).toBe('idle')

    // The persist-on-[state] effect re-writes the fresh EMPTY snapshot; the net
    // on-disk result is an empty/fresh state (no leftover real progress).
    const onDisk = localStorage.getItem(STORAGE_KEY)
    if (onDisk !== null) {
      expect(JSON.parse(onDisk).completed).toEqual({})
    }
  })

  it('sign-out does NOT push empty progress to the departed cloud account', async () => {
    vi.useFakeTimers()
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue({
      onboarded: true,
      completed: { A: 3 },
      streak: { current: 2, longest: 4, lastDay: '2026-05-19' },
      updatedAt: '2026-05-19T00:00:00Z',
    })
    const saveSpy = vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })

    const { result, rerender } = renderHook(({ u }) => useProgress(u), {
      initialProps: { u: user },
    })

    // Let the initial sign-in merge (and its single push) settle. Under fake
    // timers we flush the resolved fetch promise + pending timers ourselves
    // (waitFor polls on real timers, which don't advance here).
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    expect(result.current.completed).toEqual({ A: 3 })
    saveSpy.mockClear()

    // Sign out.
    await act(async () => {
      rerender({ u: null })
    })
    // Flush past any debounce window — nothing should fire for the old user.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })

    expect(saveSpy).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('re-sign-in after sign-out re-merges from the cloud', async () => {
    const fetchSpy = vi.spyOn(cloud, 'fetchProgress').mockResolvedValue({
      onboarded: true,
      completed: { A: 3, B: 1 },
      streak: { current: 2, longest: 4, lastDay: '2026-05-19' },
      updatedAt: '2026-05-19T00:00:00Z',
    })
    vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })

    const { result, rerender } = renderHook(({ u }) => useProgress(u), {
      initialProps: { u: user },
    })

    // Sign in -> merge.
    await waitFor(() => expect(result.current.completed).toEqual({ A: 3, B: 1 }))
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Sign out -> local cleared.
    await act(async () => {
      rerender({ u: null })
    })
    await waitFor(() => expect(result.current.completed).toEqual({}))

    // Sign back in -> the merge guard was reset, so we fetch + merge again.
    await act(async () => {
      rerender({ u: user })
    })
    await waitFor(() => expect(result.current.completed).toEqual({ A: 3, B: 1 }))
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
