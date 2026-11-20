export default defineEventHandler((event) => {
  const query = getQuery(event)
  const planName = query.planName as string

  const plans = [
    {
      name: 'Starter - Annual',
      price: '$83.25',
      billedTotal: '$999.00',
      savings: '$189 in savings',
      color: '#4ade80',
      features: [
        { text: 'Primary user only', sub: '(extra team members for $35/month)' },
        { text: 'Save unlimited properties', sub: '' },
        { text: '10,000 exports', sub: '(additional exports at $0.02 each)' }
      ]
    },
    {
      name: 'Team - Annual',
      price: '$207.50',
      billedTotal: '$2,490.00',
      savings: '$498 in savings',
      color: '#38bdf8',
      features: [
        { text: 'Primary user + 2 free team members', sub: '(extra team members for $25/month)' },
        { text: 'Save unlimited properties', sub: '' },
        { text: '50,000 exports', sub: '(additional exports at $0.01 each)' }
      ]
    },
    {
      name: 'Business - Annual',
      price: '$457.50',
      billedTotal: '$5,490.00',
      savings: '$1,098 in savings',
      color: '#22d3ee',
      features: [
        { text: 'Primary user + 6 free team members', sub: '(extra team members for $20/month)' },
        { text: 'Save unlimited properties', sub: '' },
        { text: '100,000 exports', sub: '(additional exports at $0.01 each)' }
      ]
    }
  ]

  // Шукаємо план. Якщо не знайшли за точною назвою - повертаємо другий у списку
  const found = plans.find(p => p.name === planName)
  return found || plans[1]
})
