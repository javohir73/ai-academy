/**
 * Return a new array with the items randomly reordered (Fisher–Yates).
 * Used so mini-games don't always present answers in the same spot.
 */
export function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
