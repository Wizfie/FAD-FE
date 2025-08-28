import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Setup Pinia store sebelum digunakan
const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()

app.mount('#app')
