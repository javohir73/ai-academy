/*
 * NeuralBackground — a lightweight, decorative animated neural network for the
 * Home hero. Pure SVG + CSS (no external animation library, no canvas), so it's
 * cheap and respects prefers-reduced-motion (the dash-flow / node-pulse
 * animations are disabled there via global.css).
 *
 * It's purely decorative: aria-hidden, pointer-events disabled in CSS, and it
 * sits behind the hero content. The node/edge layout is a fixed, hand-tuned set
 * (no randomness) so it renders identically every time and never jitters.
 */

// Three loose "layers" of nodes (like an MLP) positioned in a 1000x520 viewBox.
const LAYERS = [
  [
    { x: 120, y: 110 },
    { x: 120, y: 250 },
    { x: 120, y: 390 },
  ],
  [
    { x: 380, y: 90 },
    { x: 380, y: 200 },
    { x: 380, y: 320 },
    { x: 380, y: 440 },
  ],
  [
    { x: 640, y: 130 },
    { x: 640, y: 270 },
    { x: 640, y: 410 },
  ],
  [
    { x: 880, y: 200 },
    { x: 880, y: 330 },
  ],
]

// Fully connect adjacent layers (this is what reads as a "neural net").
const EDGES = []
for (let l = 0; l < LAYERS.length - 1; l++) {
  LAYERS[l].forEach((a, ai) => {
    LAYERS[l + 1].forEach((b, bi) => {
      EDGES.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: `${l}-${ai}-${bi}` })
    })
  })
}

const NODES = LAYERS.flat()

export default function NeuralBackground() {
  return (
    <svg
      className="neural-bg"
      viewBox="0 0 1000 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nbStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Edges (data-flow lines) — staggered so the flow looks organic. */}
      <g>
        {EDGES.map((e, i) => (
          <line
            key={e.key}
            className="neural-bg__edge"
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            style={{ animationDelay: `${(i % 9) * 0.18}s` }}
          />
        ))}
      </g>

      {/* Glowing nodes — gentle pulse, staggered. */}
      <g>
        {NODES.map((n, i) => (
          <circle
            key={i}
            className="neural-bg__node"
            cx={n.x}
            cy={n.y}
            r={3.5}
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
