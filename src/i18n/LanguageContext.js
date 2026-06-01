import { createContext } from 'react'

/* Holds { locale, setLocale, t }. Default value is null so useLanguage can
   detect "used outside a provider" and throw a clear error. */
export const LanguageContext = createContext(null)
