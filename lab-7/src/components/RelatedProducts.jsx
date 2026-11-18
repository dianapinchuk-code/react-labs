import ShowMore from './ShowMore.jsx'
import FavoriteButton from './FavoriteButton.jsx'

export default function RelatedProducts({ products }) {
  return (
    <section className="related">
      <h2 id="related-title">Схожі товари</h2>
      <ShowMore items={products} step={4}>
        {(visibleProducts) => (
          <ul aria-labelledby="related-title" className="related-list">
            {visibleProducts.map((product) => (
              <li key={product.id} className="related-card">
                <h3>{product.name}</h3>
                <p>{product.notes}</p>
                <p className="price">{product.price} грн</p>
                <FavoriteButton productId={product.id} name={product.name} />
              </li>
            ))}
          </ul>
        )}
      </ShowMore>
    </section>
  )
}
