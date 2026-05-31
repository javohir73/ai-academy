import { useMemo, useState } from 'react'
import { Check, X, Layers, Plus, RotateCcw, ArrowRight } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'

/*
 * CNNBuilder — the architecture-assembly engine ('builder' type). The learner
 * builds a CNN by adding layer tiles IN ORDER into a pipeline:
 *   Conv → ReLU → Pool → (repeat block) → Flatten → Linear → Linear(→ classes)
 *
 * Interaction (mobile + keyboard friendly, no fragile drag-reorder):
 *   - Tap a tile in the palette to APPEND it to the pipeline.
 *   - Tap a tile already in the pipeline to remove it and everything after it
 *     (you rebuild forward — keeps order unambiguous).
 *   - "Clear" empties the pipeline.
 *
 * On "Check answer" we compare the learner's ordered id-sequence to data.correct
 * (the canonical order). Correct iff it matches exactly. On a miss we point at the
 * FIRST position that's wrong and explain it, so the feedback teaches the rule
 * ("a Linear head needs a Flatten before it", "pool comes after the activation",
 * etc.) rather than just saying "wrong".
 *
 * Same contract as every activity: ({ data, onResult }) renders the interaction
 * plus one "Check answer" .btn--primary and calls onResult({ correct }) EXACTLY
 * ONCE. ActivityShell handles feedback/stars/next.
 *
 * data = {
 *   tiles: [{ id, label, note? }],   // the palette (shuffled on mount)
 *   correct: [id, id, ...],          // the canonical order (subset/all of tiles' ids)
 *   targetPrompt?: string,           // optional one-line "build THIS" instruction
 *   mismatch?: { [id]: string },     // optional per-tile "why this is misplaced" note
 * }
 *
 * Note: every id in `correct` must exist in `tiles`. The learner must use each
 * required tile exactly once and in the right order.
 */
export default function CNNBuilder({ data, onResult }) {
  const tiles = useMemo(() => shuffle(data.tiles ?? []), [data])
  const correct = data.correct ?? []
  const [pipeline, setPipeline] = useState([]) // ordered list of tile ids
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  const tileById = useMemo(() => Object.fromEntries(tiles.map((t) => [t.id, t])), [tiles])

  // A tile is "used up" once it's in the pipeline (each required tile used once).
  const usedCount = (id) => pipeline.filter((p) => p === id).length
  const maxUses = (id) => correct.filter((c) => c === id).length || 1
  const available = tiles.filter((t) => usedCount(t.id) < maxUses(t.id))

  function add(id) {
    if (submitted) return
    setPipeline((p) => [...p, id])
  }
  function truncateAt(index) {
    if (submitted) return
    setPipeline((p) => p.slice(0, index)) // remove this tile and everything after it
  }
  function clear() {
    if (submitted) return
    setPipeline([])
  }

  const complete = pipeline.length === correct.length
  const canCheck = !submitted && pipeline.length > 0

  // We grade by the LABEL sequence, not the opaque tile id. Several tiles can be
  // interchangeable (e.g. three identical "ReLU" tiles); the learner can only
  // see labels, so any arrangement that yields the right label order is correct.
  const labelOf = (id) => tileById[id]?.label
  const correctLabels = useMemo(() => correct.map(labelOf), [correct, tileById])

  // First index where the learner's pipeline diverges from the canonical order.
  const firstWrong = useMemo(() => {
    const n = Math.max(pipeline.length, correctLabels.length)
    for (let i = 0; i < n; i += 1) {
      if (labelOf(pipeline[i]) !== correctLabels[i]) return i
    }
    return -1
  }, [pipeline, correctLabels, tileById])

  function check() {
    if (!canCheck) return
    setSubmitted(true)
    const ok =
      pipeline.length === correct.length &&
      pipeline.every((id, i) => labelOf(id) === correctLabels[i])
    setWasCorrect(ok)
    onResult({ correct: ok })
  }

  // Build an explanation of the first mistake for the feedback strip.
  function mistakeText() {
    if (firstWrong === -1) return ''
    const got = pipeline[firstWrong]
    const want = correct[firstWrong]
    if (got == null) {
      // pipeline too short — a required layer is missing at this position
      const missing = tileById[want]
      return `The pipeline is missing ${missing?.label ?? 'a layer'} at step ${firstWrong + 1}.`
    }
    const gotTile = tileById[got]
    const why = data.mismatch?.[got]
    return (
      why ||
      `Step ${firstWrong + 1} should not be ${gotTile?.label ?? 'this layer'} — check the canonical order.`
    )
  }

  return (
    <div className="stack">
      <p className="count-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
        <Layers size={16} aria-hidden="true" />
        <span>
          {data.targetPrompt ||
            'Tap layers in order to assemble the network. Tap a placed layer to remove it and everything after it.'}
        </span>
      </p>

      {/* Palette of available layer tiles */}
      <div className="builder-palette" role="group" aria-label="Available layers">
        {available.length === 0 ? (
          <p className="count-hint" style={{ margin: 0 }}>
            All layers placed — review the order, then check your answer.
          </p>
        ) : (
          available.map((t) => (
            <button
              key={t.id}
              type="button"
              className="builder-tile"
              disabled={submitted}
              onClick={() => add(t.id)}
            >
              <Plus size={14} aria-hidden="true" />
              <span className="builder-tile__label">{t.label}</span>
              {t.note && <span className="builder-tile__note">{t.note}</span>}
            </button>
          ))
        )}
      </div>

      {/* The assembled pipeline */}
      <div className="builder-pipeline" aria-label="Your network, in order">
        <span className="builder-pipeline__head">Input image</span>
        {pipeline.length === 0 && <span className="builder-pipeline__empty">→ add layers above</span>}
        {pipeline.map((id, i) => {
          const t = tileById[id]
          let cls = 'builder-step'
          if (submitted) {
            if (firstWrong === -1 || i < firstWrong) cls += ' builder-step--ok'
            else if (i === firstWrong) cls += ' builder-step--wrong'
          }
          return (
            <span key={`${id}-${i}`} className="builder-step__wrap">
              <ArrowRight size={14} aria-hidden="true" className="builder-arrow" />
              <button
                type="button"
                className={cls}
                disabled={submitted}
                onClick={() => truncateAt(i)}
                aria-label={
                  submitted
                    ? `${t?.label}: step ${i + 1}`
                    : `${t?.label}: step ${i + 1}, tap to remove from here`
                }
              >
                {t?.label}
                {submitted && (firstWrong === -1 || i < firstWrong) && (
                  <Check size={14} aria-hidden="true" />
                )}
                {submitted && i === firstWrong && firstWrong !== -1 && (
                  <X size={14} aria-hidden="true" />
                )}
              </button>
            </span>
          )
        })}
        {complete && !submitted && <span className="builder-pipeline__tail">→ prediction</span>}
      </div>

      {/* Mistake explainer after submit */}
      {submitted && !wasCorrect && (
        <p className="ethics-why">
          <X size={16} color="var(--danger)" aria-hidden="true" />
          <span>{mistakeText()}</span>
        </p>
      )}

      <div className="btn-row btn-row--center">
        {pipeline.length > 0 && !submitted && (
          <button className="btn btn--secondary" type="button" onClick={clear}>
            <RotateCcw size={15} aria-hidden="true" /> Clear
          </button>
        )}
        <button className="btn btn--primary" type="button" onClick={check} disabled={!canCheck}>
          Check answer
        </button>
      </div>
    </div>
  )
}
