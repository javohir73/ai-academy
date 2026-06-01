import { useEffect, useRef, useState } from 'react'
import { X, Mail, Lock, Loader2, GraduationCap, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * AuthModal — a calm, futuristic-light auth dialog. Three modes:
 *   'signin' | 'signup' | 'reset'
 * It only collects credentials and calls the handlers passed from App
 * (which delegate to useAuth → cloudProgressService). It knows nothing about
 * Supabase directly. Friendly errors, no jargon.
 *
 * Accessibility: role="dialog" + aria-modal, Escape to close, focus moves to
 * the first field on open, backdrop click closes.
 */
export default function AuthModal({ open, initialMode = 'signin', onClose, onSignIn, onSignUp, onReset }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const firstFieldRef = useRef(null)
  const dialogRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setError('')
      setNotice('')
      setTimeout(() => firstFieldRef.current?.focus(), 0)
    }
  }, [open, initialMode])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function friendlyError(err) {
    const msg = String(err?.message || err || '').toLowerCase()
    if (msg.includes('already registered') || msg.includes('already exists'))
      return t('auth.error.exists')
    if (msg.includes('invalid login') || msg.includes('invalid credentials'))
      return t('auth.error.invalid')
    if (msg.includes('password')) return t('auth.error.password')
    if (msg.includes('not-configured')) return t('auth.error.notConfigured')
    if (msg.includes('email')) return t('auth.error.email')
    return t('auth.error.generic')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      if (mode === 'reset') {
        await onReset(email)
        setNotice(t('auth.notice.reset'))
      } else if (mode === 'signup') {
        await onSignUp(email, password)
        setNotice(t('auth.notice.signup'))
        setMode('signin')
      } else {
        await onSignIn(email, password)
        onClose()
      }
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  const titles = {
    signin: t('auth.title.signin'),
    signup: t('auth.title.signup'),
    reset: t('auth.title.reset'),
  }
  const subtitles = {
    signin: t('auth.sub.signin'),
    signup: t('auth.sub.signup'),
    reset: t('auth.sub.reset'),
  }

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="auth-modal glass-card"
        role="dialog"
        aria-modal="true"
        aria-label={titles[mode]}
        ref={dialogRef}
      >
        <button className="auth-modal__close icon-btn" onClick={onClose} aria-label={t('auth.close')}>
          <X size={18} />
        </button>

        <div className="auth-modal__brand">
          <span className="brand__mark" aria-hidden="true">
            <GraduationCap size={22} />
          </span>
        </div>
        <h2 className="auth-modal__title">{titles[mode]}</h2>
        <p className="auth-modal__sub">{subtitles[mode]}</p>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <span className="auth-field__label">{t('auth.field.email')}</span>
            <span className="auth-field__wrap">
              <Mail size={16} aria-hidden="true" />
              <input
                ref={firstFieldRef}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.placeholder.email')}
              />
            </span>
          </label>

          {mode !== 'reset' && (
            <label className="auth-field">
              <span className="auth-field__label">{t('auth.field.password')}</span>
              <span className="auth-field__wrap">
                <Lock size={16} aria-hidden="true" />
                <input
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.placeholder.password')}
                />
              </span>
            </label>
          )}

          {error && (
            <p className="auth-msg auth-msg--error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="auth-msg auth-msg--ok" role="status">
              <CheckCircle2 size={15} aria-hidden="true" /> {notice}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={16} className="spin" /> {t('auth.btn.working')}
              </>
            ) : mode === 'signin' ? (
              t('auth.btn.signin')
            ) : mode === 'signup' ? (
              t('auth.btn.signup')
            ) : (
              t('auth.btn.reset')
            )}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' && (
            <>
              <button className="link-btn" onClick={() => setMode('signup')}>
                {t('auth.switch.create')}
              </button>
              <button className="link-btn" onClick={() => setMode('reset')}>
                {t('auth.switch.forgot')}
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button className="link-btn" onClick={() => setMode('signin')}>
              {t('auth.switch.haveAccount')}
            </button>
          )}
          {mode === 'reset' && (
            <button className="link-btn" onClick={() => setMode('signin')}>
              {t('auth.switch.backToSignin')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
