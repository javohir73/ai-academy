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
import { TRACKS, LEVELS } from '../data/tracks.js'

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

/* Feature cards rotate through four accent families (cyan → violet →
   emerald → orange). The accent only colors the icon tile, top bar, and
   hover glow — never the body copy (which stays calm + AA). Styling reads
   these via CSS custom props set inline in FeatureGrid. */
const FEATURES = [
  {
    Icon: BookOpenCheck,
    title: 'Concept-first lessons',
    body: 'Start with plain-English ideas and everyday examples — the intuition comes before any math or code.',
    accent: 'cyan',
  },
  {
    Icon: MousePointerClick,
    title: 'Interactive challenges',
    body: 'Learn by doing: sort, match, predict, and build. Almost every lesson is a hands-on challenge, not a quiz.',
    accent: 'violet',
  },
  {
    Icon: TerminalSquare,
    title: 'Real Python in the browser',
    body: 'Write and run real scikit-learn code in an in-browser notebook — no installs, no setup, graded instantly.',
    accent: 'emerald',
  },
  {
    Icon: ShieldCheck,
    title: 'Responsible AI & LLM evaluation',
    body: 'Finish by thinking like an AI model evaluator: score answers, catch hallucinations, and judge AI responsibly.',
    accent: 'orange',
  },
]

/* Maps a feature accent name → the Phase-1 token trio the CSS consumes. */
const ACCENTS = {
  cyan: { '--accent': 'var(--cyan)', '--accent-soft': 'var(--cyan-soft)', '--accent-grad': 'var(--grad-cool)' },
  violet: { '--accent': 'var(--violet)', '--accent-soft': 'var(--violet-soft)', '--accent-grad': 'var(--violet-grad)' },
  emerald: { '--accent': 'var(--emerald)', '--accent-soft': 'var(--emerald-soft)', '--accent-grad': 'var(--grad-emerald)' },
  orange: { '--accent': 'var(--orange)', '--accent-soft': 'var(--orange-soft)', '--accent-grad': 'var(--orange-grad)' },
}

const TRUST = [
  {
    Icon: Sparkles,
    title: 'Beginner-friendly',
    body: 'No prior coding or math required. Each level unlocks the next, so you are never thrown in the deep end.',
  },
  {
    Icon: Wifi,
    title: 'Zero setup',
    body: 'Runs entirely in your browser. Nothing to install, configure, or pay for to get started.',
  },
  {
    Icon: Clock,
    title: 'Self-paced',
    body: 'Your progress saves automatically on your device. Pick up exactly where you left off, any time.',
  },
]

