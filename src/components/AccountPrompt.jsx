import { useEffect, useState } from 'react'
import { X, Cloud, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * AccountPrompt — a subtle, dismissible nudge to create an account, shown only
 * AFTER meaningful progress (default: 3 completed lessons) so it never greets a
 * first-time visitor. Dismissal is remembered in localStorage.
 *
 * Only renders when:
 *   - accounts are configured (Supabase env present), AND
 *   - the learner is anonymous (no user), AND
 *   - completedCount >= threshold, AND
 *   - not previously dismissed.
 */
const DISMISS_KEY = 'ai-academy:account-prompt-dismissed.v1'
const THRESHOLD = 3

export default function AccountPrompt({ configured, user, completedCount, onSignUpClick }) {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  const [entered, setEntered] = useState(false)

  const shouldShow = configured && !user && completedCount >= THRESHOLD && !dismissed

  // Trigger the slide-in only once it should show (so the animation plays).
  useEffect(() => {
    if (shouldShow) {
      const t = setTimeout(() => setEntered(true), 30)
      return () => clearTimeout(t)
    }
    setEntered(false)
  }, [shouldShow])

  if (!shouldShow) return null

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`account-prompt glass-card${entered ? ' account-prompt--in' : ''}`} role="region" aria-label={t('prompt.region')}>
      <button className="account-prompt__close" onClick={dismiss} aria-label={t('prompt.dismiss')}>
        <X size={16} />
      </button>
      <div className="account-prompt__icon" aria-hidden="true">
        <Cloud size={20} />
      </div>
      <div className="account-prompt__body">
        <p className="account-prompt__title">
          <Sparkles size={14} aria-hidden="true" /> {t('prompt.title.prefix')} {completedCount} {t('prompt.title.suffix')}
        </p>
        <p className="account-prompt__text">
          {t('prompt.text')}
        </p>
        <div className="account-prompt__actions">
          <button className="btn btn--primary" onClick={onSignUpClick}>
            {t('prompt.save')}
          </button>
          <button className="link-btn" onClick={dismiss}>
            {t('prompt.notNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
