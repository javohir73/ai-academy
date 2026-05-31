import { useState } from 'react'
import { Check, X, CheckCircle2, AlertTriangle, Square, CheckSquare } from 'lucide-react'

/*
 * ScenarioGame — judgment + short reasoning ('scenario' type). Presents one
 * situation and a set of choices; the learner picks the BEST option (single
 * choice) or the best set of options (when data.multi is true). On "Check
 * answer" we score once and reveal the `why` on every relevant choice so the
 * learner understands the reasoning, not just the right answer.
 *
 * Designed for decisions like:
 *   - transfer learning: dataset size × similarity → freeze / fine-tune / from-scratch
 *   - learning-rate risk → catastrophic forgetting
 *   - failure-case gallery → label each failure (distribution-shift / spurious /
 *     occlusion / adversarial)
 *   - break-it study → choose failure modes + pick the best explanation
 *
 * data = {
 *   scenario: string,                 // the situation to judge
 *   choices: [
 *     { id, label, correct: bool, why: string }
 *   ],
 *   multi?: bool                      // false/omitted = pick one; true = pick the correct set
 * }
 *
 * Scoring:
 *   - single (multi falsy): correct iff the chosen option's `correct` is true.
 *   - multi: correct iff the selected set is EXACTLY the set of `correct` options.
 */
export default function ScenarioGame({ data, onResult }) {
  const multi = !!data.multi
  const [selected, setSelected] = useState(() => new Set()) // chosen choice ids
  const [submitted, setSubmitted] = useState(false)

  const hasSelection = selected.size > 0

  function toggle(id) {
    if (submitted) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (multi) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        // single-best: replace selection
        next.clear()
        next.add(id)
      }
      return next
    })
  }

  function check() {
    if (!hasSelection || submitted) return
    setSubmitted(true)
    let correct
    if (multi) {
      const correctIds = data.choices.filter((c) => c.correct).map((c) => c.id)
      correct =
        selected.size === correctIds.length && correctIds.every((id) => selected.has(id))
    } else {
      const pickedId = [...selected][0]
      correct = !!data.choices.find((c) => c.id === pickedId)?.correct
    }
    onResult({ correct })
  }

  const hint = multi
    ? 'Select every choice that applies, then check your answer.'
    : 'Pick the single best choice, then check your answer.'

  return (
    <div className="stack">
      <div className="scenario">{data.scenario}</div>

      {!submitted && (
        <p className="count-hint" style={{ margin: 0 }}>
          {hint}
        </p>
      )}

      <div
        className="options"
        role={multi ? 'group' : 'radiogroup'}
        aria-label="Choices"
      >
        {data.choices.map((c) => {
          const picked = selected.has(c.id)
          let cls = 'option'
          if (!submitted && picked) cls += ' option--selected'
          if (submitted && c.correct) cls += ' option--correct'
          if (submitted && picked && !c.correct) cls += ' option--wrong'
          // After submit, explain the chosen ones and the correct ones.
          const showWhy = submitted && (picked || c.correct)

          // Pick the right state icon for the multi checkbox affordance.
          let StateIcon = null
          if (multi && !submitted) StateIcon = picked ? CheckSquare : Square

          return (
            <div key={c.id}>
              <button
                className={cls}
                type="button"
                role={multi ? 'checkbox' : 'radio'}
                aria-checked={picked}
                disabled={submitted}
                onClick={() => toggle(c.id)}
              >
                <span className="scenario-choice__label">
                  {StateIcon && <StateIcon size={16} aria-hidden="true" />}
                  <span>{c.label}</span>
                </span>
                {submitted && c.correct && (
                  <span className="option__mark">
                    <Check size={15} /> {multi ? 'should pick' : 'best choice'}
                  </span>
                )}
                {submitted && picked && !c.correct && (
                  <span className="option__mark">
                    <X size={15} /> not this
                  </span>
                )}
              </button>
              {showWhy && (
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

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!hasSelection || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
