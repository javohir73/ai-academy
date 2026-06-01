import { useMemo } from 'react'
import { TRACKS } from '../data/tracks.js'
import { useLanguage } from './useLanguage.js'
import { localizeTracks } from './localizeTracks.js'
import { CURRICULUM_UZ } from './curriculum.uz.js'

const BY_LOCALE = { uz: CURRICULUM_UZ }

/**
 * Curriculum localized to the active locale. Returns:
 *   { tracks, tracksWithOffsets, levels }
 * tracks: localized TRACKS; levels: flat play order; tracksWithOffsets: each
 * level annotated with its global flat index (for unlock/nav), like the raw
 * TRACKS_WITH_OFFSETS export.
 */
export function useLocalizedTracks() {
  const { locale } = useLanguage()
  return useMemo(() => {
    const tracks = localizeTracks(TRACKS, locale, BY_LOCALE[locale])
    const levels = tracks.flatMap((t) => t.levels)
    let offset = 0
    const tracksWithOffsets = tracks.map((track) => {
      const lv = track.levels.map((level, i) => ({ level, index: offset + i }))
      offset += track.levels.length
      return { ...track, levels: lv }
    })
    return { tracks, tracksWithOffsets, levels }
  }, [locale])
}
