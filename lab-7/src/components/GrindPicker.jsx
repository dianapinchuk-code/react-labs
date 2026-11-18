import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { grindOptions } from '../data.js'

export default function GrindPicker() {
  const [grind, setGrind] = useLocalStorage('grind', 'beans')

  return (
    <fieldset className="grind-picker">
      <legend>Помел</legend>
      <div className="grind-options">
        {grindOptions.map((option) => {
          const val = option.value ?? option.id
          return (
            <label key={val}>
              <input
                type="radio"
                name="grind"
                value={val}
                checked={grind === val}
                onChange={(e) => setGrind(e.target.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
