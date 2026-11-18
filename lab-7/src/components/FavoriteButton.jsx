import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function FavoriteButton({ productId, name }) {
  const [isFavorite, setIsFavorite] = useLocalStorage(
    `favorite:${productId}`,
    false,
  )

  return (
    <button
      type="button"
      className="favorite-button"
      aria-pressed={isFavorite}
      aria-label={`До обраного: ${name}`}
      onClick={() => setIsFavorite((fav) => !fav)}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}
