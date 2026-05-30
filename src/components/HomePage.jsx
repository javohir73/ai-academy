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
} from 'lucide-react'
import NeuralBackground from './NeuralBackground.jsx'
import { TRACKS, LEVELS } from '../data/tracks.js'

/*
 * HomePage — the marketing / landing screen shown before the course. It is the
 * app's first view (see App.jsx). Two CTAs:
 *   - "Start learning"      → onStart (enters the course: overview or next lesson)
 *   - "Explore curriculum"  → onExplore (scrolls to the curriculum preview)
 *
 * Everything is local CSS + Lucide icons (no external assets/CDNs), so it adds
 * no new CSP origins. FeatureGrid / CurriculumPreview are kept inline as small
 * presentational pieces (used only here) rather than over-split into files.
 */

const FEATURES = [
  {
    Icon: BookOpenCheck,
    title: 'Concept-first lessons',
    body: 'Start with plain-English ideas and everyday examples — the intuition comes before any math or code.',
  },
  {
    Icon: MousePointerClick,
    title: 'Interactive challenges',
    body: 'Learn by doing: sort, match, predict, and build. Almost every lesson is a hands-on challenge, not a quiz.',
  },
  {
    Icon: TerminalSquare,
    title: 'Real Python in the browser',
    body: 'Write and run real scikit-learn code in an in-browser notebook — no installs, no setup, graded instantly.',
  },
  {
    Icon: ShieldCheck,
    title: 'Responsible AI & LLM evaluation',
    body: 'Finish by thinking like an AI model evaluator: score answers, catch hallucinations, and judge AI responsibly.',
  },
]

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
      {FEATURES.map(({ Icon, title, body }, i) => (
        <div className="feature-card glow-card" key={title} style={{ '--i': i }}>
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

function CurriculumPreview() {
  return (
    <div className="curriculum-rail">
      {TRACKS.map((track, i) => (
        <div className="level-card glow-card" key={track.id} style={{ '--i': i }}>
          <div className="level-card__num">
            {track.tag.replace('Level ', 'LEVEL ')}
            <span className="gradient-text">{track.tag.replace('Level ', '')}</span>
          </div>
          <h3>{track.title}</h3>
          <p>{track.blurb}</p>
          {track.comingSoon && <p className="level-card__soon">{track.comingSoon}</p>}
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
        <NeuralBackground />
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
        <CurriculumPreview />
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
