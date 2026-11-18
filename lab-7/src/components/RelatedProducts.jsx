import { useShowMore } from '../hooks/useShowMore.js'
import FavoriteButton from './FavoriteButton.jsx'

export default function RelatedProducts({ products }) {
  const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(
    products,
    4,
  )

  const isExpanded = hiddenCount === 0
  const nextCount = Math.min(4, hiddenCount)

  return (
    <section className="related">
      <h2 id="related-title">Схожі товари</h2>
      <ul aria-labelledby="related-title" className="related-list">
        {visibleItems.map((product) => (
          <li key={product.id} className="related-card">
            <h3>{product.name}</h3>
            <p>{product.notes}</p>
            <p className="price">{product.price} грн</p>
            <FavoriteButton productId={product.id} name={product.name} />
          </li>
        ))}
        {products.length > 4 && (
          <li className="related-more">
            <button type="button" onClick={isExpanded ? collapse : showMore}>
              {isExpanded ? 'Згорнути' : `Показати ще ${nextCount}`}
            </button>
          </li>
        )}
      </ul>
    </section>
  )
}
