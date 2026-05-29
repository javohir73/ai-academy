import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'

/*
 * MatchGame — match each FEATURE (clue) on the left to its LABEL (answer) on
 * the right (level 4). Select a feature, then select a label to link them.
 * Linked pairs share a number badge. Select a feature again to re-link it.
 *
 * data = {
 *   leftHead, rightHead,
 *   pairs: [{ left, right }, ...]   // index i links to index i
 * }
 */
export default function MatchGame({ data, onResult }) {
  const n = data.pairs.length
  // Right column is shuffled; each entry remembers its original pair index.
  const rights = useMemo(
    () => shuffle(data.pairs.map((p, i) => ({ pairIndex: i, text: p.right }))),
    [data],
  )

  const [links, setLinks] = useState({}) // leftIndex -> pairIndex of chosen right
  const [activeLeft, setActiveLeft] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const allLinked = Object.keys(links).length === n

  function clickLeft(i) {
    if (submitted) return
    setActiveLeft((prev) => (prev === i ? null : i))
  }

  function clickRight(pairIndex) {
    if (submitted || activeLeft === null) return
    setLinks((prev) => {
      const next = {}
      // Keep other links, but free this right and re-point the active left.
      for (const [l, p] of Object.entries(prev)) {
        if (p !== pairIndex && Number(l) !== activeLeft) next[l] = p
      }
      next[activeLeft] = pairIndex
      return next
    })
    setActiveLeft(null)
  }

  function leftLinkedTo(pairIndex) {
    const entry = Object.entries(links).find(([, p]) => p === pairIndex)
    return entry ? Number(entry[0]) : null
  }

  function check() {
    if (!allLinked || submitted) return
    setSubmitted(true)
    onResult({ correct: data.pairs.every((_, i) => links[i] === i) })
  }

  function leftClass(i) {
    let cls = 'match-item'
    if (!submitted && activeLeft === i) cls += ' match-item--active'
    else if (links[i] !== undefined) cls += ' match-item--linked'
    if (submitted) cls += links[i] === i ? ' option--correct' : ' option--wrong'
    return cls
  }

  return (
    <div className="stack">
      <div className="match-grid">
        <div className="match-col">
          <div className="match-col__head">{data.leftHead}</div>
          {data.pairs.map((p, i) => (
            <button
              key={i}
              className={leftClass(i)}
              disabled={submitted}
              onClick={() => clickLeft(i)}
              aria-pressed={activeLeft === i}
            >
              <span>{p.left}</span>
              {submitted &&
                (links[i] === i ? (
                  <Check size={16} className="match-item__icon" aria-hidden="true" />
                ) : (
                  <X size={16} aria-hidden="true" />
                ))}
              {!submitted && links[i] !== undefined && (
                <span className="match-item__tag">{i + 1}</span>
              )}
            </button>
          ))}
        </div>

        <div className="match-col">
          <div className="match-col__head">{data.rightHead}</div>
          {rights.map((r) => {
            const linkedLeft = leftLinkedTo(r.pairIndex)
            const cls = `match-item ${linkedLeft !== null && !submitted ? 'match-item--linked' : ''}`
            return (
              <button
                key={r.pairIndex}
                className={cls}
                disabled={submitted || activeLeft === null}
                onClick={() => clickRight(r.pairIndex)}
              >
                <span>{r.text}</span>
                {linkedLeft !== null && !submitted && (
                  <span className="match-item__tag">{linkedLeft + 1}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p className="count-hint center">
        {activeLeft !== null
          ? `Now select the answer for “${data.pairs[activeLeft].left}”.`
          : 'Select a clue on the left to start a link.'}
      </p>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allLinked || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
