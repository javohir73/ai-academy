/* Test helper: a drop-in replacement for @testing-library/react's `render`
   that wraps the tree in <LanguageProvider> so components calling useLanguage()
   work. Re-exports everything else from RTL, so a test file can simply switch
   its import source from '@testing-library/react' to this module.

   The default locale resolves to English (no saved preference in jsdom), which
   matches the literal English strings the existing activity tests assert. */
import { render as rtlRender } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageProvider.jsx'

export * from '@testing-library/react'

export function render(ui, options) {
  return rtlRender(ui, { wrapper: LanguageProvider, ...options })
}
