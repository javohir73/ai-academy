import {
  ArrowRight,
  Compass,
  BookOpenCheck,
  MousePointerClick,
  TerminalSquare,
  ShieldCheck,
  Sparkles,
  Rocket,
  Clock,
  Wifi,
  GraduationCap,
  Layers,
  Code2,
  CloudCheck,
  Sprout,
} from 'lucide-react'
import Hero3D from './Hero3D.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'

/*
 * HomePage — the marketing / landing screen shown before the course. It is the
 * app's first view (see App.jsx). Two CTAs:
 *   - "Start learning"      → onStart (enters the course: overview or next lesson)
 *   - "Explore curriculum"  → onExplore (scrolls to the curriculum preview)
 *
 * Everything is local CSS + Lucide icons (no external assets/CDNs), so it adds
 * no new CSP origins. FeatureGrid / LearningPath / StatsStrip are kept inline
 * as small presentational pieces (used only here) rather than split into files.
 */

/* Brand glyphs for the footer social links. Lucide dropped standalone brand
   logos (trademark), so these are small inline SVGs — no new dep, no CDN. They
   inherit currentColor and are aria-hidden (the link carries the accessible
   label). simple-icons paths, 24x24 viewBox. */
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58l-.01-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3z" />
    </svg>
  )
}

/* Feature cards rotate through four accent families (cyan → violet →
   emerald → orange). The accent only colors the icon tile, top bar, and
   hover glow — never the body copy (which stays calm + AA). Styling reads
   these via CSS custom props set inline in FeatureGrid. */
const FEATURES = [
  { Icon: BookOpenCheck, titleKey: 'home.feature.concept.title', bodyKey: 'home.feature.concept.body', accent: 'cyan' },
  { Icon: MousePointerClick, titleKey: 'home.feature.interactive.title', bodyKey: 'home.feature.interactive.body', accent: 'violet' },
  { Icon: TerminalSquare, titleKey: 'home.feature.python.title', bodyKey: 'home.feature.python.body', accent: 'emerald' },
  { Icon: ShieldCheck, titleKey: 'home.feature.responsible.title', bodyKey: 'home.feature.responsible.body', accent: 'orange' },
]

/* Maps a feature accent name → the Phase-1 token trio the CSS consumes. */
const ACCENTS = {
  cyan: { '--accent': 'var(--cyan)', '--accent-soft': 'var(--cyan-soft)', '--accent-grad': 'var(--grad-cool)' },
  violet: { '--accent': 'var(--violet)', '--accent-soft': 'var(--violet-soft)', '--accent-grad': 'var(--violet-grad)' },
  emerald: { '--accent': 'var(--emerald)', '--accent-soft': 'var(--emerald-soft)', '--accent-grad': 'var(--grad-emerald)' },
  orange: { '--accent': 'var(--orange)', '--accent-soft': 'var(--orange-soft)', '--accent-grad': 'var(--orange-grad)' },
}

const TRUST = [
  { Icon: Sparkles, titleKey: 'home.trust.beginner.title', bodyKey: 'home.trust.beginner.body' },
  { Icon: Wifi, titleKey: 'home.trust.setup.title', bodyKey: 'home.trust.setup.body' },
  { Icon: Clock, titleKey: 'home.trust.paced.title', bodyKey: 'home.trust.paced.body' },
]

function FeatureGrid({ t }) {
  return (
    <div className="feature-grid">
      {FEATURES.map(({ Icon, titleKey, bodyKey, accent }, i) => (
        <div
          className="feature-card"
          key={titleKey}
          style={{ '--i': i, ...ACCENTS[accent] }}
        >
          <div className="feature-card__icon">
            <Icon size={24} aria-hidden="true" />
          </div>
          <h3>{t(titleKey)}</h3>
          <p>{t(bodyKey)}</p>
        </div>
      ))}
    </div>
  )
}

/* Per-level node color/gradient/tint, keyed by the numeric level (0..5).
   Consumes the Phase-1 --lvl-* map so the spine + nodes stay consistent
   with the sidebar / path elsewhere in the app. */
function levelVars(n) {
  return {
    '--node-color': `var(--lvl-${n})`,
    '--node-grad': `var(--lvl-${n}-grad)`,
    '--node-shadow': `color-mix(in srgb, var(--lvl-${n}) 55%, transparent)`,
    '--card-tint': `color-mix(in srgb, var(--lvl-${n}) 7%, transparent)`,
  }
}

/* Premium vertical timeline for the curriculum. A gradient spine threads
   glowing, color-coded level nodes (L0..L5), one per real track (localized).
   Pure CSS/HTML — no three here. */
function LearningPath({ t }) {
  const { tracks } = useLocalizedTracks()
  const steps = tracks.map((track) => ({
    id: track.id,
    num: Number(String(track.tag).replace(/\D/g, '')),
    title: track.title,
    blurb: track.blurb,
    pro: track.pro,
    count: track.levels.length,
    comingSoon: track.comingSoon,
  }))

  return (
    <ol className="learn-path">
      {steps.map((step, i) => (
        <li className="path-step" key={step.id} style={{ '--i': i, ...levelVars(step.num) }}>
          <div className="path-step__node" aria-hidden="true">
            <span>L</span>
            {step.num}
          </div>
          <div className="path-step__card">
            <span className="path-step__tag">
              {t('home.level')} {step.num}
              {step.pro && <span className="path-step__pro">{t('home.pro')}</span>}
            </span>
            <h3>{step.title}</h3>
            <p>{step.blurb}</p>
            <span className="path-step__lessons">
              <Layers size={14} aria-hidden="true" />
              {step.count} {step.count === 1 ? t('home.lesson.one') : t('home.lesson.many')}
            </span>
            {step.comingSoon && <span className="path-step__soon">{step.comingSoon}</span>}
          </div>
        </li>
      ))}
    </ol>
  )
}

