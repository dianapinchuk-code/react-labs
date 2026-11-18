import { useState } from 'react'

export default function ShowMore({ items, step, children }) {
  const [visibleCount, setVisibleCount] = useState(step)

  const visibleItems = items.slice(0, visibleCount)
  const hiddenCount = Math.max(0, items.length - visibleCount)
  const isExpanded = visibleCount >= items.length

  function handleToggle() {
    if (isExpanded) {
      setVisibleCount(step)
    } else {
      setVisibleCount((prev) => Math.min(items.length, prev + step))
    }
  }

  const nextCount = Math.min(step, hiddenCount)

  return (
    <>
      {children(visibleItems)}
      {items.length > step && (
        <button type="button" onClick={handleToggle}>
          {isExpanded ? 'Згорнути' : `Показати ще ${nextCount}`}
        </button>
      )}
    </>
  )
}
