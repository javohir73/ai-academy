import { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * LabelIssuesGame — Helpful / Honest / Harmless (intermediate 6). Each answer
 * breaks one principle; the learner assigns the matching issue label. Drag a
 * label chip onto an answer (pointer events → mouse + touch), or tap a label
 * then tap an answer (keyboard / screen-reader path).
 *
 * data = {
 *   labels: [{ id, text }],
 *   statements: [{ id, text, label, why }]   // label = correct label id
 * }
 */
export default function LabelIssuesGame({ data, onResult }) {
  const { t } = useLanguage()
  const [assign, setAssign] = useState({}) // statementId -> labelId
  const [selLabel, setSelLabel] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [drag, setDrag] = useState(null) // { labelId, x, y, over }
  const dragRef = useRef(null)
  const justDragged = useRef(false)

  const labelText = (id) => data.labels.find((l) => l.id === id)?.text
  const allAssigned = data.statements.every((s) => assign[s.id])

  function doAssign(statementId, labelId) {
    if (submitted) return
    setAssign((a) => ({ ...a, [statementId]: labelId }))
    setSelLabel(null)
  }
  function check() {
    if (!allAssigned || submitted) return
    setSubmitted(true)
    onResult({ correct: data.statements.every((s) => assign[s.id] === s.label) })
  }

  // pointer drag for label chips
  function onPointerDown(e, labelId) {
    if (submitted) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* drag degrades to tap */
    }
    dragRef.current = { labelId, sx: e.clientX, sy: e.clientY, moved: false, over: null }
  }
  function onPointerMove(e) {
    const info = dragRef.current
    if (!info || submitted) return
    if (!info.moved && Math.hypot(e.clientX - info.sx, e.clientY - info.sy) < 6) return
    info.moved = true
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const target = el?.closest('[data-statement-id]')
    info.over = target ? target.getAttribute('data-statement-id') : null
    setDrag({ labelId: info.labelId, x: e.clientX, y: e.clientY, over: info.over })
  }
  function endDrag() {
    const info = dragRef.current
    dragRef.current = null
    if (info?.moved) {
      if (info.over) doAssign(info.over, info.labelId)
      justDragged.current = true
    }
    setDrag(null)
  }
  function onClickLabel(id) {
    if (justDragged.current) {
      justDragged.current = false
      return
    }
    if (submitted) return
    setSelLabel((p) => (p === id ? null : id))
  }
  function onClickStatement(sid) {
    if (submitted || !selLabel) return
    doAssign(sid, selLabel)
  }

  return (
    <div className="stack">
      <div className="issue-labels" role="group" aria-label={t('label.labelsAria')}>
        {data.labels.map((l) => (
          <button
            key={l.id}
            className={`issue-label${selLabel === l.id ? ' issue-label--sel' : ''}${
              drag?.labelId === l.id ? ' token--dragging' : ''
            }`}
            aria-pressed={selLabel === l.id}
            onPointerDown={(e) => onPointerDown(e, l.id)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={() => onClickLabel(l.id)}
          >
            {l.text}
          </button>
        ))}
      </div>

      <p className="count-hint">
        {selLabel
          ? `${t('label.nowTap.pre')}${labelText(selLabel)}${t('label.nowTap.post')}`
          : t('label.dragHint')}
      </p>

      <div className="stack">
        {data.statements.map((s) => {
          const assigned = assign[s.id]
          const ok = submitted && assigned === s.label
          const over = drag?.over === s.id
          let cls = 'label-target'
          if (over) cls += ' label-target--over'
          if (submitted && ok) cls += ' option--correct'
          if (submitted && !ok) cls += ' option--wrong'
          return (
            <div
              key={s.id}
              className={cls}
              data-statement-id={s.id}
              role="button"
              tabIndex={submitted ? -1 : 0}
              aria-label={`${t('label.answerAria.pre')}${s.text}. ${assigned ? t('label.answerAria.labeled') + labelText(assigned) : t('label.answerAria.none')}`}
              onClick={() => onClickStatement(s.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && selLabel) {
                  e.preventDefault()
                  onClickStatement(s.id)
                }
              }}
            >
              <span className="label-target__text">“{s.text}”</span>
              <span className="label-target__slot">
                {assigned ? (
                  <span className="issue-label issue-label--placed">
                    {labelText(assigned)}
                    {submitted && (ok ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />)}
                  </span>
                ) : (
                  <span className="muted">{t('label.dropLabel')}</span>
                )}
              </span>
              {submitted && (
                <p className="eval-issue" style={{ marginTop: 'var(--s2)' }}>
                  <span>
                    {ok ? '' : `${t('label.shouldBe.pre')}${labelText(s.label)}${t('label.shouldBe.post')}`}
                    {s.why}
                  </span>
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allAssigned || submitted}>
          {t('act.checkLabels')}
        </button>
      </div>

      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {labelText(drag.labelId)}
        </div>
      )}
    </div>
  )
}
