import { useMemo, useState } from 'react'
import { Database, GraduationCap, Box, Sparkles, RefreshCw, ChevronRight, Check, X, Info } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'

/*
 * PipelineGame — interactive ML pipeline diagram (level 2). Tap the shuffled
 * stage chips to place them into the pipeline in the correct order. Tapping a
 * stage also reveals what it does (learn-by-exploring), and tapping a placed
 * step removes it. Visual diagram with connectors; works on mobile + desktop.
 *
 * data = { stages: [{ id, label, icon, desc }] }   // array order = correct order
 */
const ICONS = { Database, GraduationCap, Box, Sparkles, RefreshCw }

export default function PipelineGame({ data, onResult }) {
  const correctIds = data.stages.map((s) => s.id)
  const tray = useMemo(() => shuffle(data.stages), [data])
  const [order, setOrder] = useState([]) // placed stage ids, in slot order
  const [info, setInfo] = useState(null) // stage id whose description is shown
  const [submitted, setSubmitted] = useState(false)

  const byId = (id) => data.stages.find((s) => s.id === id)
  const remaining = tray.filter((s) => !order.includes(s.id))
  const full = order.length === data.stages.length

  function place(id) {
    if (submitted) return
    setOrder((o) => [...o, id])
    setInfo(id)
  }
  function removeAt(idx) {
    if (submitted) return
    const id = order[idx]
    setOrder((o) => o.filter((_, i) => i !== idx))
    setInfo(id)
  }
  function check() {
    if (!full || submitted) return
    setSubmitted(true)
    onResult({ correct: order.every((id, i) => id === correctIds[i]) })
  }

  const infoStage = info ? byId(info) : null

  return (
    <div className="stack">
      <div className="pipeline">
        {Array.from({ length: data.stages.length }).map((_, i) => {
          const id = order[i]
          const stage = id ? byId(id) : null
          const Icon = stage ? ICONS[stage.icon] : null
          const ok = submitted && id === correctIds[i]
          const wrong = submitted && id && id !== correctIds[i]
          return (
            <div className="pipeline__cell" key={i}>
              {stage ? (
                <button
                  className={`pipeline__step${ok ? ' option--correct' : ''}${wrong ? ' option--wrong' : ''}`}
                  onClick={() => removeAt(i)}
                  disabled={submitted}
                  aria-label={`Step ${i + 1}: ${stage.label}${submitted ? (ok ? ', correct' : ', wrong position') : ', tap to remove'}`}
                >
                  <span className="pipeline__num">{i + 1}</span>
                  <Icon size={20} aria-hidden="true" />
                  <span className="pipeline__label">{stage.label}</span>
                  {submitted &&
                    (ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />)}
                </button>
              ) : (
                <div className="pipeline__step pipeline__step--empty">
                  <span className="pipeline__num">{i + 1}</span>
                  <span className="muted">Step {i + 1}</span>
                </div>
              )}
              {i < data.stages.length - 1 && (
                <ChevronRight className="pipeline__arrow" size={18} aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>

      <div className="pipeline__info">
        <Info size={16} aria-hidden="true" />
        {infoStage ? (
          <span>
            <strong>{infoStage.label}:</strong> {infoStage.desc}
          </span>
        ) : (
          <span className="muted">Tap a stage below to add it to the pipeline and learn what it does.</span>
        )}
      </div>

      {remaining.length > 0 && !submitted && (
        <div className="tokens" aria-label="Pipeline stages">
          {remaining.map((s) => {
            const Icon = ICONS[s.icon]
            return (
              <button key={s.id} className="token" onClick={() => place(s.id)}>
                {Icon && <Icon size={16} aria-hidden="true" />} {s.label}
              </button>
            )
          })}
        </div>
      )}

      {submitted && (
        <p className="count-hint center">
          Correct order: {data.stages.map((s) => s.label).join(' → ')}
        </p>
      )}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!full || submitted}>
          Check order
        </button>
      </div>
    </div>
  )
}
