/* Pure per-field overlay of Uzbek curriculum strings onto the English base.
   English is the fallback for any missing locale field. Never mutates input. */

const TRACK_FIELDS = ['tag', 'title', 'blurb', 'comingSoon']
const LESSON_FIELDS = ['title', 'concept']

function overlay(base, patch, fields) {
  if (!patch) return base
  let out = base
  for (const f of fields) {
    if (typeof patch[f] === 'string' && patch[f].length > 0) {
      if (out === base) out = { ...base }
      out[f] = patch[f]
    }
  }
  return out
}

/**
 * @param {Array} tracks  the English TRACKS array
 * @param {'en'|'uz'} locale
 * @param {{tracks: object, lessons: object}} uzMap  keyed by stable id
 * @returns {Array} new tracks array with uz overlaid (en untouched)
 */
export function localizeTracks(tracks, locale, uzMap) {
  if (locale !== 'uz' || !uzMap) return tracks
  const trackPatches = uzMap.tracks ?? {}
  const lessonPatches = uzMap.lessons ?? {}
  return tracks.map((track) => {
    const localizedLevels = track.levels.map((level) =>
      overlay(level, lessonPatches[level.id], LESSON_FIELDS),
    )
    const t = overlay(track, trackPatches[track.id], TRACK_FIELDS)
    const changedLevels = localizedLevels.some((l, i) => l !== track.levels[i])
    if (t === track && !changedLevels) return track
    return { ...t, levels: localizedLevels }
  })
}
