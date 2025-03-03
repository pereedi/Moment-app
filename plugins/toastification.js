// filepath: /d:/STARTUP-INTERN/EventfulMoment-app/eventfulMoment-app/plugins/toastification.js
import { defineNuxtPlugin } from '#app'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast)
})