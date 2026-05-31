/*
 * A thin progress bar. `value` / `max` are counts (e.g. lessons complete).
 * Accessible via role="progressbar".
 *
 * `tone` is presentational only: omit it for the default premium cool-gradient
 * fill, or pass a level slot (0..5) to tint the fill with that level's color.
 * Logic/markup are otherwise unchanged.
 */
export default function ProgressBar({ value, max, label, tone }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  const style = tone != null ? { '--bar-tone': `var(--lvl-${tone}-grad)` } : undefined
  return (
    <div
      className={`bar${tone != null ? ' bar--toned' : ''}`}
      style={style}
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
