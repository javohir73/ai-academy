import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import { useLocalizedTracks } from './useLocalizedTracks.js'

beforeEach(() => localStorage.clear())

const wrap = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

describe('useLocalizedTracks', () => {
  it('returns English curriculum under en', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    const l0 = result.current.tracks.find((t) => t.id === 'level-0')
    expect(l0.title).toBe('Foundations')
    expect(result.current.levels.find((l) => l.id === 'what-is-data').title).toBe('What Is Data?')
  })

  it('returns Uzbek curriculum under uz', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    const l0 = result.current.tracks.find((t) => t.id === 'level-0')
    expect(l0.title).toBe('Asoslar')
    expect(result.current.levels.find((l) => l.id === 'what-is-data').title).toBe('Ma’lumot nima?')
  })

  it('exposes tracks, tracksWithOffsets (with index), and flat levels', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    expect(result.current.tracks.length).toBe(6)
    expect(result.current.levels.length).toBe(37)
    const two = result.current.tracksWithOffsets.find((t) => t.id === 'level-2')
    expect(two.levels[0]).toHaveProperty('index')
    const one = result.current.tracksWithOffsets.find((t) => t.id === 'level-1')
    expect(one.levels[0].index).toBe(1)
  })
})
