import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router/index'
import { loadConfig, configProxy } from './config'

async function bootstrap() {
    await loadConfig()

    const app = createApp(App)
    app.use(router)
    app.config.globalProperties.$config = configProxy
    app.mount('#app')
}

bootstrap()
