import { GraduationCap, Lock, CheckCircle2, Circle, X, Flame } from 'lucide-react'
import { TRACKS_WITH_OFFSETS, LEVELS } from '../data/tracks.js'
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
  onOverview,
  onSelectLevel,
  onClose,
}) {
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
      aria-label="Course navigation"
    >
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <GraduationCap size={20} />
        </span>
        <span>AI Academy</span>
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="Close menu"
          style={{ marginLeft: 'auto', width: 34, height: 34 }}
          data-mobile-only
        >
          <X size={18} />
        </button>
      </div>

      <div className="side-progress">
        <div className="side-progress__row">
          <span>Overall progress</span>
          <span>
            {progress.completedCount}/{LEVELS.length}
          </span>
        </div>
        <ProgressBar value={progress.completedCount} max={LEVELS.length} label="Overall course progress" />
        {progress.streak.current > 0 && (
          <div className="streak" title={`Longest streak: ${progress.streak.longest} day${progress.streak.longest === 1 ? '' : 's'}`}>
            <Flame size={15} aria-hidden="true" />
            <span>
              <strong>{progress.streak.current}-day</strong> streak
            </span>
            {!progress.streak.activeToday && <span className="streak__hint">— finish a lesson to keep it</span>}
          </div>
        )}
      </div>

      <button
        className={`nav__item${view === 'overview' ? ' nav__item--active' : ''}`}
        onClick={onOverview}
        style={{ marginBottom: 'var(--s3)' }}
      >
        <span className="nav__status">
          <GraduationCap size={18} />
        </span>
        <span className="nav__body">
          <span className="nav__title">Course overview</span>
        </span>
      </button>

      {TRACKS_WITH_OFFSETS.map((track, ti) => {
        const locked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = TRACKS_WITH_OFFSETS[ti - 1]
        return (
          <nav key={track.id} className="nav-track" aria-label={`${track.tag}: ${track.title}`}>
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
                <Lock size={13} /> Unlocks after {prevTrack.tag}
              </p>
            )}
          </nav>
        )
      })}
    </aside>
  )
}
