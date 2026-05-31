import { Star } from 'lucide-react'

/*
 * Renders a 1-3 star rating using Lucide Star icons (filled = earned).
 * Used in the sidebar, the module list, and the feedback banner.
 *
 * Each star is wrapped in a span carrying its earned state + index so earned
 * stars can get a staggered pop/shine purely in CSS (reduced-motion safe — the
 * universal prefers-reduced-motion rule neutralizes the animation). Markup is
 * presentational; the value/total contract is unchanged.
 */
export default function Stars({ value, size = 15, total = 3 }) {
  return (
    <span className="stars" aria-label={`${value} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < value
        return (
          <span
            key={i}
            className="star"
            data-filled={filled ? 'true' : 'false'}
            style={{ '--star-i': i }}
            aria-hidden="true"
          >
            <Star
              size={size}
              strokeWidth={2}
              fill={filled ? 'currentColor' : 'none'}
              color={filled ? 'var(--star)' : 'var(--star-empty)'}
            />
          </span>
        )
      })}
    </span>
  )
}
