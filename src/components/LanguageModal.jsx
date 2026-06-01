import { Globe } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * First-visit language choice. Mirrors AuthModal's overlay/dialog structure
 * (role="dialog" + aria-modal). Picking a language persists it (via setLocale)
 * and calls onClose. App decides WHETHER to render it (only when no saved
 * preference). It is independent of AuthModal and never touches progress.
 */
export default function LanguageModal({ open, onClose }) {
  const { setLocale, t } = useLanguage()
  if (!open) return null

  function choose(code) {
    setLocale(code)
    onClose()
  }

  return (
    <div className="lang-overlay" role="presentation">
      <div className="lang-modal glass-card" role="dialog" aria-modal="true" aria-label={t('lang.modal.title')}>
        <div className="lang-modal__icon" aria-hidden="true">
          <Globe size={24} />
        </div>
        <h2 className="lang-modal__title">{t('lang.modal.title')}</h2>
        <p className="lang-modal__sub">{t('lang.modal.subtitle')}</p>
        <div className="lang-modal__choices">
          <button className="btn btn--primary btn--block" onClick={() => choose('en')}>
            {t('lang.en')}
          </button>
          <button className="btn btn--secondary btn--block" onClick={() => choose('uz')}>
            {t('lang.uz')}
          </button>
        </div>
      </div>
    </div>
  )
}
