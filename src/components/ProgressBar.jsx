/*
 * A thin, neutral progress bar. `value` / `max` are counts (e.g. lessons
 * complete). Accessible via role="progressbar".
 */
export default function ProgressBar({ value, max, label }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || `${value} of ${max} complete`}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
