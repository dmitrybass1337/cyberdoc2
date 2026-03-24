// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainHome from '../views/MainHome.vue'
import AppLogin from '../views/AppLogin.vue'
import AppRegister from '@/views/AppRegister.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import ExpertDashboard from '../views/ExpertDashboard.vue'
import { authState, logout } from '../auth.js'
import { isTokenExpired } from '../utils/auth.js'

const routes = [
  { path: '/', component: MainHome },
  { path: '/login', component: AppLogin },
  { path: '/register', name: 'Register', component: AppRegister },
  { path: '/dashboard/admin', component: AdminDashboard },
  { path: '/dashboard/user', component: UserDashboard },
  { path: '/dashboard/expert', component: ExpertDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Глобальный перехватчик маршрутов
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    alert('Вас долго не было, с целью безопасности был совершён выход из системы. Для повторного входа необходимо авторизоваться.');
    logout(); // редиректит на /
    return;
  }

  if (token) {
    // Обновляем состояние
    authState.isAuthenticated = true;
    authState.userRole = localStorage.getItem('userRole');
    authState.userName = localStorage.getItem('userName');
  } else {
    const protectedRoutes = ['/dashboard/admin', '/dashboard/user', '/dashboard/expert'];
    if (protectedRoutes.includes(to.path)) {
      alert('Вас долго не было, с целью безопасности был совершён выход из системы. Для повторного входа необходимо авторизоваться.');
      router.push('/');
      return;
    }
  }
  next();
});

export default router;