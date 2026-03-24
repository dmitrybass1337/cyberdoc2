// src/utils/auth.js
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp; // UNIX timestamp
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    console.error('Ошибка при проверке срока токена:', e);
    return true; // считаем просроченным при ошибке
  }
}