import { useShowMore } from '../../../shared/hooks/index.js'

export default function ReviewList({ reviews }) {
  const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(
    reviews,
    3,
  )

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Відгуки ({reviews.length})</h2>
      <ul className="review-list">
        {visibleItems.map((review) => (
          <li key={review.id}>
            <p className="review-author">
              {review.author}{' '}
              <span aria-label={`Оцінка ${review.rating} з 5`}>
                {'★'.repeat(review.rating)}
              </span>
            </p>
            <p>{review.text}</p>
          </li>
        ))}
      </ul>
      {reviews.length > 3 && (
        <button
          type="button"
          className="show-more"
          onClick={hiddenCount > 0 ? showMore : collapse}
        >
          {hiddenCount > 0
            ? `Показати ще ${Math.min(3, hiddenCount)}`
            : 'Згорнути'}
        </button>
      )}
    </section>
  )
}
