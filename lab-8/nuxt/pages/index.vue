<template>
  <div class="page-bg">
    <div class="main-container">
      <div class="header-row">
        <h1>Start Your 3 Day Free Trial</h1>
        <div class="toggle-container">
          <span class="save-label">Save up to 20%</span>
          <div class="toggle-box">
            <button class="active">Annual</button>
            <button>Monthly</button>
          </div>
        </div>
      </div>

      <!-- картки -->
      <div class="pricing-grid">
        <div v-for="plan in plans" :key="plan.title" class="card" :style="{ borderTopColor: plan.color }">
          <div class="card-header">
            <h3>{{ plan.title }}</h3>
            <p class="sub-trial">3-days free then:</p>
            <div class="price-box">
              <span class="main-price">{{ plan.price }}</span>
              <span class="per-month">/month</span>
            </div>
            <p class="billed-info">
              billed yearly at <span class="old">{{ plan.oldPrice }}</span> <span class="new">{{ plan.newPrice }}</span>
            </p>
            <div class="savings-badge">{{ plan.savings }}</div>
          </div>

          <button class="orange-btn" @click="selectPlan(plan)">
            Try It Free
          </button>

          <ul class="feature-list">
            <li v-for="(feat, i) in plan.features" :key="i">
              <span class="plus-icon">+</span>
              <div class="text-group">
                <span class="feat-text">{{ typeof feat === 'string' ? feat : feat.text }}</span>
                <span v-if="feat.sub" class="feat-sub">{{ feat.sub }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-nav">
        <NuxtLink to="/table">
          <button class="table-link-btn">📊 Перейти до каталогу (Grid)</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSubscriptionStore } from '~/stores/subscription'

// Завантаження планів з API
const { data: plans } = await useFetch('/api/pricing')

// Підключаємо Pinia Store
const subscriptionStore = useSubscriptionStore()

// Функція вибору плану: зберігаємо і переходимо
function selectPlan(plan) {
  subscriptionStore.setPlan(plan)
  navigateTo('/checkout')
}

useSeoMeta({ title: 'Список продуктів' })
</script>

<style scoped>
.page-bg {
  background-color: #fcfcfc;
  min-height: 100vh;
  padding: 60px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-container {
  max-width: 1050px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 { font-size: 26px; font-weight: 700; color: #1e293b; }

.toggle-container { display: flex; align-items: center; gap: 10px; }
.save-label { color: #2ecc71; font-size: 11px; font-weight: bold; }
.toggle-box { background: #fff; border: 1px solid #eee; border-radius: 6px; padding: 2px; display: flex; }
.toggle-box button { border: none; background: none; padding: 4px 12px; font-size: 12px; cursor: pointer; }
.toggle-box button.active { background: #f0f0f0; border-radius: 4px; font-weight: bold; }

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  border-top: 6px solid transparent;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
}

.card-header { text-align: left; margin-bottom: 20px; }
h3 { font-size: 18px; margin-bottom: 12px; color: #333; }
.sub-trial { font-size: 11px; color: #aaa; margin-bottom: 4px; }

.price-box { display: flex; align-items: baseline; margin-bottom: 4px; }
.main-price { font-size: 36px; font-weight: 800; }
.per-month { color: #aaa; font-size: 12px; margin-left: 3px; }

.billed-info { font-size: 11px; color: #bbb; margin-bottom: 12px; }
.billed-info .old { text-decoration: line-through; }
.billed-info .new { font-weight: bold; color: #444; }

.savings-badge {
  display: inline-block;
  background: #f0fdf4;
  color: #16a34a;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #dcfce7;
}

.orange-btn {
  width: 100%;
  background: #ff9f0a;
  border: none;
  color: white;
  font-weight: 700;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 25px;
  transition: background 0.2s;
}
.orange-btn:hover { background: #e68a00; }

.feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.feature-list li { display: flex; align-items: flex-start; }
.plus-icon { color: #4ade80; font-weight: bold; font-size: 16px; margin-right: 10px; line-height: 1; }
.text-group { display: flex; flex-direction: column; line-height: 1.3; text-align: left; }
.feat-text { font-size: 12.5px; font-weight: 500; color: #555; }
.feat-sub { font-size: 10.5px; color: #aaa; margin-top: 1px; }

.footer-nav { margin-top: 40px; text-align: center; }
.table-link-btn {
  background: #fff; border: 1px solid #ddd; padding: 8px 16px;
  border-radius: 6px; cursor: pointer; color: #666; font-size: 13px;
}
</style>
