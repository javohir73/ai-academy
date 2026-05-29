import { Star } from 'lucide-react'

/*
 * Renders a 1-3 star rating using Lucide Star icons (filled = earned).
 * Used in the sidebar, the module list, and the feedback banner.
 */
export default function Stars({ value, size = 15, total = 3 }) {
  return (
    <span className="stars" aria-label={`${value} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < value
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={2}
            fill={filled ? 'currentColor' : 'none'}
            color={filled ? 'var(--star)' : 'var(--star-empty)'}
            aria-hidden="true"
          />
        )
      })}
    </span>
  )
}
