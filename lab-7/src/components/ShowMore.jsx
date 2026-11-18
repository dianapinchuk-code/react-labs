import { useShowMore } from '../hooks/useShowMore.js'

export default function ShowMore({ items, step, children }) {
  const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(
    items,
    step,
  )

  const isExpanded = hiddenCount === 0
  const nextCount = Math.min(step, hiddenCount)

  return (
    <>
      {children(visibleItems)}
      {items.length > step && (
        <button type="button" onClick={isExpanded ? collapse : showMore}>
          {isExpanded ? 'Згорнути' : `Показати ще ${nextCount}`}
        </button>
      )}
    </>
  )
}
