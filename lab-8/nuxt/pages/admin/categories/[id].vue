<template>
  <div class="admin-wrapper">
    <div class="container">

      <!-- Заголовок у твоєму фірмовому стилі Extra Bold -->
      <div class="header-section">
        <h1 class="page-title">
          Адмінка: <span class="accent">{{ isNew ? 'Нова категорія' : 'Редагування' }}</span>
        </h1>
        <button @click="navigateTo('/admin/categories')" class="btn-back">
          ← Назад до списку
        </button>
      </div>

      <!-- Головна картка -->
      <div class="main-card">
        <form @submit.prevent="onSubmit" class="modern-form">

          <div class="form-group">
            <label>Назва категорії</label>
            <input
              v-model="state.title"
              type="text"
              placeholder="Наприклад: Технології"
              class="custom-input"
              :class="{ 'input-error': errors.title }"
            />
            <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
          </div>

          <!-- Додав Slug, щоб не було рисок у таблиці -->
          <div class="form-group">
            <label>Slug (URL ідентифікатор)</label>
            <input
              v-model="state.slug"
              type="text"
              placeholder="it-tehnologii"
              class="custom-input slug-font"
            />
            <small class="hint">Якщо залишити порожнім, згенерується автоматично</small>
          </div>

          <div class="form-group">
            <label>Опис (необов'язково)</label>
            <textarea
              v-model="state.description"
              placeholder="Короткий опис категорії..."
              rows="5"
              class="custom-input custom-textarea"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="navigateTo('/admin/categories')" class="btn-cancel">
              Скасувати
            </button>
            <button type="submit" :disabled="loading" class="btn-submit">
              {{ loading ? 'Збереження...' : 'Зберегти категорію' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const route = useRoute()
const id = route.params.id
const isNew = id === 'new'
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Валідація
const schema = z.object({
  title: z.string().min(5, 'Назва має бути не менше 5 символів')
})

const state = reactive({
  title: '',
  slug: '',
  description: '',
  parent_id: 1
})

onMounted(async () => {
  if (!isNew) {
    try {
      const res: any = await $fetch(`http://127.0.0.1/api/admin/blog/categories/${id}`)
      Object.assign(state, res.data || res)
    } catch (e) {
      console.error("Не вдалося завантажити категорію")
    }
  }
})

const onSubmit = async () => {
  errors.value = {}
  loading.value = true

  // Валідація перед відправкою
  const validation = schema.safeParse(state)
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    loading.value = false
    return
  }

  const url = isNew ? 'http://127.0.0.1/api/admin/blog/categories' : `http://127.0.0.1/api/admin/blog/categories/${id}`
  const method = isNew ? 'POST' : 'PATCH'

  try {
    await $fetch(url, { method, body: state })
    navigateTo('/admin/categories')
  } catch (e: any) {
    if (e.data && e.data.errors) {
      alert("Помилка валідації Laravel: " + JSON.stringify(e.data.errors))
    } else {
      alert("Помилка сервера")
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* СТИЛІЗАЦІЯ ДЛЯ ІДЕНТИЧНОСТІ З СКРІНШОТОМ */

.admin-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 60px 20px;
  font-family: 'Inter', -apple-system, sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 800; /* Extra Bold як на фото */
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-title .accent {
  color: #4f46e5;
}

.btn-back {
  background: none;
  border: none;
  color: #6366f1;
  font-weight: 700;
  cursor: pointer;
}

.main-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04);
  padding: 40px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

/* Кастомні поля вводу, які точно будуть працювати */
.custom-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.2s;
  box-sizing: border-box;
  background-color: #ffffff;
}

.custom-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.custom-textarea {
  resize: vertical;
  min-height: 120px;
}

.slug-font {
  font-family: monospace;
  background-color: #fcfcfd;
}

.hint {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  font-weight: 600;
}

.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f1f5f9;
}

.btn-submit {
  background-color: #4f46e5;
  color: white;
  padding: 14px 40px;
  border-radius: 12px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

.btn-submit:hover {
  background-color: #4338ca;
}

.btn-submit:active {
  transform: scale(0.98);
}

.btn-cancel {
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 800;
  cursor: pointer;
}

.btn-cancel:hover {
  color: #64748b;
}
</style>