function FeatureGrid() {
  return (
    <div className="feature-grid">
      {FEATURES.map(({ Icon, title, body, accent }, i) => (
        <div
          className="feature-card"
          key={title}
          style={{ '--i': i, ...ACCENTS[accent] }}
        >
          <div className="feature-card__icon">
            <Icon size={24} aria-hidden="true" />
          </div>
          <h3>{title}</h3>
          <p>{body}</p>
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
   glowing, color-coded level nodes (L0..L5). The curriculum data jumps
   from Level 3 to Level 5 (Computer Vision isn't built yet), so we render
   a dashed "ghost" Level 4 step in that gap to keep the journey legible.
   Pure CSS/HTML — no three here. */
function LearningPath() {
  // Build the ordered step list, inserting the L4 ghost where the gap is.
  const steps = []
  TRACKS.forEach((track) => {
    const num = Number(track.tag.replace('Level ', ''))
    if (num === 5 && !steps.some((s) => s.ghost)) {
      steps.push({ ghost: true, num: 4 })
    }
    steps.push({
      id: track.id,
      num,
      title: track.title,
      blurb: track.blurb,
      pro: track.pro,
      count: track.levels.length,
      // The dashed L4 ghost step owns the Computer-Vision message, so we
      // drop L5's comingSoon (which repeats it) but keep L3's roadmap note.
      comingSoon: track.tag === 'Level 5' ? null : track.comingSoon,
    })
  })

  return (
    <ol className="learn-path">
      {steps.map((step, i) =>
        step.ghost ? (
          <li className="path-step path-step--ghost" key="ghost-l4" style={{ '--i': i }}>
            <div className="path-step__node" aria-hidden="true">
              <span>L</span>4
            </div>
            <div className="path-step__card">
              <span className="path-step__tag">Level 4 · Coming soon</span>
              <h3>Computer Vision</h3>
              <p>How machines see — image classification and visual models. In development between Levels 3 and 5.</p>
            </div>
          </li>
        ) : (
          <li className="path-step" key={step.id} style={{ '--i': i, ...levelVars(step.num) }}>
            <div className="path-step__node" aria-hidden="true">
              <span>L</span>
              {step.num}
            </div>
            <div className="path-step__card">
              <span className="path-step__tag">
                Level {step.num}
                {step.pro && <span className="path-step__pro">PRO</span>}
              </span>
              <h3>{step.title}</h3>
              <p>{step.blurb}</p>
              <span className="path-step__lessons">
                <Layers size={14} aria-hidden="true" />
                {step.count} {step.count === 1 ? 'lesson' : 'lessons'}
              </span>
              {step.comingSoon && <span className="path-step__soon">{step.comingSoon}</span>}
            </div>
          </li>
        ),
      )}
    </ol>
  )
}

/* Concise proof points shown as glassy chips. The lesson count is derived
   from the real curriculum so it never drifts. */
function StatsStrip({ lessonCount }) {
  const stats = [
    { Icon: Layers, value: `${lessonCount} lessons`, label: 'Hands-on, concept-first', accent: 'cyan' },
    { Icon: Code2, value: 'Real Python', label: 'scikit-learn in your browser', accent: 'emerald' },
    { Icon: CloudCheck, value: 'Cloud progress', label: 'Synced across devices', accent: 'electric' },
    { Icon: Sprout, value: 'Beginner-first', label: 'No prior code or math', accent: 'orange' },
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
  const lessonCount = LEVELS.length

  return (
    <div className="home">
      {/* Top nav */}
      <nav className="home__nav" aria-label="Home">
        <span className="brand">
          <span className="brand__mark" aria-hidden="true">
            <GraduationCap size={20} />
          </span>
          AI Academy
        </span>
        <span className="home__nav-spacer" />
        <button className="btn btn--ghost home__nav-curriculum" onClick={onExplore}>
          Curriculum
        </button>
        {accountSlot}
        <button className="btn btn--primary" onClick={onStart}>
          Start learning <ArrowRight size={18} />
        </button>
      </nav>

      {/* Hero */}
      <header className="hero-x">
        <Hero3D />
        <div className="hero-x__inner">
          <span className="chip-grad">
            <Sparkles size={13} aria-hidden="true" /> Learn AI &amp; ML from scratch
          </span>
          <h1>
            <span className="gradient-text">AI Academy</span>
          </h1>
          <p className="hero-x__lead">
            A futuristic, beginner-friendly way to learn Artificial Intelligence and Machine Learning —
            through {lessonCount} interactive lessons that take you from “what is data?” to running real
            Python models and evaluating AI responsibly.
          </p>
          <div className="btn-row hero-x__cta">
            <button className="btn btn--primary btn--lg" onClick={onStart}>
              Start learning <ArrowRight size={20} />
            </button>
            <button className="btn btn--secondary btn--lg" onClick={onExplore}>
              <Compass size={20} /> Explore curriculum
            </button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="home-section" aria-labelledby="features-h">
        <div className="home-section__head">
          <span className="chip-grad">How it works</span>
          <h2 id="features-h">Built for how beginners actually learn</h2>
          <p>Motivation before mechanism, doing before memorizing — and real tools when you’re ready.</p>
        </div>
        <FeatureGrid />
      </section>

      {/* Stats / benefit strip */}
      <section className="home-section home-section--stats" aria-label="At a glance">
        <StatsStrip lessonCount={lessonCount} />
      </section>

      {/* Curriculum preview */}
      <section className="home-section" id="curriculum" aria-labelledby="curriculum-h">
        <div className="home-section__head">
          <span className="chip-grad">The path</span>
          <h2 id="curriculum-h">A clear path, one level at a time</h2>
          <p>
            Five levels take you from foundations to applied AI evaluation. Each unlocks the next, so the
            journey always feels achievable.
          </p>
        </div>
        <LearningPath />
      </section>

      {/* Trust / benefits */}
      <section className="home-section" aria-labelledby="trust-h">
        <div className="home-section__head">
          <span className="chip-grad">Why learners stay</span>
          <h2 id="trust-h">Approachable by design</h2>
        </div>
        <div className="trust-row">
          {TRUST.map(({ Icon, title, body }) => (
            <div className="trust-item" key={title}>
              <div className="trust-item__icon">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="home-cta" aria-labelledby="cta-h">
        <div className="glass-card">
          <h2 id="cta-h">
            Ready to <span className="gradient-text">build your first model?</span>
          </h2>
          <p>Jump in — the first lesson is a two-minute win, and everything saves as you go.</p>
          <button className="btn btn--primary btn--lg" onClick={onStart}>
            <Rocket size={20} /> Start learning
          </button>
        </div>
      </section>

      <footer className="home__footer">
        AI Academy — learn AI &amp; Machine Learning by doing. Runs in your browser, no setup required.
      </footer>
    </div>
  )
}
