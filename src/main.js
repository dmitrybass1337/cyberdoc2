import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Импорт Bootstrap и FontAwesome
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootswatch/dist/yeti/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// main.js или аналогичный файл
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Импорт для авторизации и прочее
import { authState } from './auth.js'
import { isTokenExpired } from './utils/auth.js'

// Проверка токена (оставьте как есть)
const token = localStorage.getItem('token');

if (token && isTokenExpired(token)) {
  /* alert('Вас долго не было, с целью безопасности был совершён выход из системы. Для повторного входа необходимо авторизоваться.');
  logout(); */
} else if (token) {
  authState.isAuthenticated = true;
  authState.userRole = localStorage.getItem('userRole');
  authState.userName = localStorage.getItem('userName');
}

// Создаем приложение
const app = createApp(App)

// Установка глобальных свойств
app.config.globalProperties.$API_URL = process.env.VUE_APP_API_URL || 'https://belmix.ru'

// Используем роутер
app.use(router)

app.mount('#app')