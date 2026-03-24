// src/auth.js
import router from './router';
import { reactive } from 'vue'; // <-- добавьте этот импорт

export const authState = reactive({
  isAuthenticated: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'), // 'admin', 'user', 'expert'
  userName: localStorage.getItem('userName') // имя пользователя
});

export function logout(redirectUrl = '/') {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  authState.isAuthenticated = false;
  authState.userRole = null;
  authState.userName = null;
  // Перенаправление
  router.push(redirectUrl);
}