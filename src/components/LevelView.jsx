import { useState } from 'react'
import {
  ChevronLeft,
  Lightbulb,
  ListChecks,
  PlayCircle,
  BookOpen,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react'
import ActivityShell from './ActivityShell.jsx'
import VideoCard from './VideoCard.jsx'
import WorkedExample from './WorkedExample.jsx'
import GuidedPractice from './GuidedPractice.jsx'
import GoDeeper from './GoDeeper.jsx'
import SpacedReview from './SpacedReview.jsx'
import { iconForLevel } from './levelIcons.js'
import { useLanguage } from '../i18n/useLanguage.js'
import { TRACKS } from '../data/tracks.js'

/*
 * Map each lesson id -> its level accent slot (0..5), derived from the track tag
 * ("Level 3" -> 3) so colors stay in sync with the curriculum data. Purely
 * presentational; used only to tint lesson chrome (icon, stepper, labels).
 */
const LEVEL_COLOR_INDEX = (() => {
  const map = {}
  TRACKS.forEach((track, ti) => {
    const lvl = Math.min(5, Math.max(0, parseInt(String(track.tag).replace(/\D/g, ''), 10) || ti))
    track.levels.forEach((level) => {
      map[level.id] = lvl
    })
  })
  return map
})()

/*
 * A single lesson, taught with gradual release of responsibility:
 *
 *   I do   (learn)    — concept, video, everyday example and a narrated worked
 *                       example. The learner watches an expert think.
 *   We do  (guided)   — one scaffolded attempt with an escalating hint ladder.
 *   You do (practice) — the independent challenge, framed as a mastery check.
 *
 * A phase stepper lets the learner move between phases. The We-do phase only
 * appears when the lesson provides `guided` data, so lessons that have not been
 * upgraded to the full structure still render correctly (just I do → You do).
 */

const PHASE_META = {
  learn: { doingKey: 'lesson.phase.learn.doing', titleKey: 'lesson.phase.learn.title', Icon: BookOpen },
  guided: { doingKey: 'lesson.phase.guided.doing', titleKey: 'lesson.phase.guided.title', Icon: Users },
  practice: { doingKey: 'lesson.phase.practice.doing', titleKey: 'lesson.phase.practice.title', Icon: Target },
}

export default function LevelView({
  level,
  levelIndex,
  totalLevels,
  onComplete,
  onBack,
  onNext,
}) {
  const { t } = useLanguage()
  const Icon = iconForLevel(level.id)

  // Build the phase list for THIS lesson (skip We-do if there's no guided data).
  const phases = ['learn', level.guided ? 'guided' : null, 'practice'].filter(Boolean)
  const [phase, setPhase] = useState('learn')
  const phaseIndex = phases.indexOf(phase)

  function goNextPhase() {
    const next = phases[phaseIndex + 1]
    if (next) {
      setPhase(next)
      window.scrollTo({ top: 0 })
    }
  }

  const nextPhase = phases[phaseIndex + 1]
  const continueLabel =
    nextPhase === 'guided'
      ? t('lesson.cta.guided')
      : nextPhase === 'practice'
      ? t('lesson.cta.practice')
      : null

  // Per-level accent for lesson chrome (icon, step, labels). Reading text stays
  // calm/high-contrast — this only tints accents. Mapped from the lesson's level id.
  const lvl = LEVEL_COLOR_INDEX[level.id] ?? 2

  return (
    <article
      className="lesson-view"
      data-lvl={lvl}
      style={{ '--lvl-accent': `var(--lvl-${lvl})`, '--lvl-grad': `var(--lvl-${lvl}-grad)`, '--lvl-soft': `var(--lvl-${lvl}-soft)` }}
    >
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={18} /> {t('lesson.back')}
      </button>

      <header className="lesson-head">
        <span className="lesson-head__icon" aria-hidden="true">
          <Icon size={26} />
        </span>
        <div>
          <div className="lesson-head__crumb">
            {t('lesson.crumb')} {levelIndex + 1} {t('lesson.of')} {totalLevels}
          </div>
          <h1>{level.title}</h1>
          <div className="lesson-head__concept">{level.concept}</div>
        </div>
      </header>

      {/* Phase stepper — the gradual-release path through the lesson. */}
      <nav className="phase-steps" aria-label={t('lesson.steps')}>
        {phases.map((p, i) => {
          const meta = PHASE_META[p]
          const StepIcon = meta.Icon
          const state = i === phaseIndex ? ' phase-step--active' : i < phaseIndex ? ' phase-step--past' : ''
          return (
            <button
              key={p}
              className={`phase-step${state}`}
              onClick={() => setPhase(p)}
              aria-current={i === phaseIndex ? 'step' : undefined}
            >
              <span className="phase-step__icon">
                <StepIcon size={16} />
              </span>
              <span className="phase-step__text">
                <span className="phase-step__doing">{t(meta.doingKey)}</span>
                <span className="phase-step__title">{t(meta.titleKey)}</span>
              </span>
            </button>
          )
        })}
      </nav>

      {/* ---------------------------- I DO ---------------------------- */}
      {phase === 'learn' && (
        <>
          {level.spacedReview && <SpacedReview data={level.spacedReview} />}

          <section className="section" aria-label={t('lesson.section.concept')}>
            <div className="section__label">{t('lesson.section.concept')}</div>
            <p className="concept-text">{level.explanation}</p>
          </section>

          {level.video && (
            <section className="section" aria-label={t('lesson.section.watch')}>
              <div className="section__label">
                <PlayCircle size={15} /> {t('lesson.section.watch')}
              </div>
              <VideoCard
                title={level.video.title}
                description={level.video.description}
                duration={level.video.duration}
                src={level.video.src}
              />
            </section>
          )}

          <section className="section" aria-label={t('lesson.section.everyday')}>
            <div className="section__label">
              <Lightbulb size={15} /> {t('lesson.section.everyday')}
            </div>
            <div className="callout">
              <Lightbulb className="callout__icon" size={20} aria-hidden="true" />
              <p>{level.example.text}</p>
            </div>
          </section>

          {level.workedExample && (
            <section className="section" aria-label={t('lesson.section.worked')}>
              <div className="section__label">
                <BookOpen size={15} /> {t('lesson.section.worked')}
              </div>
              <WorkedExample data={level.workedExample} />
            </section>
          )}

          {level.goDeeper && <GoDeeper data={level.goDeeper} />}
        </>
      )}

      {/* ---------------------------- WE DO --------------------------- */}
      {phase === 'guided' && (
        <section className="section" aria-label={t('lesson.phase.guided.title')}>
          <div className="section__label">
            <Users size={15} /> {t('lesson.phase.guided.title')}
          </div>
          <p className="prompt">{t('lesson.guided.lead')}</p>
          <GuidedPractice data={level.guided} />
        </section>
      )}

      {/* --------------------------- YOU DO --------------------------- */}
      {phase === 'practice' && (
        <section className="section" aria-label={t('lesson.phase.practice.title')}>
          <div className="section__label">
            <ListChecks size={15} /> {t('lesson.phase.practice.title')}
          </div>
          <p className="prompt">{level.activity.prompt}</p>
          <ActivityShell
            activity={level.activity}
            onComplete={(stars) => onComplete(level.id, stars)}
            onNext={onNext}
            onBack={onBack}
          />
        </section>
      )}

      {/* Phase navigation (not shown on the You-do step — the activity owns its own controls). */}
      {phase !== 'practice' && continueLabel && (
        <div className="phase-nav">
          <button className="btn btn--primary" onClick={goNextPhase}>
            {continueLabel} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </article>
  )
}
