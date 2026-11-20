<template>
  <div class="admin-wrapper">
    <div class="container">

      <!-- Заголовок точно як на фото -->
      <div class="header-section">
        <h1 class="page-title">
          Адмінка: {{ id === 'new' ? 'Створення статті' : 'Редагування статті' }}
        </h1>
        <button @click="navigateTo('/admin/posts')" class="btn-back">
          ← Назад до списку
        </button>
      </div>

      <!-- Картка форми -->
      <div class="main-card">
        <form @submit.prevent="handleSubmit">

          <div class="field-group">
            <label>Заголовок статті</label>
            <input
              v-model="state.title"
              type="text"
              class="form-input"
              :class="{ 'border-error': errors.title }"
              placeholder="Введіть назву статті..."
            />
            <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
          </div>

          <div class="field-group">
            <label>Текст статті</label>
            <textarea
              v-model="state.content_raw"
              rows="12"
              class="form-input textarea"
              :class="{ 'border-error': errors.content_raw }"
              placeholder="Основний зміст..."
            ></textarea>
            <span v-if="errors.content_raw" class="error-msg">{{ errors.content_raw }}</span>
          </div>

          <div class="form-grid">
            <div class="field-group">
              <label>Категорія ID</label>
              <input v-model.number="state.category_id" type="number" class="form-input" />
            </div>
            <div class="field-group">
              <label>Статус публікації</label>
              <select v-model.number="state.is_published" class="form-input select-custom">
                <option :value="1">Опубліковано</option>
                <option :value="0">Чернетка</option>
              </select>
            </div>
          </div>

          <div class="footer-actions">
            <button type="button" @click="navigateTo('/admin/posts')" class="btn-text">
              Скасувати
            </button>
            <button type="submit" :disabled="loading" class="btn-save">
              {{ loading ? 'Збереження...' : 'Зберегти зміни' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { z } from 'zod'

const route = useRoute()
const id = route.params.id
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const schema = z.object({
  title: z.string().min(5, 'Заголовок занадто короткий'),
  content_raw: z.string().min(10, 'Текст статті занадто короткий'),
  category_id: z.number().min(1, 'Виберіть категорію')
})

const state = reactive({
  title: '',
  content_raw: '',
  category_id: 1,
  is_published: 1
})

onMounted(async () => {
  if (id !== 'new') {
    try {
      const res: any = await $fetch(`http://127.0.0.1/api/admin/blog/posts/${id}`)
      const data = res.data || res
      state.title = data.title
      state.content_raw = data.content_raw || data.content_html
      state.category_id = data.category_id
      state.is_published = data.is_published ? 1 : 0
    } catch (e) {
      console.error("Помилка завантаження")
    }
  }
})

const handleSubmit = async () => {
  errors.value = {}
  const validation = schema.safeParse(state)
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  const url = id === 'new' ? 'http://127.0.0.1/api/admin/blog/posts' : `http://127.0.0.1/api/admin/blog/posts/${id}`
  const method = id === 'new' ? 'POST' : 'PATCH'

  try {
    await $fetch(url, { method, body: state })
    navigateTo('/admin/posts')
  } catch (e) {
    alert('Помилка сервера')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Стиль заголовка як на скріншоті */
.page-title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 30px;
  font-weight: 800; /* Extra Bold */
  color: #1e293b;   /* Темно-синій сланець */
  letter-spacing: -0.02em;
  margin: 0;
}

.admin-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 50px 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.btn-back {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
}

.btn-back:hover {
  color: #1e293b;
  text-decoration: underline;
}

.main-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 40px;
}

.field-group {
  margin-bottom: 25px;
}

.field-group label {
  display: block;
  font-weight: 700;
  font-size: 14px;
  color: #475569;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  color: #1e293b;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1e293b;
}

.textarea {
  min-height: 250px;
  resize: vertical;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.border-error {
  border-color: #ef4444;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f1f5f9;
}

.btn-save {
  background-color: #1e293b;
  color: white;
  padding: 14px 40px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-save:hover {
  opacity: 0.9;
}

.btn-save:disabled {
  background-color: #94a3b8;
}

.btn-text {
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 700;
  cursor: pointer;
}

.select-custom {
  background-color: white;
}
</style>
