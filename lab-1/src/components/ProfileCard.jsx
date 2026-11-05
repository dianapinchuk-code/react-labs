import { useState } from 'react'

function ProfileCard({ name, group, technologies }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <p className="profile-card__eyebrow">Про мене</p>
      <h1>{name}</h1>
      <p className="profile-card__group">Група: {group}</p>

      <section aria-labelledby="technologies-heading">
        <h2 id="technologies-heading">Хочу опанувати</h2>
        <ul className="profile-card__technologies">
          {technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      <button
        className="profile-card__like"
        type="button"
        onClick={() => setLikes((count) => count + 1)}
      >
        Подобається
        <span
          className="profile-card__like-count"
          aria-label={`${likes} натискань`}
        >
          {likes}
        </span>
      </button>
    </article>
  )
}

export default ProfileCard
