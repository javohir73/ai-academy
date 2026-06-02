import { useMemo } from 'react'
import { TRACKS } from '../data/tracks.js'
import { useLanguage } from './useLanguage.js'
import { localizeTracks } from './localizeTracks.js'

/**
 * Curriculum localized to the active locale. Returns:
 *   { tracks, tracksWithOffsets, levels }
 * tracks: localized TRACKS; levels: flat play order; tracksWithOffsets: each
 * level annotated with its global flat index (for unlock/nav), like the raw
 * TRACKS_WITH_OFFSETS export.
 *
 * The Uzbek corpus is code-split and supplied by the provider via context
 * (`uzCurriculum`); it's null until its chunk loads, so under `uz` this returns
 * English until the data arrives, then re-renders to Uzbek. English never loads it.
 */
export function useLocalizedTracks() {
  const { locale, uzCurriculum } = useLanguage()
  return useMemo(() => {
    const uzMap = locale === 'uz' ? uzCurriculum : undefined
    const tracks = localizeTracks(TRACKS, locale, uzMap)
    const levels = tracks.flatMap((t) => t.levels)
    let offset = 0
    const tracksWithOffsets = tracks.map((track) => {
      const lv = track.levels.map((level, i) => ({ level, index: offset + i }))
      offset += track.levels.length
      return { ...track, levels: lv }
    })
    return { tracks, tracksWithOffsets, levels }
  }, [locale, uzCurriculum])
}
