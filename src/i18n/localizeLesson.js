/* Deep overlay of a Uzbek lesson patch onto the English lesson.

   The patch MIRRORS the English structure and supplies translated strings
   wherever a field should be localized. The overlay is fully generic:

     - patch string            → overrides the base string at that path
     - patch array  + base array → merged element-wise BY INDEX (recursively)
     - patch object + base object → merged BY KEY (recursively)
     - a key present in the patch but ABSENT in the base → ignored
       (we only ever localize fields that already exist — a stray/typo'd key
        can never inject phantom data or change structure)
     - any base field the patch does not mention → kept as-is (English fallback)
     - non-string base values (numbers, booleans: weights, correctId, isCorrect,
       icon, kernel, pixels…) are preserved unless the patch explicitly supplies
       a replacement of the same kind — translations only ever supply strings,
       so all gameplay/logic fields survive untouched.

   English is the fallback for everything missing. Never mutates the input.
   This one function localizes the whole lesson body INCLUDING every activity
   `data` shape (pipeline, match, classify, predict, bias-grid, overfit-compare,
   neural, pixel-grid, convolve, calc, builder, featuremap, scenario, colab,
   review-queue, rate, compare, highlight, label-issues, rewrite, capstone, …)
   because the translation file simply mirrors the paths it wants translated. */

function deepOverlay(base, patch) {
  if (patch == null) return base

  // String override: only when the base is also a string (don't change types,
  // don't translate a numeric label like { label: 320 }).
  if (typeof patch === 'string') {
    if (typeof base === 'string' && patch.length > 0 && patch !== base) return patch
    return base
  }

  // Array: merge element-wise by index. Extra patch elements are ignored
  // (structure follows the English base).
  if (Array.isArray(patch)) {
    if (!Array.isArray(base)) return base
    let changed = false
    const out = base.map((el, i) => {
      const merged = deepOverlay(el, patch[i])
      if (merged !== el) changed = true
      return merged
    })
    return changed ? out : base
  }

  // Object: merge by key. Only keys that ALREADY exist in the base are touched.
  if (typeof patch === 'object') {
    if (base == null || typeof base !== 'object' || Array.isArray(base)) return base
    let out = base
    for (const key of Object.keys(patch)) {
      if (!(key in base)) continue // never inject new keys
      const merged = deepOverlay(base[key], patch[key])
      if (merged !== base[key]) {
        if (out === base) out = { ...base }
        out[key] = merged
      }
    }
    return out
  }

  return base
}

/**
 * @param {object} level  English lesson object
 * @param {object|null} patch  uz overlay mirroring the lesson's translatable paths
 * @returns {object} new lesson with uz overlaid, English fallback per field
 */
export function localizeLesson(level, patch) {
  if (!level || !patch) return level
  return deepOverlay(level, patch)
}

export { deepOverlay }
