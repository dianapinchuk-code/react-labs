<template>
  <div class="view-wrapper">
    <!-- Верхня навігація -->
    <nav class="top-nav">
      <div class="container">
        <NuxtLink to="/admin/posts" class="back-admin-link">
          <span class="arrow">←</span> ПОВЕРНУТИСЯ ДО АДМІНКИ
        </NuxtLink>
      </div>
    </nav>

    <div class="container main-content">
      <div v-if="post">

        <!-- Мета-дані -->
        <div class="post-meta">
          <span class="category-badge">
            {{ post.category?.title || 'БЕЗ КАТЕГОРІЇ' }}
          </span>
          <span class="meta-divider">/</span>
          <span class="author-info">
            Автор: <strong>{{ post.user?.name || 'Невідомий' }}</strong>
          </span>
        </div>

        <!-- Заголовок у стилі твоєї адмінки -->
        <h1 class="post-title">{{ post.title }}</h1>

        <!-- Дата публікації -->
        <div class="post-date">
          <span class="icon">📅</span>
          Опубліковано: {{ post.published_at ? new Date(post.published_at).toLocaleDateString('uk-UA') : 'Чернетка' }}
        </div>

        <!-- Основна картка з текстом -->
        <div class="content-card">
          <div class="article-body">
            {{ post.content_raw }}
          </div>
        </div>

      </div>

      <!-- Стан завантаження -->
      <div v-else class="loading-state">
        <div class="spinner"></div>
        <p>Шукаємо статтю в базі даних...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Отримуємо дані
const { data: post } = await useFetch<any>(`http://127.0.0.1/api/blog/posts/${route.params.id}`, {
  server: false
})
</script>

<style scoped>
/* Головна обгортка */
.view-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1e293b;
  padding-bottom: 80px;
}

.container {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Навігація */
.top-nav {
  background: white;
  height: 64px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 50px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.back-admin-link {
  text-decoration: none;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.back-admin-link:hover {
  color: #3730a3;
}

.back-admin-link .arrow {
  margin-right: 5px;
  font-size: 16px;
}

/* Мета-дані */
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.category-badge {
  background-color: #1e293b;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.meta-divider {
  color: #cbd5e1;
}

.author-info {
  color: #64748b;
  font-size: 14px;
}

.author-info strong {
  color: #1e293b;
}

/* Заголовок (той самий стиль, що й в адмінці) */
.post-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
  margin: 0 0 15px 0;
  letter-spacing: -0.03em;
}

.post-date {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Картка контенту */
.content-card {
  background: white;
  border-radius: 20px;
  padding: 50px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.article-body {
  font-size: 18px;
  line-height: 1.7;
  color: #334155;
  white-space: pre-line; /* Зберігає переноси рядків */
}

/* Стан завантаження */
.loading-state {
  text-align: center;
  padding: 100px 0;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивність */
@media (max-width: 640px) {
  .post-title { font-size: 32px; }
  .content-card { padding: 30px; }
}
</style>