/* Concise proof points shown as glassy chips. The lesson count is derived
   from the real curriculum so it never drifts. */
function StatsStrip({ lessonCount, t }) {
  const stats = [
    { Icon: Layers, value: `${lessonCount} ${t('home.lesson.many')}`, label: t('home.stat.lessons.label'), accent: 'cyan' },
    { Icon: Code2, value: t('home.stat.python.value'), label: t('home.stat.python.label'), accent: 'emerald' },
    { Icon: CloudCheck, value: t('home.stat.cloud.value'), label: t('home.stat.cloud.label'), accent: 'electric' },
    { Icon: Sprout, value: t('home.stat.beginner.value'), label: t('home.stat.beginner.label'), accent: 'orange' },
  ]
  return (
    <div className="stats-strip">
      {stats.map(({ Icon, value, label, accent }) => (
        <div
          className="stat-chip"
          key={value}
          style={{ '--accent': `var(--${accent})`, '--accent-soft': `var(--${accent}-soft)` }}
        >
          <span className="stat-chip__icon">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="stat-chip__body">
            <span className="stat-chip__value">{value}</span>
            <span className="stat-chip__label">{label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HomePage({ onStart, onExplore, accountSlot }) {
  const { t } = useLanguage()
  const { levels } = useLocalizedTracks()
  const lessonCount = levels.length

  return (
    <div className="home">
      {/* Top nav */}
      <nav className="home__nav" aria-label={t('home.nav.aria')}>
        <span className="brand">
          <span className="brand__mark" aria-hidden="true">
            <GraduationCap size={20} />
          </span>
          AI Academy
        </span>
        <span className="home__nav-spacer" />
        <button className="btn btn--ghost home__nav-curriculum" onClick={onExplore}>
          {t('home.nav.curriculum')}
        </button>
        <LanguageSwitcher />
        {accountSlot}
        <button className="btn btn--primary" onClick={onStart}>
          {t('home.cta.start')} <ArrowRight size={18} />
        </button>
      </nav>

      {/* Hero */}
      <header className="hero-x">
        <Hero3D />
        <div className="hero-x__inner">
          <span className="chip-grad">
            <Sparkles size={13} aria-hidden="true" /> {t('home.chip.hero')}
          </span>
          <h1>
            <span className="gradient-text">AI Academy</span>
          </h1>
          <p className="hero-x__lead">
            {t('home.lead.pre')}
            {lessonCount}
            {t('home.lead.post')}
          </p>
          <div className="btn-row hero-x__cta">
            <button className="btn btn--primary btn--lg" onClick={onStart}>
              {t('home.cta.start')} <ArrowRight size={20} />
            </button>
            <button className="btn btn--secondary btn--lg" onClick={onExplore}>
              <Compass size={20} /> {t('home.cta.explore')}
            </button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="home-section" aria-labelledby="features-h">
        <div className="home-section__head">
          <span className="chip-grad">{t('home.features.chip')}</span>
          <h2 id="features-h">{t('home.features.title')}</h2>
          <p>{t('home.features.sub')}</p>
        </div>
        <FeatureGrid t={t} />
      </section>

      {/* Stats / benefit strip */}
      <section className="home-section home-section--stats" aria-label={t('home.stats.aria')}>
        <StatsStrip lessonCount={lessonCount} t={t} />
      </section>

      {/* Curriculum preview */}
      <section className="home-section" id="curriculum" aria-labelledby="curriculum-h">
        <div className="home-section__head">
          <span className="chip-grad">{t('home.path.chip')}</span>
          <h2 id="curriculum-h">{t('home.path.title')}</h2>
          <p>{t('home.path.sub')}</p>
        </div>
        <LearningPath t={t} />
      </section>

      {/* Trust / benefits */}
      <section className="home-section" aria-labelledby="trust-h">
        <div className="home-section__head">
          <span className="chip-grad">{t('home.trust.chip')}</span>
          <h2 id="trust-h">{t('home.trust.title')}</h2>
        </div>
        <div className="trust-row">
          {TRUST.map(({ Icon, titleKey, bodyKey }) => (
            <div className="trust-item" key={titleKey}>
              <div className="trust-item__icon">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3>{t(titleKey)}</h3>
              <p>{t(bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="home-cta" aria-labelledby="cta-h">
        <div className="glass-card">
          <h2 id="cta-h">
            {t('home.finalCta.pre')}<span className="gradient-text">{t('home.finalCta.highlight')}</span>
          </h2>
          <p>{t('home.finalCta.sub')}</p>
          <button className="btn btn--primary btn--lg" onClick={onStart}>
            <Rocket size={20} /> {t('home.cta.start')}
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <span className="site-footer__line" aria-hidden="true" />
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="brand__mark" aria-hidden="true">
              <GraduationCap size={18} />
            </span>
            <span className="site-footer__brand-text">
              <span className="site-footer__name">AI Academy</span>
              <span className="site-footer__tagline">{t('home.footer.tagline')}</span>
            </span>
          </div>

          <div className="site-footer__meta">
            <span className="site-footer__credit">
              {t('home.footer.builtBy')} <span className="site-footer__founder">Javohirbek</span>
            </span>
            <span className="site-footer__socials">
              <a
                className="social-link"
                href="https://www.linkedin.com/in/javohiraz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Javohirbek on LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                className="social-link"
                href="https://github.com/javohir73"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Javohirbek on GitHub"
              >
                <GitHubIcon />
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
