/* Lazy loader for the heavy Uzbek curriculum corpus.

   curriculum.uz.js statically pulls in the three large body files
   (body.l2/l4/l5.uz.js) — ~270 KB of translation data. We must NOT ship that to
   English-only visitors, so it lives behind a dynamic import() that Vite splits
   into its own chunk. English users never fetch it; Uzbek users fetch it once
   and the module cache (plus the in-flight-promise guard) keeps it to a single
   network request per session.

   Same instinct as Hero3D's `await import('three')` and cloudProgressService's
   lazy Supabase SDK — apply it to the i18n layer. */

let cached = null // resolved CURRICULUM_UZ once loaded
let inFlight = null // de-dupes concurrent callers during the first load

/**
 * Resolve the Uzbek curriculum map ({ tracks, lessons }), loading its chunk on
 * first use. Subsequent calls return the cached module synchronously-fast
 * (still a resolved promise). Returns null-safe: callers fall back to English
 * until the promise resolves.
 * @returns {Promise<{tracks: object, lessons: object}>}
 */
export function loadCurriculumUz() {
  if (cached) return Promise.resolve(cached)
  if (!inFlight) {
    inFlight = import('./curriculum.uz.js')
      .then((m) => {
        cached = m.CURRICULUM_UZ
        return cached
      })
      .catch((err) => {
        inFlight = null // allow a retry on a transient chunk-load failure
        throw err
      })
  }
  return inFlight
}

/** Test seam: reset the module cache between tests. */
export function __resetCurriculumUzForTest() {
  cached = null
  inFlight = null
}
