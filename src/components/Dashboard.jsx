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
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
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
 */
export default function Dashboard({
  progress,
  user = null,
  configured = false,
  syncState = 'idle',
  onOpenLevel,
  onOverview,
}) {
  const { t } = useLanguage()
  const { tracksWithOffsets } = useLocalizedTracks()
  const m = buildDashboardModel(progress, tracksWithOffsets)

  return (
    <div className="dash">
      {/* ---- Header ------------------------------------------------------- */}
      <header className="dash__head">
        <div>
          <p className="eyebrow">{t('dash.eyebrow')}</p>
          <h1 className="dash__title">
            {m.hasProgress ? t('dash.welcome.back') : t('dash.welcome.new')}
          </h1>
          <p className="dash__sub">
            {m.hasProgress
              ? `${t('dash.sub.progressPre')}${m.counts.completed}${t('dash.sub.progressMid')}${m.counts.total}${t('dash.sub.progressPost')}`
              : t('dash.sub.new')}
          </p>
        </div>
        <AccountLine user={user} configured={configured} syncState={syncState} />
      </header>

      {/* ---- Continue / Start (hero card) -------------------------------- */}
      {m.continueLesson ? (
        <button
          className="dash-continue"
          onClick={() => onOpenLevel(m.continueLesson.index)}
          aria-label={`${m.continueLesson.isStart ? t('dash.continue.startShort') : t('dash.continue.continueShort')}: ${m.continueLesson.title}`}
        >
          <span className="dash-continue__icon" aria-hidden="true">
            <Play size={26} />
          </span>
          <span className="dash-continue__body">
            <span className="dash-continue__eyebrow">
              {m.continueLesson.isStart ? t('dash.continue.start') : t('dash.continue.continue')} ·{' '}
              {m.continueLesson.levelTag}
            </span>
            <span className="dash-continue__title">{m.continueLesson.title}</span>
            {m.hasProgress && (
              <span className="dash-continue__meta">
                {m.currentLevel.tag}: {m.currentLevel.completed}/{m.currentLevel.total} {t('dash.lessons')} ·{' '}
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
            <span className="dash-continue__eyebrow">{t('dash.complete.eyebrow')}</span>
            <span className="dash-continue__title">{t('dash.complete.title')}</span>
            <span className="dash-continue__meta">{t('dash.complete.meta')}</span>
          </span>
        </div>
      )}

      {/* ---- Stat tiles --------------------------------------------------- */}
      <section className="dash-stats" aria-label={t('dash.stats.aria')}>
        <StatTile
          Icon={CheckCircle2}
          label={t('dash.stat.lessonsCompleted')}
          value={`${m.counts.completed}`}
          sub={`${t('dash.stat.of')}${m.counts.total} · ${m.counts.percent}%`}
          accent="emerald"
        />
        <StatTile
          Icon={Star}
          label={t('dash.stat.starsEarned')}
          value={`${m.xp.stars}`}
          sub={`${t('dash.stat.of')}${m.xp.maxStars} · ${m.xp.percent}%`}
          accent="amber"
        />
        <StatTile
          Icon={Flame}
          label={t('dash.stat.currentStreak')}
          value={`${m.streak.current}`}
          sub={m.streak.activeToday ? t('dash.stat.activeToday') : m.streak.current > 0 ? t('dash.stat.keepAlive') : t('dash.stat.startToday')}
          accent="orange"
        />
        <StatTile
          Icon={Trophy}
          label={t('dash.stat.longestStreak')}
          value={`${m.streak.longest}`}
          sub={m.streak.longest === 1 ? t('dash.stat.day') : t('dash.stat.days')}
          accent="violet"
        />
      </section>

      {/* ---- Two-column: recommended + review ---------------------------- */}
      <div className="dash-cols">
        {/* Recommended next */}
        <section className="dash-card" aria-label={t('dash.recommended.aria')}>
          <h2 className="dash-card__title">
            <Sparkles size={18} aria-hidden="true" /> {t('dash.recommended.title')}
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
            <p className="dash-empty">{t('dash.recommended.empty')}</p>
          )}
        </section>

        {/* Review topics (low-star) */}
        <section className="dash-card" aria-label={t('dash.review.aria')}>
          <h2 className="dash-card__title">
            <RotateCcw size={18} aria-hidden="true" /> {t('dash.review.title')}
          </h2>
          {m.reviewTopics.length > 0 ? (
            <ul className="dash-list">
              {m.reviewTopics.map((rt) => (
                <li key={rt.id}>
                  <button className="dash-list__row" onClick={() => onOpenLevel(rt.index)}>
                    <span className="dash-list__icon" aria-hidden="true">
                      <LevelIcon id={rt.id} />
                    </span>
                    <span className="dash-list__text">
                      <span className="dash-list__tag">{rt.levelTag}</span>
                      <span className="dash-list__title">{rt.title}</span>
                    </span>
                    <Stars value={rt.stars} size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty">
              {m.hasProgress
                ? t('dash.review.emptyDone')
                : t('dash.review.emptyNew')}
            </p>
          )}
        </section>
      </div>

      {/* ---- Recently completed ------------------------------------------ */}
      {m.recentLessons.length > 0 && (
        <section className="dash-card" aria-label={t('dash.recent.aria')}>
          <h2 className="dash-card__title">
            <CheckCircle2 size={18} aria-hidden="true" /> {t('dash.recent.title')}
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
      <section className="dash-levels" aria-label={t('dash.path.aria')}>
        <div className="dash-levels__head">
          <h2 className="dash-card__title">
            <GraduationCap size={18} aria-hidden="true" /> {t('dash.path.title')}
          </h2>
          <button className="dash-link" onClick={onOverview}>
            {t('dash.path.fullOverview')} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="dash-levels__grid">
          {m.levels.map((lv) => (
            <LevelCard key={lv.id} lv={lv} onOpen={() => onOpenLevel(lv.firstIndex)} />
          ))}
        </div>
      </section>

      {/* ---- Footer CTA — the dashboard IS home, so one action: browse. -- */}
      <div className="dash-foot">
        <button className="btn btn--primary" onClick={onOverview}>
          {t('dash.foot.browse')} <ArrowRight size={18} aria-hidden="true" />
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
  const { t } = useLanguage()
  const locked = lv.state === 'locked'
  const done = lv.state === 'done'
  return (
    <button
      className={`dash-level dash-level--${lv.state}`}
      onClick={onOpen}
      disabled={locked}
      aria-label={
        locked
          ? `${lv.tag}: ${lv.title}. ${t('dash.level.ariaLocked')}`
          : `${lv.tag}: ${lv.title}. ${lv.completed}${t('dash.level.ariaProgressMid')}${lv.total}${t('dash.level.ariaProgressPost')}`
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
        {lv.completed}/{lv.total} {t('dash.lessons')} · {lv.stars}/{lv.maxStars} ★
      </span>
    </button>
  )
}

function AccountLine({ user, configured, syncState }) {
  const { t } = useLanguage()
  // Subtle, non-intrusive account/sync indicator.
  if (!configured) {
    return (
      <span className="dash-account" title={t('dash.account.deviceTitle')}>
        <CloudOff size={15} aria-hidden="true" /> {t('account.savedOnDevice')}
      </span>
    )
  }
  if (user) {
    const label =
      syncState === 'saved'
        ? t('dash.account.synced')
        : syncState === 'syncing'
          ? t('sync.syncing')
          : syncState === 'error'
            ? t('dash.account.syncError')
            : t('dash.account.synced')
    return (
      <span className="dash-account dash-account--in" title={user.email || t('dash.account.signedIn')}>
        <Cloud size={15} aria-hidden="true" /> {label}
      </span>
    )
  }
  return (
    <span className="dash-account" title={t('dash.account.signinTitle')}>
      <CloudOff size={15} aria-hidden="true" /> {t('account.savedOnDevice')}
    </span>
  )
}
