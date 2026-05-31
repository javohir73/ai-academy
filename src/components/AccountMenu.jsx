import { useEffect, useRef, useState } from 'react'
import { User, LogOut, Cloud, CloudOff, Check, Loader2, AlertCircle, HardDrive } from 'lucide-react'

/*
 * AccountMenu — the profile/account control in the app chrome.
 *
 *   - configured + signed in  → avatar button → dropdown (email, sync state, sign out)
 *   - configured + anonymous  → "Sign in" button (opens AuthModal)
 *   - not configured          → a subtle "Saved on this device" chip (local-only mode)
 *
 * `syncState`: 'idle' | 'syncing' | 'saved' | 'offline' | 'error'.
 */

function SyncBadge({ syncState }) {
  const map = {
    syncing: { Icon: Loader2, text: 'Syncing…', cls: 'sync--busy', spin: true },
    saved: { Icon: Check, text: 'Saved', cls: 'sync--ok' },
    error: { Icon: AlertCircle, text: 'Sync error', cls: 'sync--err' },
    offline: { Icon: CloudOff, text: 'Offline', cls: 'sync--muted' },
    idle: { Icon: Cloud, text: 'Synced', cls: 'sync--muted' },
  }
  const { Icon, text, cls, spin } = map[syncState] || map.idle
  return (
    <span className={`sync-badge ${cls}`} aria-live="polite">
      <Icon size={13} className={spin ? 'spin' : undefined} aria-hidden="true" />
      {text}
    </span>
  )
}

export default function AccountMenu({ configured, user, syncState, onSignInClick, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Local-only deployment: no accounts, just reassure the learner.
  if (!configured) {
    return (
      <span className="account-local" title="This deployment has no accounts; progress is saved in this browser.">
        <HardDrive size={14} aria-hidden="true" /> Saved on this device
      </span>
    )
  }

  // Anonymous: invite sign-in. (On mobile the label is visually hidden via CSS
  // and the icon stands alone — aria-label keeps it accessible either way.)
  if (!user) {
    return (
      <button
        className="btn btn--secondary account-signin"
        onClick={onSignInClick}
        aria-label="Sign in"
      >
        <User size={16} aria-hidden="true" />
        <span className="account-signin__label">Sign in</span>
      </button>
    )
  }

  // Signed in: avatar + dropdown.
  const email = user.email || 'Account'
  const initial = email[0]?.toUpperCase() || '?'
  return (
    <div className="account-menu" ref={ref}>
      <button
        className="account-avatar"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="account-avatar__circle">{initial}</span>
      </button>
      {open && (
        <div className="account-dropdown glass-card" role="menu">
          <div className="account-dropdown__head">
            <span className="account-avatar__circle account-avatar__circle--lg">{initial}</span>
            <div className="account-dropdown__meta">
              <span className="account-dropdown__email">{email}</span>
              <SyncBadge syncState={syncState} />
            </div>
          </div>
          <button className="account-dropdown__item" role="menuitem" onClick={onSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export { SyncBadge }
