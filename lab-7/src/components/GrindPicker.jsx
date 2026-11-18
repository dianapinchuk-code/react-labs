import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { grindOptions } from '../data.js'

export default function GrindPicker() {
  const [grind, setGrind] = useLocalStorage('grind', 'beans')

  return (
    <fieldset className="grind-picker">
      <legend>Помел</legend>
      <div className="grind-options">
        {grindOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="grind"
              value={option.id}
              checked={grind === option.id}
              onChange={(e) => setGrind(e.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
