// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  ssr: false,

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt','@pinia/nuxt'],

  // 2. Вимикаємо DevTools. Вони часто конфліктують із портами в Windows
  devtools: {
    enabled: false
  },

  // css: ['~/assets/css/main.css'],

  // 3. Тимчасово приберемо prerender, щоб не навантажувати сервер при старті
  routeRules: {
    // '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
