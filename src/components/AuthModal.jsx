import { useEffect, useRef, useState } from 'react'
import { X, Mail, Lock, Loader2, GraduationCap, CheckCircle2 } from 'lucide-react'

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
export default function AuthModal({ open, onClose, onSignIn, onSignUp, onReset }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const firstFieldRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open) {
      setError('')
      setNotice('')
      setTimeout(() => firstFieldRef.current?.focus(), 0)
    }
  }, [open, mode])

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
      return 'That email already has an account — try signing in instead.'
    if (msg.includes('invalid login') || msg.includes('invalid credentials'))
      return 'Email or password looks incorrect. Please try again.'
    if (msg.includes('password')) return 'Password must be at least 6 characters.'
    if (msg.includes('not-configured'))
      return 'Accounts aren’t set up on this deployment yet. Your progress is still saved on this device.'
    if (msg.includes('email')) return 'Please enter a valid email address.'
    return 'Something went wrong. Please try again.'
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      if (mode === 'reset') {
        await onReset(email)
        setNotice('Check your email for a password-reset link.')
      } else if (mode === 'signup') {
        await onSignUp(email, password)
        setNotice('Account created. If email confirmation is on, check your inbox — then sign in.')
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
    signin: 'Welcome back',
    signup: 'Create your free account',
    reset: 'Reset your password',
  }
  const subtitles = {
    signin: 'Sign in to sync your progress across devices.',
    signup: 'Save your stars, streak, and progress to the cloud.',
    reset: 'We’ll email you a secure link to set a new password.',
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
        <button className="auth-modal__close icon-btn" onClick={onClose} aria-label="Close">
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
            <span className="auth-field__label">Email</span>
            <span className="auth-field__wrap">
              <Mail size={16} aria-hidden="true" />
              <input
                ref={firstFieldRef}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </span>
          </label>

          {mode !== 'reset' && (
            <label className="auth-field">
              <span className="auth-field__label">Password</span>
              <span className="auth-field__wrap">
                <Lock size={16} aria-hidden="true" />
                <input
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                <Loader2 size={16} className="spin" /> Working…
              </>
            ) : mode === 'signin' ? (
              'Sign in'
            ) : mode === 'signup' ? (
              'Create account'
            ) : (
              'Send reset link'
            )}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' && (
            <>
              <button className="link-btn" onClick={() => setMode('signup')}>
                Create an account
              </button>
              <button className="link-btn" onClick={() => setMode('reset')}>
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button className="link-btn" onClick={() => setMode('signin')}>
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button className="link-btn" onClick={() => setMode('signin')}>
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
