import { useMemo, useState } from 'react'
import { Check, X, Calculator, AlertTriangle, ArrowRight } from 'lucide-react'

/*
 * ShapeCalc — the mini-calculator engine ('calc' type). Three CNN-sizing tools
 * share one interaction: the learner reads a small set of given numbers, works
 * out the answer themselves, then enters it (or picks "this config is invalid"
 * for impossible conv shapes). Unlike convolve, the answer is COMPUTED from the
 * formula in-component — every mode is integer arithmetic, so there are no
 * float-rounding surprises and the authored explanation always agrees.
 *
 * mode 'conv-output' — output = (W − F + 2P) / S + 1.
 *   Given W (input size), F (filter), P (padding), S (stride), the learner
 *   types the output side length. If (W − F + 2P) is not divisible by S, the
 *   config is INVALID (a feature map can't have a fractional side) — the
 *   learner must tick the "invalid" box instead of typing a number.
 *
 * mode 'param-explosion' — compares an FC neuron to a conv filter on the same
 *   image. fcWeights = H·W·C, convWeights = F·F·C. The learner types whichever
 *   `ask` requests ('fc' | 'conv' | 'ratio'); ratio = round(fcWeights/convWeights).
 *
 * mode 'flatten' — a (C, H, W) conv/pool volume feeds an nn.Linear, which needs
 *   in_features = C·H·W. The learner types that flattened length. The classic
 *   shape-mismatch debugger.
 *
 * Same contract as every activity: ({ data, onResult }) renders the interaction
 * plus one "Check answer" .btn--primary and calls onResult({ correct }) EXACTLY
 * ONCE. ActivityShell handles feedback/stars/next.
 *
 * data = {
 *   mode: 'conv-output' | 'param-explosion' | 'flatten',
 *   // conv-output:
 *   W, F, P, S,
 *   // param-explosion:
 *   H, W, C, kernel,              // image H×W×C; kernel = F (square filter side)
 *   ask: 'fc' | 'conv' | 'ratio',
 *   // flatten:
 *   shape: { c, h, w },
 *   prompt?: string,              // optional override for the question line
 * }
 */

// ---- pure helpers (also imported by the test for the formulas) -------------

export function convOutput({ W, F, P, S }) {
  const numerator = W - F + 2 * P
  if (numerator < 0 || numerator % S !== 0) return { valid: false }
  return { valid: true, size: numerator / S + 1 }
}

export function paramExplosion({ H, W, C, kernel, ask }) {
  const fc = H * W * C
  const conv = kernel * kernel * C
  if (ask === 'fc') return fc
  if (ask === 'conv') return conv
  return Math.round(fc / conv) // 'ratio'
}

export function flattenSize({ c, h, w }) {
  return c * h * w
}

// ---------------------------------------------------------------------------

