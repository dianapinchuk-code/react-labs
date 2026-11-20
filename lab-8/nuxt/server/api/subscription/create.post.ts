export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Отримані дані підписки:', body)

  return {
    status: 'success',
    message: 'Subscription created successfully!'
  }
})
