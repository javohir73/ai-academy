import { useEffect, useState } from 'react'
import { X, Cloud, Sparkles } from 'lucide-react'

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
    <div className={`account-prompt glass-card${entered ? ' account-prompt--in' : ''}`} role="region" aria-label="Save your progress">
      <button className="account-prompt__close" onClick={dismiss} aria-label="Dismiss">
        <X size={16} />
      </button>
      <div className="account-prompt__icon" aria-hidden="true">
        <Cloud size={20} />
      </div>
      <div className="account-prompt__body">
        <p className="account-prompt__title">
          <Sparkles size={14} aria-hidden="true" /> Nice progress — {completedCount} lessons done!
        </p>
        <p className="account-prompt__text">
          Create a free account to save your stars and streak to the cloud and pick up on any device.
        </p>
        <div className="account-prompt__actions">
          <button className="btn btn--primary" onClick={onSignUpClick}>
            Save my progress
          </button>
          <button className="link-btn" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
