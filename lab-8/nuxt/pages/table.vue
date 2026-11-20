<script setup lang="ts">
//  Встановлюємо заголовок
useSeoMeta({ title: 'Каталог товарів' })
//сортування
const search = ref('')
const sortBy = ref('title')
const sortDir = ref('asc')

// Завантаження товарів
const { data: productsData, pending } = await useFetch<any>('https://dummyjson.com/products?limit=100')
const products = computed(() => productsData.value?.products || [])

//  Логіка: Пошук + Сортування
const filteredAndSorted = computed(() => {
  let result = [...products.value]

  // Пошук
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter((p: any) => p.title.toLowerCase().includes(s))
  }

  // Сортування
  result.sort((a: any, b: any) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    if (aVal < bVal) return sortDir.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// Функція для зміни сортування
const toggleSort = (column: string) => {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDir.value = 'asc'
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="top-bar">
      <NuxtLink to="/"><button class="back">← Назад</button></NuxtLink>


      <div class="sort-panel">
        <span>Сортувати:</span>
        <button @click="toggleSort('title')" :class="{active: sortBy === 'title'}">Назва</button>
        <button @click="toggleSort('price')" :class="{active: sortBy === 'price'}">Ціна</button>
        <button @click="toggleSort('rating')" :class="{active: sortBy === 'rating'}">Оцінка</button>
      </div>

      <input v-model="search" type="text" placeholder="Пошук..." class="search" />
    </div>

    <h1>Каталог товарів</h1>
    <p class="count">{{ filteredAndSorted.length }} позицій завантажено</p>

    <div v-if="pending" class="loading">Завантаження 100 товарів...</div>

    <div v-else class="grid">
      <div class="card" v-for="item in filteredAndSorted" :key="item.id">
        <div class="img-container">
          <img :src="item.thumbnail" alt="" />
        </div>

        <div class="info">
          <h3>{{ item.title }}</h3>
          <p class="desc">{{ item.description }}</p>

          <div class="meta">
            <span class="price">${{ item.price }}</span>
            <!-- Пункт 3: Колір оцінки -->
            <span class="rating" :style="{ color: item.rating < 4.5 ? '#ff4d4f' : '#52c41a' }">
              ⭐ {{ item.rating }}
            </span>
          </div>

          <div class="tags">
            <span>{{ item.brand }}</span>
            <span>{{ item.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 30px;
  background: #f5f7fb;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sort-panel {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-panel button {
  background: #f0f2f5;
  border: 1px solid #ddd;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.sort-panel button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.back {
  background: #e5e7eb;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.search {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
}

h1 { text-align: center; margin-bottom: 5px; }
.count { text-align: center; color: gray; margin-bottom: 20px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  transition: 0.3s;
}

.card:hover { transform: translateY(-6px); }

.img-container {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}

img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.info { padding: 15px; }
h3 { margin: 0 0 8px; font-size: 16px; }

.desc {
  font-size: 12px;
  color: #666;
  height: 32px;
  overflow: hidden;
  margin-bottom: 10px;
}

.meta { display: flex; justify-content: space-between; margin-top: 10px; }
.price { font-weight: bold; color: #111; }
.rating { font-weight: bold; }

.tags { margin-top: 10px; }
.tags span {
  background: #eef2ff;
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  margin-right: 5px;
}

.loading { text-align: center; font-size: 20px; padding: 50px; }
</style>
