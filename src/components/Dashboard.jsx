import {
  ArrowRight,
  Play,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Star,
  RotateCcw,
  Lock,
  Cloud,
  CloudOff,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { buildDashboardModel } from '../data/dashboardModel.js'
import { iconForLevel } from './levelIcons.js'
import Stars from './Stars.jsx'

/*
 * Dashboard — the learner's home base (App view 'dashboard'). A premium,
 * at-a-glance read-model of existing progress: where to resume, momentum
 * (streak / XP / completion), recent wins, what to review, and per-level cards.
 *
 * It owns no state and changes no data — everything is derived by the pure
 * buildDashboardModel(progress) selector, so it behaves identically for
 * anonymous and signed-in users and respects sign-out clearing automatically
 * (when progress resets, the model resets with it).
 *
 * Props:
 *   progress    — useProgress() return value
 *   user        — auth user (or null); only used for a subtle account/sync line
 *   configured  — whether Supabase is configured (controls the account hint)
 *   syncState   — 'idle'|'syncing'|'saved'|'offline'|'error'
 *   onOpenLevel(flatIndex) — open a lesson by its flat index
 *   onOverview() — go to the full course overview
 *   onHome()     — go to the marketing home
 */
export default function Dashboard({
  progress,
  user = null,
  configured = false,
  syncState = 'idle',
  onOpenLevel,
  onOverview,
  onHome,
}) {
  const m = buildDashboardModel(progress)

  return (
    <div className="dash">
      {/* ---- Header ------------------------------------------------------- */}
      <header className="dash__head">
        <div>
          <p className="eyebrow">Your dashboard</p>
          <h1 className="dash__title">
            {m.hasProgress ? 'Welcome back' : 'Welcome to AI Academy'}
          </h1>
          <p className="dash__sub">
            {m.hasProgress
              ? `You’ve completed ${m.counts.completed} of ${m.counts.total} lessons — keep the momentum going.`
              : 'Your learning home. Start the first lesson and your progress will appear here.'}
          </p>
        </div>
        <AccountLine user={user} configured={configured} syncState={syncState} />
      </header>

      {/* ---- Continue / Start (hero card) -------------------------------- */}
      {m.continueLesson ? (
        <button
          className="dash-continue"
          onClick={() => onOpenLevel(m.continueLesson.index)}
          aria-label={`${m.continueLesson.isStart ? 'Start' : 'Continue'}: ${m.continueLesson.title}`}
        >
          <span className="dash-continue__icon" aria-hidden="true">
            <Play size={26} />
          </span>
          <span className="dash-continue__body">
            <span className="dash-continue__eyebrow">
              {m.continueLesson.isStart ? 'Start learning' : 'Continue learning'} ·{' '}
              {m.continueLesson.levelTag}
            </span>
            <span className="dash-continue__title">{m.continueLesson.title}</span>
            {m.hasProgress && (
              <span className="dash-continue__meta">
                {m.currentLevel.tag}: {m.currentLevel.completed}/{m.currentLevel.total} lessons ·{' '}
                {m.currentLevel.percent}%
              </span>
            )}
          </span>
          <span className="dash-continue__cta" aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </button>
      ) : (
        <div className="dash-continue dash-continue--done">
          <span className="dash-continue__icon" aria-hidden="true">
            <Trophy size={26} />
          </span>
          <span className="dash-continue__body">
            <span className="dash-continue__eyebrow">Course complete</span>
            <span className="dash-continue__title">You’ve finished every lesson — incredible work.</span>
            <span className="dash-continue__meta">Revisit any level below to sharpen low-star topics.</span>
          </span>
        </div>
      )}

      {/* ---- Stat tiles --------------------------------------------------- */}
      <section className="dash-stats" aria-label="Your stats">
        <StatTile
          Icon={CheckCircle2}
          label="Lessons completed"
          value={`${m.counts.completed}`}
          sub={`of ${m.counts.total} · ${m.counts.percent}%`}
          accent="emerald"
        />
        <StatTile
          Icon={Star}
          label="Stars earned (XP)"
          value={`${m.xp.stars}`}
          sub={`of ${m.xp.maxStars} · ${m.xp.percent}%`}
          accent="amber"
        />
        <StatTile
          Icon={Flame}
          label="Current streak"
          value={`${m.streak.current}`}
          sub={m.streak.activeToday ? 'active today' : m.streak.current > 0 ? 'keep it alive' : 'start today'}
          accent="orange"
        />
        <StatTile
          Icon={Trophy}
          label="Longest streak"
          value={`${m.streak.longest}`}
          sub={m.streak.longest === 1 ? 'day' : 'days'}
          accent="violet"
        />
      </section>

      {/* ---- Two-column: recommended + review ---------------------------- */}
      <div className="dash-cols">
        {/* Recommended next */}
        <section className="dash-card" aria-label="Recommended next lesson">
          <h2 className="dash-card__title">
            <Sparkles size={18} aria-hidden="true" /> Recommended next
          </h2>
          {m.recommended ? (
            <button className="dash-rec" onClick={() => onOpenLevel(m.recommended.index)}>
              <span className="dash-rec__icon" aria-hidden="true">
                <LevelIcon id={m.recommended.id} />
              </span>
              <span className="dash-rec__body">
                <span className="dash-rec__tag">{m.recommended.levelTag}</span>
                <span className="dash-rec__title">{m.recommended.title}</span>
              </span>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          ) : (
            <p className="dash-empty">Nothing left to recommend — you’ve completed the course. 🎓</p>
          )}
        </section>

        {/* Review topics (low-star) */}
        <section className="dash-card" aria-label="Topics to review">
          <h2 className="dash-card__title">
            <RotateCcw size={18} aria-hidden="true" /> Topics to review
          </h2>
          {m.reviewTopics.length > 0 ? (
            <ul className="dash-list">
              {m.reviewTopics.map((t) => (
                <li key={t.id}>
                  <button className="dash-list__row" onClick={() => onOpenLevel(t.index)}>
                    <span className="dash-list__icon" aria-hidden="true">
                      <LevelIcon id={t.id} />
                    </span>
                    <span className="dash-list__text">
                      <span className="dash-list__tag">{t.levelTag}</span>
                      <span className="dash-list__title">{t.title}</span>
                    </span>
                    <Stars value={t.stars} size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty">
              {m.hasProgress
                ? 'No weak spots yet — every completed lesson is 3 stars. Nice.'
                : 'As you complete lessons, any that score below 3 stars show up here to revisit.'}
            </p>
          )}
        </section>
      </div>

      {/* ---- Recently completed ------------------------------------------ */}
      {m.recentLessons.length > 0 && (
        <section className="dash-card" aria-label="Recently completed">
          <h2 className="dash-card__title">
            <CheckCircle2 size={18} aria-hidden="true" /> Recently completed
          </h2>
          <ul className="dash-recent">
            {m.recentLessons.map((r) => (
              <li key={r.id} className="dash-recent__item">
                <span className="dash-recent__icon" aria-hidden="true">
                  <LevelIcon id={r.id} />
                </span>
                <span className="dash-recent__text">
                  <span className="dash-list__tag">{r.levelTag}</span>
                  <span className="dash-recent__title">{r.title}</span>
                </span>
                <Stars value={r.stars} size={14} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- Level progress cards (L0–L5) -------------------------------- */}
      <section className="dash-levels" aria-label="Level progress">
        <div className="dash-levels__head">
          <h2 className="dash-card__title">
            <GraduationCap size={18} aria-hidden="true" /> Your path
          </h2>
          <button className="dash-link" onClick={onOverview}>
            Full course overview <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="dash-levels__grid">
          {m.levels.map((lv) => (
            <LevelCard key={lv.id} lv={lv} onOpen={() => onOpenLevel(lv.firstIndex)} />
          ))}
        </div>
      </section>

      {/* ---- Footer CTA -------------------------------------------------- */}
      <div className="dash-foot">
        <button className="btn btn--secondary" onClick={onHome}>
          Back to home
        </button>
        <button className="btn btn--primary" onClick={onOverview}>
          Browse all lessons <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ---------------------------- subcomponents ---------------------------- */

function LevelIcon({ id, size = 20 }) {
  const Icon = iconForLevel(id)
  return <Icon size={size} aria-hidden="true" />
}

function StatTile({ Icon, label, value, sub, accent }) {
  return (
    <div className={`dash-stat dash-stat--${accent}`}>
      <span className="dash-stat__icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <span className="dash-stat__value">{value}</span>
      <span className="dash-stat__label">{label}</span>
      <span className="dash-stat__sub">{sub}</span>
    </div>
  )
}

function LevelCard({ lv, onOpen }) {
  const locked = lv.state === 'locked'
  const done = lv.state === 'done'
  return (
    <button
      className={`dash-level dash-level--${lv.state}`}
      onClick={onOpen}
      disabled={locked}
      aria-label={
        locked
          ? `${lv.tag}: ${lv.title}. Locked — finish the previous level to unlock.`
          : `${lv.tag}: ${lv.title}. ${lv.completed} of ${lv.total} lessons done.`
      }
    >
      <div className="dash-level__top">
        <span className="dash-level__tag">
          {lv.tag}
          {lv.pro && <span className="dash-level__pro">PRO</span>}
        </span>
        <span className="dash-level__badge" aria-hidden="true">
          {done ? <Trophy size={16} /> : locked ? <Lock size={16} /> : <ChevronRight size={16} />}
        </span>
      </div>
      <h3 className="dash-level__name">{lv.title}</h3>
      <div className="dash-level__bar" role="presentation">
        <span className="dash-level__fill" style={{ width: `${lv.percent}%` }} />
      </div>
      <span className="dash-level__meta">
        {lv.completed}/{lv.total} lessons · {lv.stars}/{lv.maxStars} ★
      </span>
    </button>
  )
}

function AccountLine({ user, configured, syncState }) {
  // Subtle, non-intrusive account/sync indicator.
  if (!configured) {
    return (
      <span className="dash-account" title="Progress is saved on this device">
        <CloudOff size={15} aria-hidden="true" /> Saved on this device
      </span>
    )
  }
  if (user) {
    const label =
      syncState === 'saved'
        ? 'Synced to your account'
        : syncState === 'syncing'
          ? 'Syncing…'
          : syncState === 'error'
            ? 'Sync error — saved locally'
            : 'Synced to your account'
    return (
      <span className="dash-account dash-account--in" title={user.email || 'Signed in'}>
        <Cloud size={15} aria-hidden="true" /> {label}
      </span>
    )
  }
  return (
    <span className="dash-account" title="Sign in to sync across devices">
      <CloudOff size={15} aria-hidden="true" /> Saved on this device
    </span>
  )
}
