import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import * as cloud from '../utils/cloudProgressService.js'

const USER = { id: 'u1', email: 'a@b.co' }

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(cloud, 'isConfigured').mockReturnValue(true)
})

describe('useProgress retrySync', () => {
  it('re-runs the cloud merge after a failure when retrySync() is called', async () => {
    const fetchSpy = vi
      .spyOn(cloud, 'fetchProgress')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ onboarded: true, completed: {}, streak: { current: 0, longest: 0, lastDay: null }, updatedAt: null })
    vi.spyOn(cloud, 'saveProgress').mockResolvedValue()

    const { result } = renderHook(() => useProgress(USER))

    await waitFor(() => expect(result.current.syncState).toBe('error'))
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    act(() => result.current.retrySync())

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(result.current.syncState).toBe('saved'))
  })
})
