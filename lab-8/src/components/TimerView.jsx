import Button from './Button.jsx'
import { withAnalytics } from '../hoc/withAnalytics.jsx'
import { formatTime } from '../formatTime.js'

const ActionButton = withAnalytics(Button, 'timer_control')

export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  let action = 'start'
  let label = 'Старт'
  let onClick = onStart

  if (status === 'running') {
    action = 'pause'
    label = 'Пауза'
    onClick = onPause
  } else if (status === 'paused') {
    action = 'resume'
    label = 'Продовжити'
    onClick = onStart
  } else if (status === 'done') {
    action = 'restart'
    label = 'Спочатку'
    onClick = onReset
  }

  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p role="timer" className="time">
        {formatTime(secondsLeft)}
      </p>

      <div className="timer-controls">
        <ActionButton
          analyticsData={{ method: method.id, action }}
          onClick={onClick}
        >
          {label}
        </ActionButton>

        {(status === 'running' || status === 'paused') && (
          <Button onClick={onReset}>Скинути</Button>
        )}
      </div>

      <p role="status" className="timer-done">
        {status === 'done' ? 'Готово! Час пити каву.' : ''}
      </p>
    </article>
  )
}
