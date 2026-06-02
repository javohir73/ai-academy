import { GraduationCap, LayoutDashboard, Lock, CheckCircle2, Circle, X, Flame } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
import ProgressBar from './ProgressBar.jsx'
import Stars from './Stars.jsx'

/*
 * Persistent course navigation (Claude-Courses style). Brand, overall progress,
 * the daily streak, and the lessons grouped by curriculum level. Each level
 * stays locked until the one before it is finished (chained unlock rule).
 * On mobile it slides in as a drawer (controlled by `open`).
 */
export default function Sidebar({
  panelRef,
  progress,
  view,
  activeIndex,
  currentIndex,
  open,
  onHome,
  onDashboard,
  onOverview,
  onSelectLevel,
  onClose,
  accountSlot,
}) {
  const { t } = useLanguage()
  const { tracksWithOffsets, levels } = useLocalizedTracks()

  function statusFor(level, index) {
    if (!progress.isUnlocked(index)) return 'locked'
    if (progress.completed[level.id]) return 'done'
    if (index === currentIndex) return 'current'
    return 'available'
  }

  return (
    <aside
      ref={panelRef}
      className={`sidebar${open ? ' sidebar--open' : ''}`}
      aria-label={t('nav.courseNav')}
    >
      <div className="brand">
        <button className="brand__home" onClick={onHome} aria-label={t('nav.home')}>
          <span className="brand__mark" aria-hidden="true">
            <GraduationCap size={20} />
          </span>
          <span>{t('nav.brand')}</span>
        </button>
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label={t('nav.closeMenu')}
          style={{ marginLeft: 'auto', width: 34, height: 34 }}
          data-mobile-only
        >
          <X size={18} />
        </button>
      </div>

      <div className="side-progress">
        <div className="side-progress__row">
          <span>{t('side.overallProgress')}</span>
          <span>
            {progress.completedCount}/{levels.length}
          </span>
        </div>
        <ProgressBar value={progress.completedCount} max={levels.length} label="Overall course progress" />
        {progress.streak.current > 0 && (
          <div className="streak" title={`${t('side.longestStreak')} ${progress.streak.longest} day${progress.streak.longest === 1 ? '' : 's'}`}>
            <Flame size={15} aria-hidden="true" />
            <span>
              <strong>{progress.streak.current}-day</strong> {t('side.streak.suffix')}
            </span>
            {!progress.streak.activeToday && <span className="streak__hint">{t('side.streak.keep')}</span>}
          </div>
        )}
        {accountSlot && <div className="side-account">{accountSlot}</div>}
      </div>

      {onDashboard && (
        <button
          className={`nav__item${view === 'dashboard' ? ' nav__item--active' : ''}`}
          onClick={onDashboard}
        >
          <span className="nav__status">
            <LayoutDashboard size={18} />
          </span>
          <span className="nav__body">
            <span className="nav__title">{t('nav.dashboard')}</span>
          </span>
        </button>
      )}

      <button
        className={`nav__item${view === 'catalog' ? ' nav__item--active' : ''}`}
        onClick={onOverview}
        style={{ marginBottom: 'var(--s3)' }}
      >
        <span className="nav__status">
          <GraduationCap size={18} />
        </span>
        <span className="nav__body">
          <span className="nav__title">{t('nav.curriculum')}</span>
        </span>
      </button>

      {tracksWithOffsets.map((track, ti) => {
        const locked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = tracksWithOffsets[ti - 1]
        // Per-level accent index (0..5) parsed from the track tag — presentational only.
        const lvl = Math.min(5, Math.max(0, parseInt(String(track.tag).replace(/\D/g, ''), 10) || ti))
        return (
          <nav
            key={track.id}
            className="nav-track"
            data-lvl={lvl}
            style={{ '--lvl-accent': `var(--lvl-${lvl})`, '--lvl-grad': `var(--lvl-${lvl}-grad)`, '--lvl-soft': `var(--lvl-${lvl}-soft)` }}
            aria-label={`${track.tag}: ${track.title}`}
          >
            <p className="track-label">
              <span className={`track-label__tag${track.pro ? ' track-label__tag--pro' : ''}`}>
                {track.tag}
              </span>
              <span className="track-label__title">{track.title}</span>
            </p>
            <ul className="nav">
              {track.levels.map(({ level, index }) => {
                const status = statusFor(level, index)
                const isLocked = status === 'locked'
                const active = view === 'lesson' && index === activeIndex
                return (
                  <li key={level.id}>
                    <button
                      className={`nav__item${active ? ' nav__item--active' : ''}`}
                      disabled={isLocked}
                      onClick={() => onSelectLevel(index)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span
                        className={`nav__status${
                          status === 'done'
                            ? ' nav__status--done'
                            : status === 'current'
                            ? ' nav__status--current'
                            : ''
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={16} />
                        ) : status === 'done' ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Circle size={18} strokeWidth={status === 'current' ? 2.5 : 2} />
                        )}
                      </span>
                      <span className="nav__body">
                        <span className="nav__title">
                          {level.title}
                          {level.kind === 'code' && <span className="code-badge">Code</span>}
                        </span>
                        <span className="nav__concept">{level.concept}</span>
                      </span>
                      {status === 'done' && (
                        <span className="nav__stars">
                          <Stars value={progress.starsFor(level.id)} size={12} />
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            {locked && prevTrack && (
              <p className="track-locked">
                <Lock size={13} /> {t('side.unlocksAfter')} {prevTrack.tag}
              </p>
            )}
          </nav>
        )
      })}
    </aside>
  )
}
