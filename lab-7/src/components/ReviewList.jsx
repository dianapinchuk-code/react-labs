import ShowMore from './ShowMore.jsx'

export default function ReviewList({ reviews }) {
  return (
    <section className="reviews">
      <h2 id="reviews-title">Відгуки</h2>
      <ShowMore items={reviews} step={3}>
        {(visibleReviews) => (
          <ul aria-labelledby="reviews-title" className="review-list">
            {visibleReviews.map((review) => (
              <li key={review.id} className="review-card">
                <h3>{review.author}</h3>
                <p className="rating">{'★'.repeat(review.rating)}</p>
                <p>{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </ShowMore>
    </section>
  )
}
