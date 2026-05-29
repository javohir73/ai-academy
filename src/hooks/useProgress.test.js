import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import { LEVELS, MAX_STARS } from '../data/tracks.js'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('MAX_STARS equals 3 per lesson', () => {
    expect(MAX_STARS).toBe(LEVELS.length * 3)
  })

  it('only the first lesson is unlocked initially', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.isUnlocked(0)).toBe(true)
    expect(result.current.isUnlocked(1)).toBe(false)
  })

  it('completing a lesson unlocks the next one', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.completeLevel(LEVELS[0].id, 3)
    })
    expect(result.current.isUnlocked(1)).toBe(true)
  })

  it('keeps the best star score for a lesson', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLevel(LEVELS[0].id, 2))
    act(() => result.current.completeLevel(LEVELS[0].id, 1))
    expect(result.current.starsFor(LEVELS[0].id)).toBe(2)
  })
})
