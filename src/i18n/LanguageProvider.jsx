import { useCallback, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext.js'
import { detectLocale } from './detectLocale.js'
import { createT } from './strings.js'

export const LANG_STORAGE_KEY = 'ai-academy:lang.v1'

function readSaved() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY)
  } catch {
    return null // storage blocked → treat as no saved preference
  }
}

/** Whether a language preference has been explicitly saved (drives the modal). */
export function hasSavedLanguage() {
  const v = readSaved()
  return v === 'en' || v === 'uz'
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const langs = typeof navigator !== 'undefined' ? navigator.languages : []
    return detectLocale(readSaved(), langs)
  })

  const setLocale = useCallback((next) => {
    if (next !== 'en' && next !== 'uz') return
    setLocaleState(next) // in-memory update always succeeds (no reload, no reset)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, t: createT(locale) }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
