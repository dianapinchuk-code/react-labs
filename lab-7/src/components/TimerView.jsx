import { formatTime } from '../formatTime.js'

export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p role="timer" className="time">
        {formatTime(secondsLeft)}
      </p>

      <div className="timer-controls">
        {status === 'running' ? (
          <button type="button" onClick={onPause}>
            Пауза
          </button>
        ) : status === 'paused' ? (
          <button type="button" onClick={onStart}>
            Продовжити
          </button>
        ) : status === 'done' ? (
          <button type="button" onClick={onReset}>
            Спочатку
          </button>
        ) : (
          <button type="button" onClick={onStart}>
            Старт
          </button>
        )}

        {(status === 'running' || status === 'paused') && (
          <button type="button" onClick={onReset}>
            Скинути
          </button>
        )}
      </div>

      <p role="status" className="timer-done">
        {status === 'done' ? 'Готово! Час пити каву.' : ''}
      </p>
    </article>
  )
}
