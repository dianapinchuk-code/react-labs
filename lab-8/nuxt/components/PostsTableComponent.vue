<template>
  <div class="container">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-4 mb-4">
          <a href="/admin/blog/posts/create" class="">Додати</a>
        </nav>
        <div class="card shadow-md">
          <div class="card-body">
            <table class="table table-auto w-full">
              <thead>
              <tr>
                <th class="border p-2">#</th>
                <th class="border p-2">Автор</th>
                <th class="border p-2">Категорія</th>
                <th class="border p-2">Заголовок</th>
                <th class="border p-2">Дата публікації</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td class="border p-2">{{ post.id }}</td>
                <td class="border p-2">{{ post.user?.name || 'Анонім' }}</td>
                <td class="border p-2">{{ post.category?.title || 'Без категорії' }}</td>
                <td class="border p-2">
                  <NuxtLink :to="'/posts/' + post.id" class="text-blue-600 hover:underline">
                    {{ post.title }}
                  </NuxtLink>                </td>
                <td class="border p-2">{{ post.published_at }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const posts = ref<any[]>([]);

const getPosts = () => {
  $fetch('http://127.0.0.1/api/blog/posts')
    .then((response: any) => {
      console.log(response);

      posts.value = response;
    })
    .catch(error => {
      console.error("Помилка:", error);
    });
};

getPosts();
</script>
