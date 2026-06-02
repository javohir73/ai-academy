import { ChevronRight, Lock } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
import { iconForLevel } from './levelIcons.js'
import Stars from './Stars.jsx'

/*
 * Catalog — the course's browse-and-discover view (App view 'catalog', URL
 * /learn). Demoted from the former Overview: the welcome eyebrow/title/lead and
 * the Start/Continue/Review hero were removed because the progress-aware home
 * (Dashboard) now owns "resume" and "welcome". This view is purely the lesson
 * grid — every track and lesson with concept text, lock/done state, and the
 * "unlock as you go" cue — so a learner can scan and pick what to open.
 */
export default function Catalog({ progress, currentIndex, onOpenLevel }) {
  const { t } = useLanguage()
  const { tracksWithOffsets } = useLocalizedTracks()

  return (
    <div>
      <header className="hero hero--catalog">
        <h1>{t('catalog.title')}</h1>
        <p className="muted" style={{ marginTop: 'var(--s2)' }}>
          {t('overview.curriculumNote.pre')}{' '}
          <span className="code-badge">Code</span>{t('overview.curriculumNote.post')}
        </p>
      </header>

      {tracksWithOffsets.map((track, ti) => {
        const trackLocked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = tracksWithOffsets[ti - 1]
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
