import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import GuestsStepper from './GuestsStepper.jsx'
import { describeBooking } from '../describeBooking.js'

const defaultValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

export default function BookingForm() {
  const [booking, setBooking] = useState(null)

  const { register, control, handleSubmit, reset, setFocus } = useForm({
    defaultValues,
  })

  const comment = useWatch({ control, name: 'comment' })

  function onValid(data) {
    setBooking(data)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    setFocus('name')
    reset()
    setBooking(null)
  }

  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit(onValid)}
      onKeyDown={handleKeyDown}
    >
      <label>
        Ім'я
        <input {...register('name')} autoComplete="name" required />
      </label>

      <label>
        Телефон
        <input
          {...register('phone')}
          type="tel"
          placeholder="+380XXXXXXXXX"
          autoComplete="tel"
          required
        />
      </label>

      <div className="row">
        <label>
          Дата
          <input {...register('date')} type="date" required />
        </label>
        <label>
          Час
          <input {...register('time')} type="time" required />
        </label>
      </div>

      <Controller
        name="guests"
        control={control}
        render={({ field }) => (
          <GuestsStepper value={field.value} onChange={field.onChange} />
        )}
      />

      <label>
        Коментар
        <textarea
          {...register('comment')}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {comment.length} / 200
      </p>

      <div className="actions">
        <button type="submit">Забронювати</button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>

      <p role="status" className="status">
        {booking && describeBooking(booking)}
      </p>
    </form>
  )
}
