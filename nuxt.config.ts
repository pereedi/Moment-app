import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    
    build: {
      sourcemap: false, // Enable sourcemaps
    },
  },
  
  plugins: [
    { src: '~/plugins/notyf.js', mode: 'client' },
    '~/plugins/axios.js',
    
  ],
})
