import { ArrowRight, ChevronRight, Lock, Trophy } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
import { iconForLevel } from './levelIcons.js'
import Stars from './Stars.jsx'

/*
 * The course home / overview panel. Introduces the course, offers a single
 * Start/Continue action, and lists every track and its lessons as clean module
 * cards with lock / progress state.
 */
export default function Overview({ progress, currentIndex, onOpenLevel }) {
  const { t } = useLanguage()
  const { tracksWithOffsets, levels } = useLocalizedTracks()
  const total = levels.length
  const done = progress.completedCount
  const allDone = done === total
  const started = done > 0
  const ctaIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div>
      <header className="hero">
        <p className="eyebrow">{t('overview.eyebrow')}</p>
        <h1>{t('overview.title')}</h1>
        <p className="lead">
          {t('overview.lead.pre')}{total}{t('overview.lead.post')}
        </p>
        <p className="muted" style={{ marginTop: 'var(--s2)' }}>
          {t('overview.curriculumNote.pre')}{' '}
          <span className="code-badge">Code</span>{t('overview.curriculumNote.post')}
        </p>
        <div className="btn-row" style={{ marginTop: 'var(--s5)' }}>
          {allDone ? (
            <button className="btn btn--primary" onClick={() => onOpenLevel(0)}>
              <Trophy size={18} /> {t('overview.cta.review')}
            </button>
          ) : (
            <button className="btn btn--primary" onClick={() => onOpenLevel(ctaIndex)}>
              {started ? t('overview.cta.continue') : t('overview.cta.start')} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </header>

      {tracksWithOffsets.map((track, ti) => {
        const trackLocked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = tracksWithOffsets[ti - 1]
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
              {/* Reframe the chained-unlock model as a journey, not a gate. */}
              <p className="track-count">
                {track.levels.length}{' '}
                {track.levels.length === 1 ? t('home.lesson.one') : t('home.lesson.many')}
                {' · '}
                {t('overview.unlockAsYouGo')}
              </p>
              {track.comingSoon && (
                <p className="track-comingsoon">{track.comingSoon}</p>
              )}
              {trackLocked && prevTrack && (
                <p className="track-locked track-locked--inline">
                  <Lock size={14} /> {t('overview.unlock.pre')}{prevTrack.tag}{t('overview.unlock.post')}
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
                        ? `${level.title}. ${t('overview.aria.locked')}`
                        : `${level.title}. ${
                            completed
                              ? `${t('overview.aria.completedPre')}${progress.starsFor(level.id)}${t('overview.aria.completedPost')}`
                              : t('overview.aria.open')
                          }`
                    }
                  >
                    <span className="module-icon" aria-hidden="true">
                      {/* Always show the lesson's topic icon — even when locked —
                          so upcoming lessons invite ("here's what's ahead") rather
                          than forbid. The single lock lives in the status slot. */}
                      <Icon size={22} />
                    </span>
                    <span className="module-card__body">
                      <span className="module-card__index">{t('lesson.crumb')} {index + 1}</span>
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
