import { useState } from 'react'

export function useShowMore(items, step) {
  const [visibleCount, setVisibleCount] = useState(step)

  const visibleItems = items.slice(0, visibleCount)
  const hiddenCount = Math.max(0, items.length - visibleCount)

  function showMore() {
    setVisibleCount((prev) => Math.min(items.length, prev + step))
  }

  function collapse() {
    setVisibleCount(step)
  }

  return { visibleItems, hiddenCount, showMore, collapse }
}
