import { ArrowRight, ChevronRight, Lock, Trophy } from 'lucide-react'
import { TRACKS_WITH_OFFSETS, LEVELS } from '../data/tracks.js'
import { iconForLevel } from './levelIcons.js'
import Stars from './Stars.jsx'

/*
 * The course home / overview panel. Introduces the course, offers a single
 * Start/Continue action, and lists every track and its lessons as clean module
 * cards with lock / progress state.
 */
export default function Overview({ progress, currentIndex, onOpenLevel }) {
  const total = LEVELS.length
  const done = progress.completedCount
  const allDone = done === total
  const started = done > 0
  const ctaIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div>
      <header className="hero">
        <p className="eyebrow">Self-paced course</p>
        <h1>Learn AI &amp; Machine Learning by doing</h1>
        <p className="lead">
          A hands-on course of {total} interactive lessons — from the fundamentals of AI, through
          how machine learning works (with real Python you run in the browser), to evaluating AI
          models responsibly. Each lesson pairs a plain-English idea with something you actually do.
        </p>
        <p className="muted" style={{ marginTop: 'var(--s2)' }}>
          Levels 0, 1, 2, 3 &amp; 5 of the AI Academy curriculum. Code lessons (badged{' '}
          <span className="code-badge">Code</span>) start at Level 2. More levels are in development.
        </p>
        <div className="btn-row" style={{ marginTop: 'var(--s5)' }}>
          {allDone ? (
            <button className="btn btn--primary" onClick={() => onOpenLevel(0)}>
              <Trophy size={18} /> Review from the start
            </button>
          ) : (
            <button className="btn btn--primary" onClick={() => onOpenLevel(ctaIndex)}>
              {started ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </header>

      {TRACKS_WITH_OFFSETS.map((track, ti) => {
        const trackLocked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = TRACKS_WITH_OFFSETS[ti - 1]
        // Per-level accent index (0..5) parsed from the track tag ("Level 3" -> 3),
        // clamped to the 6 defined --lvl-* color slots. Purely presentational.
        const lvl = Math.min(5, Math.max(0, parseInt(String(track.tag).replace(/\D/g, ''), 10) || ti))
        return (
          <section className="track-section" key={track.id} data-lvl={lvl} style={{ '--lvl-accent': `var(--lvl-${lvl})`, '--lvl-grad': `var(--lvl-${lvl}-grad)`, '--lvl-soft': `var(--lvl-${lvl}-soft)` }}>
            <div className="track-section__head">
              <span className={`track-chip${track.pro ? ' track-chip--pro' : ''}`}>
                {track.tag}
              </span>
              <h2>{track.title}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {track.blurb}
              </p>
              {track.comingSoon && (
                <p className="track-comingsoon">{track.comingSoon}</p>
              )}
              {trackLocked && prevTrack && (
                <p className="track-locked track-locked--inline">
                  <Lock size={14} /> Complete {prevTrack.tag} to unlock these lessons
                </p>
              )}
            </div>

            <div className="module-list">
              {track.levels.map(({ level, index }, mapIndex) => {
                const Icon = iconForLevel(level.id)
                const locked = !progress.isUnlocked(index)
                const completed = Boolean(progress.completed[level.id])
                const isCurrent = !locked && !completed && index === currentIndex
                const cls = [
                  'module-card',
                  locked && 'module-card--locked',
                  completed && 'module-card--done',
                  isCurrent && 'module-card--current',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={level.id}
                    className={cls}
                    style={{ '--i': mapIndex }}
                    disabled={locked}
                    onClick={() => onOpenLevel(index)}
                    aria-label={
                      locked
                        ? `${level.title}. Locked — complete the previous lesson to unlock.`
                        : `${level.title}. ${
                            completed ? `Completed, ${progress.starsFor(level.id)} of 3 stars.` : 'Open lesson.'
                          }`
                    }
                  >
                    <span className="module-icon" aria-hidden="true">
                      {locked ? <Lock size={20} /> : <Icon size={22} />}
                    </span>
                    <span className="module-card__body">
                      <span className="module-card__index">Lesson {index + 1}</span>
                      <span className="module-card__title">
                        {level.title}
                        {level.kind === 'code' && <span className="code-badge">Code</span>}
                      </span>
                      <span className="module-card__concept">{level.concept}</span>
                    </span>
                    <span className="module-card__status">
                      {completed ? (
                        <Stars value={progress.starsFor(level.id)} size={15} />
                      ) : locked ? (
                        <Lock size={18} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
