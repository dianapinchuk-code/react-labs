<template>
  <div class="admin-wrapper">
    <div class="container">

      <!-- Шапка -->
      <div class="header-row">
        <h1 class="page-title">Адмінка: Статті</h1>
        <UButton to="/admin/posts/new" color="primary" icon="i-heroicons-plus" class="btn-add">
          Додати статтю
        </UButton>
      </div>

      <!-- ПАНЕЛЬ ПОШУКУ -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Пошук за заголовком..."
            class="search-field"
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- ТАБЛИЦЯ -->
      <div class="admin-card">
        <table class="admin-table">
          <thead>
          <tr>
            <th style="width: 80px;">ID</th>
            <th>Автор</th>
            <th>Заголовок</th>
            <th class="text-center" style="width: 200px;">Дії</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in posts" :key="post.id" class="table-row">
            <td class="id-cell">{{ post.id }}</td>
            <td class="author-cell">{{ post.user?.name || 'Анонім' }}</td>
            <td class="title-cell">{{ post.title }}</td>
            <td class="actions-cell">
              <div class="action-group">
                <UButton
                  icon="i-heroicons-eye"
                  size="xs"
                  variant="soft"
                  color="neutral"
                  title="Дивитись на сайті"
                  @click="navigateTo('/post/' + post.id)"
                />
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="xs"
                  variant="soft"
                  color="primary"
                  @click="navigateTo('/admin/posts/' + post.id)"
                />
                <UButton
                  icon="i-heroicons-trash"
                  size="xs"
                  variant="soft"
                  color="error"
                  @click="deletePost(post.id)"
                />
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="posts.length === 0" class="empty-state">
          Статей не знайдено...
        </div>
      </div>

      <!-- ПАГІНАЦІЯ -->
      <div v-if="totalPages > 1" class="pagination">
        <UButton
          icon="i-heroicons-chevron-left"
          color="neutral"
          variant="outline"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        />
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <UButton
          icon="i-heroicons-chevron-right"
          color="neutral"
          variant="outline"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const posts = ref<any[]>([])
const page = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
let debounceTimer: any = null

const load = async () => {
  try {
    // Додаємо параметр search до запиту
    const url = `http://127.0.0.1/api/admin/blog/posts?page=${page.value}&search=${searchQuery.value}`
    const res: any = await $fetch(url)

    posts.value = res.data || []

    if (res.meta) {
      totalPages.value = res.meta.last_page
      page.value = res.meta.current_page
    }
  } catch (e) {
    console.error("Помилка завантаження списку")
  }
}

// Функція для пошуку з затримкою (debounce)
const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1 // При пошуку завжди повертаємось на 1 сторінку
    load()
  }, 500) // затримка 0.5 сек
}

const changePage = (p: number) => {
  if (p > 0 && p <= totalPages.value) {
    page.value = p
    load()
  }
}

const deletePost = async (id: number) => {
  if (!confirm(`Ви дійсно хочете видалити статтю #${id}?`)) return
  try {
    await $fetch(`http://127.0.0.1/api/admin/blog/posts/${id}`, { method: 'DELETE' })
    await load()
  } catch (e) {
    alert('Помилка видалення.')
  }
}

onMounted(() => {
  load()
})
</script>

<style scoped>
/* Твій "масивний" стиль */
.page-title {
  font-size: 32px;
  font-weight: 800; /* Extra Bold */
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.02em;
}

.admin-wrapper {
  padding: 40px 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

/* СТИЛЬ ПОШУКУ */
.search-bar {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.5;
}

.search-field {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 15px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.search-field:focus {
  border-color: #1e293b;
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.05);
}

/* ТАБЛИЦЯ */
.admin-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: #f1f5f9;
  padding: 16px;
  color: #64748b;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
}

.admin-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
  background-color: #f8fafc;
}

.id-cell {
  color: #94a3b8;
  font-family: monospace;
  font-weight: 600;
}

.author-cell {
  color: #475569;
  font-weight: 500;
}

.title-cell {
  color: #1e293b;
  font-weight: 700; /* Робимо заголовки в таблиці теж жирнішими */
}

.action-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-style: italic;
}

/* ПАГІНАЦІЯ */
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.page-info {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  background: white;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.text-center { text-align: center; }
</style>
