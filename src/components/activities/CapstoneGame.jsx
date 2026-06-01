import { useState } from 'react'
import { Check, X, CircleCheck, Circle, AlertTriangle, Award, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * CapstoneGame — the final evaluation packet (intermediate 8). A guided
 * wizard that walks the learner through five evaluator tasks (score, rank,
 * catch an error, rewrite, reflect) with a progress checklist. Objective steps
 * must be answered correctly to advance (with unlimited retries); the
 * subjective steps need a real written response. Ends with a score summary and
 * an evaluator "certificate", then reports completion to the shell.
 *
 * data = { steps: [{ kind, title, ... }] }   // see intermediate.js for shapes
 */
export default function CapstoneGame({ data, onResult }) {
  const { t } = useLanguage()
  const steps = data.steps
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(() => steps.map(() => false))
  const finished = idx >= steps.length

  function pass() {
    setDone((d) => {
      const n = [...d]
      n[idx] = true
      return n
    })
    setIdx((i) => i + 1)
  }

  function finish() {
    onResult({ correct: true })
  }

  return (
    <div className="capstone">
      <ol className="checklist" aria-label={t('capstone.progressAria')}>
        {steps.map((s, i) => {
          const state = done[i] ? 'done' : i === idx ? 'active' : 'pending'
          return (
            <li key={i} className={`checklist__item checklist__item--${state}`}>
              {done[i] ? <CircleCheck size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
              <span>{s.title}</span>
            </li>
          )
        })}
      </ol>

      <div className="capstone__panel">
        {finished ? (
          <Summary onFinish={finish} count={steps.length} />
        ) : (
          <Step key={idx} step={steps[idx]} index={idx} total={steps.length} onPass={pass} />
        )}
      </div>
    </div>
  )
}

function Step({ step, index, total, onPass }) {
  const { t } = useLanguage()
  const common = { step, onPass }
  return (
    <div className="capstone__step">
      <div className="capstone__stephead">
        {t('capstone.task.pre')}{index + 1}{t('capstone.task.mid')}{total} · {step.title}
      </div>
      {step.kind === 'rate' && <RateStep {...common} />}
      {step.kind === 'compare' && <CompareStep {...common} />}
      {step.kind === 'highlight' && <HighlightStep {...common} />}
      {step.kind === 'rewrite' && <RewriteStep {...common} />}
      {step.kind === 'reflect' && <ReflectStep {...common} />}
    </div>
  )
}

/* ---- objective: score 1-5 ---- */
function RateStep({ step, onPass }) {
  const { t } = useLanguage()
  const [score, setScore] = useState(3)
  const [checked, setChecked] = useState(false)
  const correct = Math.abs(score - step.ideal) <= step.tolerance
  return (
    <div className="stack">
      <div className="eval-card__prompt">{step.promptText}</div>
      <div className="eval-card__answer">“{step.answer}”</div>
      <div className="rate">
        <div className="rate__head">
          <span>{t('capstone.yourScore')}</span>
          <span className="rate__value">
            {score}
            <span className="muted">/5</span>
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={score}
          onChange={(e) => {
            setScore(Number(e.target.value))
            setChecked(false)
          }}
          aria-label={t('capstone.scoreAria')}
        />
        <div className="rate__scale">
          <span>{t('capstone.scale.poor')}</span>
          <span>3</span>
          <span>{t('capstone.scale.excellent')}</span>
        </div>
      </div>
      <Verdict checked={checked} correct={correct} okText={`${t('capstone.expertScore.pre')}${step.ideal}/5. ${step.rationale}`} badText={t('capstone.rate.bad')} />
      <StepActions checked={checked} correct={correct} onCheck={() => setChecked(true)} onPass={onPass} checkLabel={t('act.checkScore')} />
    </div>
  )
}

/* ---- objective: rank two ---- */
function CompareStep({ step, onPass }) {
  const { t } = useLanguage()
  const [pick, setPick] = useState(null)
  const [checked, setChecked] = useState(false)
  const correct = pick === step.better
  return (
    <div className="stack">
      <div className="eval-card__prompt">{step.promptText}</div>
      <div className="compare">
        {['a', 'b'].map((side) => {
          const picked = pick === side
          let cls = 'compare__card'
          if (!checked && picked) cls += ' option--selected'
          if (checked && step.better === side) cls += ' option--correct'
          if (checked && picked && step.better !== side) cls += ' option--wrong'
          return (
            <button
              key={side}
              className={cls}
              aria-pressed={picked}
              onClick={() => {
                setPick(side)
                setChecked(false)
              }}
            >
              <span className="compare__tag">{t('capstone.answer')} {side.toUpperCase()}</span>
              <span className="compare__text">{step[side]}</span>
            </button>
          )
        })}
      </div>
      <Verdict checked={checked} correct={correct} okText={step.why} badText={t('capstone.compare.bad')} />
      <StepActions checked={checked} correct={correct} disabled={!pick} onCheck={() => setChecked(true)} onPass={onPass} checkLabel={t('act.checkChoice')} />
    </div>
  )
}

/* ---- objective: highlight the error ---- */
function HighlightStep({ step, onPass }) {
  const { t } = useLanguage()
  const [sel, setSel] = useState([])
  const [checked, setChecked] = useState(false)
  const badIds = step.sentences.filter((s) => s.bad).map((s) => s.id)
  const correct = badIds.length === sel.length && badIds.every((id) => sel.includes(id))
  return (
    <div className="stack">
      <div className="eval-card__prompt">{step.promptText}</div>
      <p className="highlight-doc">
        {step.sentences.map((s) => {
          const picked = sel.includes(s.id)
          let cls = 'hl-sent'
          if (!checked && picked) cls += ' hl-sent--sel'
          if (checked && s.bad) cls += ' hl-sent--bad'
          if (checked && picked && !s.bad) cls += ' hl-sent--wrongpick'
          return (
            <span key={s.id}>
              <button
                className={cls}
                onClick={() => {
                  setSel((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))
                  setChecked(false)
                }}
              >
                {s.text}
              </button>{' '}
            </span>
          )
        })}
      </p>
      <Verdict checked={checked} correct={correct} okText={step.why} badText={t('capstone.highlight.bad')} />
      <StepActions checked={checked} correct={correct} onCheck={() => setChecked(true)} onPass={onPass} checkLabel={t('act.checkHighlight')} />
    </div>
  )
}

/* ---- subjective: rewrite ---- */
function RewriteStep({ step, onPass }) {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const ready = text.trim().length >= 12
  return (
    <div className="stack">
      <div className="eval-card__prompt">{step.promptText}</div>
      <div className="eval-weak">
        <span className="eval-weak__tag">{t('capstone.weakTag')}</span>“{step.weakAnswer}”
      </div>
      <label className="rewrite-label" htmlFor="cap-rewrite">
        {t('capstone.improvedLabel')}
      </label>
      <textarea
        id="cap-rewrite"
        className="rewrite-box"
        rows={4}
        placeholder={step.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={() => onPass(true)} disabled={!ready}>
          {t('capstone.submitContinue')} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

/* ---- subjective: reflection ---- */
function ReflectStep({ step, onPass }) {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const ready = text.trim().length >= 12
  return (
    <div className="stack">
      <div className="eval-card__prompt">{step.question}</div>
      <textarea
        className="rewrite-box"
        rows={4}
        placeholder={step.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label={t('capstone.reflectionAria')}
      />
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={() => onPass(true)} disabled={!ready}>
          {t('capstone.submitReflection')} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

/* ---- shared bits ---- */
function Verdict({ checked, correct, okText, badText }) {
  if (!checked) return null
  return (
    <p className={`eval-verdict ${correct ? 'is-ok' : 'is-bad'}`}>
      {correct ? <Check size={15} aria-hidden="true" /> : <AlertTriangle size={15} aria-hidden="true" />}
      <span>{correct ? okText : badText}</span>
    </p>
  )
}

function StepActions({ checked, correct, disabled, onCheck, onPass, checkLabel }) {
  const { t } = useLanguage()
  if (checked && correct) {
    return (
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={() => onPass(true)}>
          {t('act.continue')} <ArrowRight size={16} />
        </button>
      </div>
    )
  }
  return (
    <div className="btn-row btn-row--center">
      <button className="btn btn--primary" onClick={onCheck} disabled={disabled}>
        {checkLabel}
      </button>
    </div>
  )
}

function Summary({ onFinish, count }) {
  const { t } = useLanguage()
  return (
    <div className="capstone__summary">
      <div className="capstone__badge" aria-hidden="true">
        <Award size={34} />
      </div>
      <h3 style={{ margin: 0 }}>{t('capstone.summary.title')}</h3>
      <p className="muted" style={{ marginTop: 'var(--s2)' }}>
        {t('capstone.summary.body.pre')}{count}{t('capstone.summary.body.post')}
      </p>
      <div className="capstone__cert">
        <CircleCheck size={18} aria-hidden="true" /> {t('capstone.summary.cert')}
      </div>
      <div className="btn-row btn-row--center" style={{ marginTop: 'var(--s4)' }}>
        <button className="btn btn--primary" onClick={onFinish}>
          {t('capstone.summary.claim')}
        </button>
      </div>
    </div>
  )
}
