import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
const pinia = createPinia()

createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')
pinia.use(piniaPluginPersistedstate)