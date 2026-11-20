<template>
  <div class="admin-page">
    <div class="admin-container">

      <!-- Шапка: ідентично до Статей -->
      <div class="header-row">
        <h1 class="page-title">Адмінка: <span class="accent">Категорії</span></h1>
        <NuxtLink to="/admin/categories/new" class="add-link">
          + Нова категорія
        </NuxtLink>
      </div>

      <!-- Пошук: ідентично до Статей -->
      <div class="search-section">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Пошук категорії..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- Таблиця: ідентично до Статей -->
      <div class="card-table">
        <div v-if="pending" class="loader">Завантаження...</div>

        <table v-else class="main-table">
          <thead>
          <tr>
            <th style="width: 80px;">ID</th>
            <th>НАЗВА КАТЕГОРІЇ</th>
            <th style="width: 250px;">SLUG (URL)</th>
            <th class="text-center" style="width: 150px;">ДІЇ</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="table-row">
            <td class="id-text">{{ cat.id }}</td>
            <td class="title-text">{{ cat.title }}</td>
            <td class="slug-text">{{ cat.slug || '—' }}</td>
            <td class="actions-cell">
              <div class="btn-group">
                <!-- Кнопка Редагувати -->
                <button class="action-btn" @click="navigateTo('/admin/categories/' + cat.id)" title="Редагувати">
                  <span class="icon">✏️</span>
                </button>
                <!-- Кнопка Видалити -->
                <button class="action-btn delete" @click="deleteItem(cat.id)" title="Видалити">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="categories.length === 0 && !pending">
            <td colspan="4" class="empty-msg">Категорій не знайдено</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагінація -->
      <div v-if="totalItems > perPage" class="pagination-center">
        <UPagination
          v-model="page"
          :page-count="perPage"
          :total="totalItems"
          @update:model-value="load"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const categories = ref<any[]>([])
const page = ref(1)
const totalItems = ref(0)
const perPage = ref(25)
const searchQuery = ref('')
const pending = ref(false)
let debounceTimer: any = null

const load = async () => {
  pending.value = true
  try {
    const params = new URLSearchParams({
      page: page.value.toString(),
      search: searchQuery.value
    })
    const res: any = await $fetch(`http://127.0.0.1/api/admin/blog/categories?${params.toString()}`)
    categories.value = res.data || []
    if (res.meta) {
      totalItems.value = res.meta.total
      page.value = res.meta.current_page
    }
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
}

const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 400)
}

const deleteItem = async (id: number) => {
  if (!confirm('Видалити цю категорію?')) return
  await $fetch(`http://127.0.0.1/api/admin/blog/categories/${id}`, { method: 'DELETE' })
  load()
}

onMounted(() => load())
</script>

<style scoped>
/* УНІФІКОВАНІ СТИЛІ (ЯК У СТАТТЯХ) */

.admin-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', -apple-system, sans-serif; /* Тільки Sans-Serif шрифт */
}

.admin-container {
  max-width: 1100px;
  margin: 0 auto;
}

/* Шапка */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.page-title .accent {
  color: #4f46e5; /* Фіолетовий акцент як на фото */
}

.add-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.add-link:hover {
  text-decoration: underline;
}

/* Пошук */
.search-section {
  margin-bottom: 25px;
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #6366f1;
}

/* Таблиця */
.card-table {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
}

.main-table th {
  background: #f1f5f9;
  padding: 14px 16px;
  color: #64748b;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.main-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row:hover {
  background-color: #f8fafc;
}

.id-text {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
}

.title-text {
  color: #1e293b;
  font-weight: 700;
  font-size: 15px;
}

.slug-text {
  color: #94a3b8;
  font-family: monospace;
  font-size: 13px;
}

/* Кнопки дій */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.action-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.icon {
  font-size: 14px;
}

.pagination-center {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.empty-msg {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.text-center { text-align: center; }
</style>
