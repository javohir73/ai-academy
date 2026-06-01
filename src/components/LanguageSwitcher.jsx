import { Globe } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * Compact EN/UZ segmented control used in the topbar, sidebar, and Home nav.
 * A globe icon labels it; each option is a button with aria-pressed reflecting
 * the active locale. Switching calls setLocale (state + persistence) — no reload.
 * Styling is in redesign-i18n.css; on mobile the control stays compact.
 */
export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useLanguage()
  const options = [
    { code: 'en', label: t('lang.en') },
    { code: 'uz', label: t('lang.uz') },
  ]
  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t('lang.switch.label')}>
      <Globe size={15} className="lang-switch__icon" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          className={`lang-switch__opt${locale === o.code ? ' lang-switch__opt--active' : ''}`}
          aria-pressed={locale === o.code}
          onClick={() => setLocale(o.code)}
        >
          {o.code.toUpperCase()}
          <span className="lang-switch__full">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