export default function ShapeCalc({ data, onResult }) {
  const mode = data.mode
  const [value, setValue] = useState('') // typed number (as string)
  const [invalid, setInvalid] = useState(false) // conv-output "invalid config" tick
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  // Compute the truth for this config once.
  const truth = useMemo(() => {
    if (mode === 'conv-output') return convOutput(data)
    if (mode === 'param-explosion') return { value: paramExplosion(data) }
    return { value: flattenSize(data.shape) } // flatten
  }, [mode, data])

  const isConvOutput = mode === 'conv-output'
  const canCheck =
    !submitted && (invalid || (value.trim() !== '' && Number.isFinite(Number(value))))

  function check() {
    if (!canCheck) return
    setSubmitted(true)
    let correct
    if (isConvOutput) {
      if (!truth.valid) {
        correct = invalid // right call is "this config is invalid"
      } else {
        correct = !invalid && Number(value) === truth.size
      }
    } else {
      correct = Number(value) === truth.value
    }
    setWasCorrect(correct)
    onResult({ correct })
  }

  // --- per-mode framing ----------------------------------------------------
  const given = []
  let formula = ''
  let question = data.prompt || ''
  let unit = ''

  if (isConvOutput) {
    given.push(
      { k: 'Input size W', v: data.W },
      { k: 'Filter F', v: data.F },
      { k: 'Padding P', v: data.P },
      { k: 'Stride S', v: data.S },
    )
    formula = 'output = (W − F + 2P) / S + 1'
    question = question || 'What is the output feature-map side length?'
    unit = 'px per side'
  } else if (mode === 'param-explosion') {
    given.push(
      { k: 'Image', v: `${data.H}×${data.W}×${data.C}` },
      { k: 'Conv filter', v: `${data.kernel}×${data.kernel}×${data.C}` },
    )
    if (data.ask === 'fc') {
      formula = 'FC neuron weights = H × W × C'
      question = question || 'How many weights does ONE fully-connected neuron need?'
      unit = 'weights'
    } else if (data.ask === 'conv') {
      formula = 'conv filter weights = F × F × C'
      question = question || 'How many weights does ONE conv filter need (shared everywhere)?'
      unit = 'weights'
    } else {
      formula = 'ratio = (H × W × C) / (F × F × C)'
      question = question || 'How many times MORE weights does the FC neuron use than the conv filter?'
      unit = '× more'
    }
  } else {
    // flatten
    given.push({ k: 'Conv/pool volume (C, H, W)', v: `(${data.shape.c}, ${data.shape.h}, ${data.shape.w})` })
    formula = 'in_features = C × H × W'
    question = question || 'What in_features must the first nn.Linear use after flattening?'
    unit = 'features'
  }

  return (
    <div className="stack">
      <p className="count-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
        <Calculator size={16} aria-hidden="true" />
        <span>
          Work it out with the formula below, then enter your answer.
        </span>
      </p>

      {/* Given values */}
      <div className="calc-givens">
        {given.map((g) => (
          <div key={g.k} className="calc-given">
            <span className="calc-given__k">{g.k}</span>
            <span className="calc-given__v">{g.v}</span>
          </div>
        ))}
      </div>

      <p className="calc-formula">
        <code>{formula}</code>
      </p>

      <p className="prompt" style={{ marginBottom: 'var(--s3)' }}>
        {question}
      </p>

      {/* Numeric entry */}
      <div className="calc-entry">
        <label className="calc-entry__field">
          <input
            type="number"
            inputMode="numeric"
            className="calc-input"
            value={value}
            disabled={submitted || invalid}
            placeholder="?"
            aria-label="Your answer"
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="calc-entry__unit">{unit}</span>
        </label>

        {/* Only conv-output offers the "invalid config" escape hatch. */}
        {isConvOutput && (
          <label className={`calc-invalid${invalid ? ' is-on' : ''}`}>
            <input
              type="checkbox"
              checked={invalid}
              disabled={submitted}
              onChange={(e) => {
                setInvalid(e.target.checked)
                if (e.target.checked) setValue('')
              }}
            />
            <AlertTriangle size={15} aria-hidden="true" />
            This stride/padding combo is invalid (no whole-number output)
          </label>
        )}
      </div>

      {/* Reveal the worked answer after submit. */}
      {submitted && (
        <p className={`calc-result ${wasCorrect ? 'is-correct' : 'is-wrong'}`}>
          {wasCorrect ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <X size={16} aria-hidden="true" />
          )}
          <span>
            {isConvOutput && !truth.valid ? (
              <>
                Correct call: <strong>invalid</strong> — (W − F + 2P) = {data.W - data.F + 2 * data.P} is
                not divisible by S = {data.S}, so the output side isn't a whole number. Change the
                stride or padding.
              </>
            ) : (
              <>
                Answer: <strong>{isConvOutput ? truth.size : truth.value}</strong> {unit}
                {mode === 'param-explosion' && data.ask !== 'ratio' && (
                  <>
                    {' '}
                    <ArrowRight size={13} aria-hidden="true" /> {formula.replace(/^.*=\s*/, '')} ={' '}
                    {isConvOutput ? truth.size : truth.value}
                  </>
                )}
              </>
            )}
          </span>
        </p>
      )}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!canCheck}>
          Check answer
        </button>
      </div>
    </div>
  )
}
