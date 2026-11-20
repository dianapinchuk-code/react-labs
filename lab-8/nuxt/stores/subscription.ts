import { defineStore } from 'pinia'

// Описуємо, як виглядає наш план
interface Plan {
  name: string
  price: string
  billedTotal: string
  newPrice?: string
  oldPrice?: string
  savings: string
  color: string
  features: any[]
}

export const useSubscriptionStore = defineStore('subscription', () => {
  // Стан (State) — тут зберігається обраний план
  const selectedPlan = ref<Plan | null>(null)

  // Дія (Action) — функція для зміни плану
  function setPlan(plan: Plan) {
    selectedPlan.value = plan
  }

  return {
    selectedPlan,
    setPlan
  }
})
