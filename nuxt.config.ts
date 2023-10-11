// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  app: {
    baseURL: '/contentstack-slug-generator/',
  },

  css: ['~~/assets/custom.scss'],
})
