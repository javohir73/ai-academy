import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext.js'
import { detectLocale } from './detectLocale.js'
import { createT } from './strings.js'
import { loadCurriculumUz } from './loadCurriculumUz.js'

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

  // The heavy Uzbek curriculum corpus is code-split and fetched on demand. It's
  // null until loaded; useLocalizedTracks falls back to English in the meantime,
  // then re-renders to Uzbek once this resolves. English visitors never fetch it.
  const [uzCurriculum, setUzCurriculum] = useState(null)

  useEffect(() => {
    if (locale !== 'uz' || uzCurriculum) return
    let alive = true
    loadCurriculumUz()
      .then((map) => {
        if (alive) setUzCurriculum(map)
      })
      .catch(() => {
        /* chunk failed to load — stay on English fallback, no crash */
      })
    return () => {
      alive = false
    }
  }, [locale, uzCurriculum])

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
    () => ({ locale, setLocale, t: createT(locale), uzCurriculum }),
    [locale, setLocale, uzCurriculum],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
