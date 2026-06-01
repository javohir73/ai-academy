import { useMemo, useRef, useState } from 'react'
import { Check, X, CornerDownRight } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * SortGame — "sort items into two groups" (level 1). Two ways to play, both
 * mobile + keyboard friendly:
 *   - Drag a card onto a group (pointer events → works with mouse and touch).
 *   - Or tap a card to select it, then tap a group's "Place here" button
 *     (this path is keyboard-accessible and the screen-reader fallback).
 *
 * data = {
 *   buckets: [{ id, label }, { id, label }],
 *   tokens:  [{ id, label, bucket }, ...]   // bucket = correct group id
 * }
 */
export default function SortGame({ data, onResult }) {
  const { t: tr } = useLanguage()
  const tokens = useMemo(() => shuffle(data.tokens), [data])
  const [placement, setPlacement] = useState({}) // tokenId -> bucketId
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [drag, setDrag] = useState(null) // { id, x, y, over } while dragging

  const dragRef = useRef(null) // live drag info (avoids stale closures)
  const justDragged = useRef(false) // suppress the click that follows a drag

  const unplaced = tokens.filter((t) => !placement[t.id])
  const allPlaced = unplaced.length === 0
  const labelOf = (id) => tokens.find((t) => t.id === id)?.label

  function place(id, bucketId) {
    if (submitted) return
    setPlacement((p) => ({ ...p, [id]: bucketId }))
    setSelected(null)
  }
  function selectToken(id) {
    if (submitted) return
    setSelected((prev) => (prev === id ? null : id))
  }
  function removeToken(id) {
    if (submitted) return
    setPlacement((p) => {
      const next = { ...p }
      delete next[id]
      return next
    })
  }
  function check() {
    if (!allPlaced || submitted) return
    setSubmitted(true)
    onResult({ correct: tokens.every((t) => placement[t.id] === t.bucket) })
  }

  // ---- pointer drag-and-drop -------------------------------------------
  function onPointerDown(e, id) {
    if (submitted) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* setPointerCapture can fail in odd cases; drag just degrades to tap */
    }
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, moved: false, over: null }
  }
  function onPointerMove(e) {
    const info = dragRef.current
    if (!info || submitted) return
    const dist = Math.hypot(e.clientX - info.startX, e.clientY - info.startY)
    if (!info.moved && dist < 6) return // ignore tiny jitters (it's a tap)
    info.moved = true
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const bucket = el?.closest('[data-bucket-id]')
    info.over = bucket ? bucket.getAttribute('data-bucket-id') : null
    setDrag({ id: info.id, x: e.clientX, y: e.clientY, over: info.over })
  }
  function endDrag() {
    const info = dragRef.current
    dragRef.current = null
    if (info?.moved) {
      if (info.over) place(info.id, info.over)
      justDragged.current = true // the synthetic click that follows is ignored
    }
    setDrag(null)
  }
  function onClickToken(id) {
    if (justDragged.current) {
      justDragged.current = false
      return
    }
    selectToken(id)
  }

  return (
    <div className="stack">
      <div className="tokens" role="group" aria-label={tr('sort.cardsAria')}>
        {allPlaced ? (
          <p className="count-hint" style={{ margin: 0 }}>
            {submitted ? tr('sort.results') : tr('sort.allSorted')}
          </p>
        ) : (
          unplaced.map((t) => (
            <button
              key={t.id}
              className={`token token--draggable${selected === t.id ? ' token--selected' : ''}${
                drag?.id === t.id ? ' token--dragging' : ''
              }`}
              aria-pressed={selected === t.id}
              onPointerDown={(e) => onPointerDown(e, t.id)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={() => onClickToken(t.id)}
            >
              {t.label}
            </button>
          ))
        )}
      </div>

      <div className="buckets buckets--2">
        {data.buckets.map((bucket) => {
          const items = tokens.filter((t) => placement[t.id] === bucket.id)
          const over = drag?.over === bucket.id
          return (
            <div
              key={bucket.id}
              className={`bucket${over ? ' bucket--over' : ''}`}
              data-bucket-id={bucket.id}
            >
              <div className="bucket__title">{bucket.label}</div>
              <div className="bucket__items">
                {items.length === 0 && !selected && !drag && (
                  <span className="bucket__empty">{tr('sort.dropHere')}</span>
                )}
                {items.map((t) => {
                  const ok = t.bucket === bucket.id
                  const mark = submitted ? (ok ? ' option--correct' : ' option--wrong') : ''
                  return (
                    <button
                      key={t.id}
                      className={`token token--placed${mark}`}
                      onClick={() => removeToken(t.id)}
                      disabled={submitted}
                      aria-label={
                        submitted
                          ? `${t.label}: ${ok ? tr('sort.mark.correct') : tr('sort.mark.wrong')}`
                          : `${t.label}${tr('sort.removeSuffix')}`
                      }
                    >
                      {t.label}
                      {submitted &&
                        (ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />)}
                    </button>
                  )
                })}
                {selected && !submitted && (
                  <button className="btn btn--secondary" onClick={() => place(selected, bucket.id)}>
                    <CornerDownRight size={16} /> {tr('sort.placeHere')}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allPlaced || submitted}>
          {tr('act.checkAnswer')}
        </button>
      </div>

      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {labelOf(drag.id)}
        </div>
      )}
    </div>
  )
}
