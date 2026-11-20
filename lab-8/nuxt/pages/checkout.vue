<script setup lang="ts">
import { ref, reactive, onMounted, computed, type Ref } from 'vue'
import { useSubscriptionStore } from '~/stores/subscription'
import { storeToRefs } from 'pinia'

// 1. Описуємо типи для TypeScript
interface Feature {
  text?: string
  sub?: string
}

interface SelectedPlan {
  name?: string
  title?: string
  price: string
  billedTotal: string
  newPrice?: string
  savings: string
  color: string
  features: (string | Feature)[]
}

interface CheckoutResponse {
  status: string
  message: string
}

// 2. Підключаємо Store та налаштовуємо типізацію plan
const subscriptionStore = useSubscriptionStore()
const { selectedPlan } = storeToRefs(subscriptionStore)

// Примусово вказуємо тип для plan, щоб IDE бачила і 'name', і 'title'
const plan = selectedPlan as Ref<SelectedPlan | null>

// Встановлюємо заголовок вкладки
useSeoMeta({ title: 'Checkout - Оплата підписки' })

// 3. Реактивні дані форми
const formData = reactive({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: 'dev4 dev4',
  address: '',
  consent: false
})

const isSubmitting = ref(false)

// 4. Функція відправки даних
async function handleCheckout() {
  if (!formData.consent) {
    alert('Погодьтеся з умовами!')
    return
  }

  if (!plan.value) {
    alert('Будь ласка, спочатку оберіть тарифний план!')
    return
  }

  // Отримуємо назву плану для відправки
  const currentPlanName = plan.value.name || plan.value.title || 'обраний план'

  isSubmitting.value = true
  try {
    const response = await $fetch<CheckoutResponse>('/api/subscription/create', {
      method: 'POST',
      body: {
        ...formData,
        planName: currentPlanName
      }
    })

    console.log('Дані плану:', plan.value)
    alert(`Успішно оплачено план: ${currentPlanName}`)
  } catch (e) {
    console.error(e)
    alert('Виникла помилка при оплаті')
  } finally {
    isSubmitting.value = false
  }
}

// Перевірка при монтуванні
onMounted(() => {
  if (!plan.value) {
    console.warn('План не знайдено у сторі')
  }
})
</script>
<template>
  <div class="checkout-page">
    <div class="header">Checkout</div>
    <div class="container">
      <NuxtLink to="/" class="back">&lt;&lt; back</NuxtLink>

      <div v-if="plan">
        <h1>You’re Almost In - Start Your 3-Day Free Trial Now!</h1>

        <div class="content">
          <div class="plan-card" :style="{ borderTopColor: plan.color }">
            <h3>{{ plan.name || plan.title }}</h3>
            <div class="price">
              <span class="big">{{ plan.price }}</span>
              <span class="month">/month</span>
            </div>
            <p class="billed">Billed yearly at {{ plan.billedTotal || plan.newPrice }}</p>
            <div class="saving-box">
              <span class="saving">{{ plan.savings }}</span>
            </div>

            <ul>
              <li v-for="(feat, i) in plan.features" :key="i">
                <div class="feat-wrapper">
                  <!-- Перевірка типу: якщо об'єкт - беремо text, якщо рядок - виводимо рядок -->
                  <span class="feat-main">{{ typeof feat === 'object' ? feat.text : feat }}</span>
                  <span v-if="typeof feat === 'object' && feat.sub" class="feat-sub">{{ feat.sub }}</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="summary-card">
            <h3>Order Summary</h3>
            <div class="row">
              <span>Annual Plan</span>
              <span>{{ plan.billedTotal || plan.newPrice }}</span>
            </div>
            <div class="row bold">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
            <div class="trial">Includes 3-Day Free Trial</div>

            <h4>Billing Information</h4>
            <div class="form-row">
              <input v-model="formData.cardNumber" placeholder="Card Number" style="flex:3" />
              <input v-model="formData.expiry" placeholder="MM/YY" style="flex:1" />
              <input v-model="formData.cvc" placeholder="CVC" style="flex:1" />
            </div>
            <input v-model="formData.fullName" class="full" placeholder="Full Name" />
            <input v-model="formData.address" class="full" placeholder="Address" />

            <label class="checkbox">
              <input v-model="formData.consent" type="checkbox" />
              <span>I consent to <a href="#" @click.prevent>Terms of Use</a> and understand my 3-day free trial will automatically convert...</span>
            </label>

            <button class="btn" @click="handleCheckout" :disabled="isSubmitting">
              {{ isSubmitting ? 'Processing...' : 'Try It Free' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <h2>План не обрано</h2>
        <p>Будь ласка, поверніться на головну сторінку та оберіть тариф.</p>
        <NuxtLink to="/"><button class="btn" style="width: auto; padding: 12px 40px; margin-top: 20px;">До планів</button></NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background: #f8f9fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 80px;
}
.header {
  background: #2d2d2d;
  color: white;
  text-align: center;
  padding: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.container {
  max-width: 1050px;
  margin: 0 auto;
  padding: 20px;
}
.back {
  color: #bbb;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 15px;
  display: inline-block;
}
.content {
  display: flex;
  gap: 35px;
  align-items: flex-start;
}
h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 10px 0 30px;
  color: #333;
}
.plan-card {
  background: white;
  padding: 35px;
  width: 38%;
  border-radius: 12px;
  border-top: 8px solid;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: left;
}
.big {
  font-size: 38px;
  font-weight: 900;
  color: #1a1a1a;
}
.month { color: #aaa; font-size: 14px; margin-left: 5px; }
.billed { font-size: 12px; color: #999; font-style: italic; margin-bottom: 10px; }

.saving-box { margin-bottom: 25px; }
.saving {
  display: inline-block;
  background: #f0fdf4;
  color: #16a34a;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #dcfce7;
}

.plan-card ul { list-style: none; padding: 0; border-top: 1px solid #f0f0f0; margin-top: 20px; padding-top: 20px; }
.plan-card li { margin-bottom: 16px; font-size: 13px; display: flex; align-items: flex-start; }
.plan-card li::before { content: "+"; color: #22c55e; font-weight: 900; margin-right: 12px; font-size: 18px; line-height: 1; }

.feat-wrapper { display: flex; flex-direction: column; line-height: 1.3; }
.feat-main { font-weight: 600; color: #444; }
.feat-sub { font-size: 10px; color: #aaa; margin-top: 2px; }

.summary-card {
  background: white;
  padding: 35px;
  flex: 1;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: left;
}
.row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #666; }
.bold { font-weight: 800; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; color: #111; }

.trial {
  background: #f3f4f6;
  padding: 12px;
  text-align: center;
  margin: 20px 0;
  border-radius: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

h4 { margin: 30px 0 15px; font-size: 16px; font-weight: 700; color: #374151; }
.form-row { display: flex; gap: 12px; margin-bottom: 12px; }
input { padding: 13px; border: 1px solid #e5e7eb; border-radius: 8px; width: 100%; outline: none; font-size: 14px; background: #fafafa; }
input:focus { border-color: #ffab00; background: #fff; }

.full { margin-bottom: 12px; }
.btn {
  width: 100%;
  padding: 16px;
  background: #ffab00;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
}
.btn:hover { background: #e69a00; }
.btn:disabled { background: #d1d5db; cursor: not-allowed; }

.checkbox { display: flex; gap: 12px; font-size: 11px; color: #9ca3af; margin: 20px 0 30px; align-items: flex-start; line-height: 1.4; }
.checkbox input { width: auto; margin-top: 2px; }
.empty-state { text-align: center; padding: 120px 20px; color: #6b7280; }
</style>
