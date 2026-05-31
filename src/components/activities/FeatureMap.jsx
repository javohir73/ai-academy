import { useState } from 'react'
import { Check, X, CheckCircle2, AlertTriangle, Layers, Activity } from 'lucide-react'

/*
 * FeatureMap — the activation-visualizer engine ('featuremap' type). Two modes
 * share one component; both render small heat-grids you can poke, with NO real
 * model: the activation grids are AUTHORED 0–9 intensity patterns, so the
 * visualization is deterministic and always matches the explanation.
 *
 * mode 'depth' — Feature Map Explorer. Tabs step through network depth
 *   (early / mid / deep). Each depth shows a representative activation grid plus
 *   a caption. The learner sees the build-up edges → textures → object-parts,
 *   then answers a self-check about what a given depth detects.
 *
 * mode 'adversarial' — Perturbation demo. A slider sets ε (epsilon, the attack
 *   strength). The IMAGE grid barely changes as ε rises (the perturbation is
 *   tiny), but a confidence bar swings and, past data.flipAt, the predicted
 *   label flips to the wrong class — invisible change, confident wrong answer.
 *   The self-check asks the learner to read off the insight.
 *
 * Same contract as every activity: ({ data, onResult }) renders the interaction
 * plus one "Check answer" .btn--primary and calls onResult({ correct }) EXACTLY
 * ONCE. ActivityShell handles feedback/stars/next.
 *
 * data (mode 'depth') = {
 *   mode: 'depth',
 *   layers: [{ id, label, caption, grid: [[0..9, ...], ...] }, ...],
 *   check: { question, choices: [{ id, label, correct, why }] },
 * }
 *
 * data (mode 'adversarial') = {
 *   mode: 'adversarial',
 *   base: [[0..9, ...], ...],       // the clean image as an intensity grid
 *   trueLabel: string,              // correct class at ε = 0
 *   wrongLabel: string,             // class it flips to past the threshold
 *   maxEps: number,                 // slider max (e.g. 8, meaning ±0.08 etc. — just a scale)
 *   flipAt: number,                 // ε at/after which the label flips
 *   check: { question, choices: [{ id, label, correct, why }] },
 * }
 */

// Map a 0–9 intensity to an accent-tinted heat color (light → strong).
function heat(v) {
  const t = Math.max(0, Math.min(9, v)) / 9
  // interpolate from near-white to the indigo accent
  const r = Math.round(238 - t * (238 - 79))
  const g = Math.round(241 - t * (241 - 70))
  const b = Math.round(254 - t * (254 - 229))
  return `rgb(${r}, ${g}, ${b})`
}

function HeatGrid({ grid, label }) {
  const cols = grid[0]?.length ?? 0
  return (
    <div
      className="fmap-grid"
      role="img"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {grid.map((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            className="fmap-cell"
            style={{ background: heat(v), color: v > 5 ? '#fff' : 'var(--text-2)' }}
          >
            {v}
          </div>
        )),
      )}
    </div>
  )
}

