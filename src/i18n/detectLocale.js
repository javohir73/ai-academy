/* Pure locale resolution. Order: valid saved preference → browser language
   matching /^uz/i → English default. Framework-free + total (never throws). */

export const LOCALES = ['en', 'uz']

export function detectLocale(saved, navigatorLanguages) {
  if (saved === 'en' || saved === 'uz') return saved
  const langs = Array.isArray(navigatorLanguages) ? navigatorLanguages : []
  for (const l of langs) {
    if (typeof l === 'string' && /^uz/i.test(l)) return 'uz'
  }
  return 'en'
}
