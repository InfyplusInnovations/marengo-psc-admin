// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        public: {
          baseURL: process.env.NUXT_API_URL || 'https://api.example.com/',
        },
      },
    build: {
        transpile:
        process.env.NODE_ENV === 'production'
            ? [
                'naive-ui',
                'vueuc',
                '@css-render/vue3-ssr',
                '@juggle/resize-observer', '@ckeditor/ckeditor5-vue','@ckeditor/ckeditor5-build-classic'
            ]
            : ['@juggle/resize-observer']
    },
modules:[
    '@pinia/nuxt','@unocss/nuxt','@vueuse/nuxt','@nuxtjs/supabase'
]
,  vite: {
    optimizeDeps: {
        include:
            process.env.NODE_ENV === 'development'
                ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
                : []
    },
},
})