function SelfCheck({ check, picked, submitted, onSelect }) {
  return (
    <div className="fmap-check">
      <p className="scenario">{check.question}</p>
      {!submitted && (
        <p className="count-hint" style={{ margin: 0 }}>
          Explore above, then pick the best answer.
        </p>
      )}
      <div className="options" role="radiogroup" aria-label="Self-check choices">
        {check.choices.map((c) => {
          const isPicked = picked === c.id
          let cls = 'option'
          if (!submitted && isPicked) cls += ' option--selected'
          if (submitted && c.correct) cls += ' option--correct'
          if (submitted && isPicked && !c.correct) cls += ' option--wrong'
          const showWhy = submitted && (isPicked || c.correct)
          return (
            <div key={c.id}>
              <button
                className={cls}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={submitted}
                onClick={() => onSelect(c.id)}
              >
                <span className="scenario-choice__label">
                  <span>{c.label}</span>
                </span>
                {submitted && c.correct && (
                  <span className="option__mark">
                    <Check size={15} /> correct
                  </span>
                )}
                {submitted && isPicked && !c.correct && (
                  <span className="option__mark">
                    <X size={15} /> not this
                  </span>
                )}
              </button>
              {showWhy && c.why && (
                <p className="ethics-why">
                  {c.correct ? (
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={16} color="var(--danger)" aria-hidden="true" />
                  )}
                  <span>{c.why}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FeatureMap({ data, onResult }) {
  const mode = data.mode === 'adversarial' ? 'adversarial' : 'depth'
  const check = data.check ?? { question: '', choices: [] }

  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // depth-mode state
  const layers = data.layers ?? []
  const [depthIdx, setDepthIdx] = useState(0)

  // adversarial-mode state
  const [eps, setEps] = useState(0)
  const maxEps = data.maxEps ?? 8
  const flipAt = data.flipAt ?? Math.ceil(maxEps / 2)

  function select(id) {
    if (submitted) return
    setPicked((prev) => (prev === id ? null : id))
  }
  function submit() {
    if (picked == null || submitted) return
    setSubmitted(true)
    const correct = !!check.choices.find((c) => c.id === picked)?.correct
    onResult({ correct })
  }

  // Adversarial: nudge each cell by a barely-visible amount scaled by ε, aligned
  // so the picture looks the same but the model's "confidence" swings.
  function perturbed(grid) {
    if (eps === 0) return grid
    const delta = eps / maxEps // 0..1
    return grid.map((row, r) =>
      row.map((v, c) => {
        // ±1 visual nudge at most — invisible — alternating sign by position
        const sign = (r + c) % 2 === 0 ? 1 : -1
        return Math.max(0, Math.min(9, Math.round(v + sign * delta)))
      }),
    )
  }

  const flipped = eps >= flipAt
  const confidence = flipped
    ? Math.round(55 + (eps - flipAt) / Math.max(1, maxEps - flipAt) * 44) // wrong class climbs to ~99
    : Math.round(58 - eps / Math.max(1, flipAt) * 12) // true class dips toward the boundary

  return (
    <div className="stack">
      {mode === 'depth' ? (
        <>
          <p
            className="count-hint"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}
          >
            <Layers size={16} aria-hidden="true" />
            <span>
              Step through the network's depth. Watch the activations go from generic edges to
              object-specific parts.
            </span>
          </p>

          {/* Depth tabs */}
          <div className="fmap-tabs" role="tablist" aria-label="Network depth">
            {layers.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={depthIdx === i}
                className={`fmap-tab${depthIdx === i ? ' is-active' : ''}`}
                onClick={() => setDepthIdx(i)}
              >
                {l.label}
              </button>
            ))}
          </div>

          {layers[depthIdx] && (
            <div className="fmap-stage">
              <HeatGrid
                grid={layers[depthIdx].grid}
                label={`${layers[depthIdx].label} activation map`}
              />
              <p className="fmap-caption">{layers[depthIdx].caption}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <p
            className="count-hint"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}
          >
            <Activity size={16} aria-hidden="true" />
            <span>
              Drag the perturbation strength up. The picture barely changes — but watch the model's
              prediction.
            </span>
          </p>

          <div className="fmap-adv">
            <div className="fmap-stage">
              <HeatGrid grid={perturbed(data.base ?? [])} label="Input image (with perturbation)" />
              <p className="fmap-caption">
                Perturbation ε = {eps} / {maxEps} — visually {eps === 0 ? 'clean' : 'almost identical'}
              </p>
            </div>

            <label className="fmap-slider">
              <span className="colab__eyebrow" style={{ margin: 0 }}>
                Attack strength (ε)
              </span>
              <input
                type="range"
                min={0}
                max={maxEps}
                step={1}
                value={eps}
                aria-label="Perturbation strength epsilon"
                onChange={(e) => setEps(Number(e.target.value))}
              />
            </label>

            {/* Prediction read-out: confident, and wrong past the threshold. */}
            <div className={`fmap-pred${flipped ? ' is-flipped' : ''}`} aria-live="polite">
              <span className="fmap-pred__label">
                Prediction: <strong>{flipped ? data.wrongLabel : data.trueLabel}</strong>
              </span>
              <span className="fmap-pred__bar" aria-hidden="true">
                <span className="fmap-pred__fill" style={{ width: `${confidence}%` }} />
              </span>
              <span className="fmap-pred__conf">{confidence}% confident</span>
            </div>
          </div>
        </>
      )}

      <SelfCheck check={check} picked={picked} submitted={submitted} onSelect={select} />

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={submit} disabled={picked == null || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
