import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import * as cloud from '../utils/cloudProgressService.js'

/*
 * Verifies the cloud-sync behaviour of useProgress with the cloud service
 * fully mocked (no network). The anonymous path is covered in useProgress.test.js.
 */

const user = { id: 'u1' }

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  // Make the service report "configured" so the sync effects run.
  vi.spyOn(cloud, 'isConfigured').mockReturnValue(true)
})
afterEach(() => vi.restoreAllMocks())

describe('useProgress — cloud sync', () => {
  it('anonymous (no user) never touches the cloud and stays syncState idle', async () => {
    const fetchSpy = vi.spyOn(cloud, 'fetchProgress')
    const saveSpy = vi.spyOn(cloud, 'saveProgress')
    const { result } = renderHook(() => useProgress(null))
    await act(async () => {})
    expect(result.current.syncState).toBe('idle')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('on sign-in, merges cloud progress into local without losing either', async () => {
    // Local device already has lesson A (2 stars).
    localStorage.setItem(
      'ai-academy:progress.v1',
      JSON.stringify({ onboarded: true, completed: { A: 2 }, streak: { current: 1, longest: 1, lastDay: '2026-05-20' } }),
    )
    // Cloud has lesson A (3 stars) and lesson B (1 star).
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue({
      onboarded: true,
      completed: { A: 3, B: 1 },
      streak: { current: 2, longest: 4, lastDay: '2026-05-19' },
      updatedAt: '2026-05-19T00:00:00Z',
    })
    const saveSpy = vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })

    const { result } = renderHook(() => useProgress(user))

    await waitFor(() => {
      // union of A,B; A keeps the higher (3); nothing erased
      expect(result.current.completed).toEqual({ A: 3, B: 1 })
    })
    expect(result.current.starsFor('A')).toBe(3)
    expect(result.current.starsFor('B')).toBe(1)
    // longest streak preserved from cloud; merged result pushed back up
    expect(saveSpy).toHaveBeenCalled()
    const pushed = saveSpy.mock.calls[0][1]
    expect(pushed.completed).toEqual({ A: 3, B: 1 })
    expect(pushed.streak.longest).toBe(4)
  })

  it('reports "saved" after a successful sync', async () => {
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue(null)
    vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })
    const { result } = renderHook(() => useProgress(user))
    await waitFor(() => expect(result.current.syncState).toBe('saved'))
  })

  it('reports "error" if the cloud save fails', async () => {
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue(null)
    vi.spyOn(cloud, 'saveProgress').mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useProgress(user))
    await waitFor(() => expect(result.current.syncState).toBe('error'))
  })

  it('pushes subsequent completions to the cloud (debounced)', async () => {
    vi.useFakeTimers()
    vi.spyOn(cloud, 'fetchProgress').mockResolvedValue(null)
    const saveSpy = vi.spyOn(cloud, 'saveProgress').mockResolvedValue({ ok: true })
    const { result } = renderHook(() => useProgress(user))

    // let the initial sign-in merge settle
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    saveSpy.mockClear()

    act(() => result.current.completeLevel('C', 3))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(900) // past the 800ms debounce
    })

    expect(saveSpy).toHaveBeenCalled()
    const pushed = saveSpy.mock.calls.at(-1)[1]
    expect(pushed.completed.C).toBe(3)
    vi.useRealTimers()
  })
})
