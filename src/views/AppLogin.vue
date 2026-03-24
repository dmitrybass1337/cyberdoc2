<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-4 text-center">Авторизация</h2>
    <form @submit.prevent="login" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="username" class="form-label">Логин</label>
        <input v-model="username" type="text" id="username" class="form-control" placeholder="Логин" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input v-model="password" type="password" id="password" class="form-control" placeholder="Пароль" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Войти</button>
    </form>
  </div>
</template>

<script>
import { authState } from '../auth.js'
export default {
  name: "AppLogin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Invalid token", e);
        return null;
      }
    },
async login() {
  try {
    const res = await fetch(`${this.$API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: this.username, password: this.password })
    });
    const data = await res.json();

    if (res.ok) {
      const decoded = this.parseJwt(data.token);
      // console.log('Decoded token:', decoded);

      if (decoded) {
        // Проверка блокировки
        if (decoded.blocked) {
          alert("Доступ запрещен: ваш аккаунт заблокирован.");
          // Очистка данных
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          
          authState.isAuthenticated = false;
          authState.userRole = null;
          authState.userName = null;
          return; // Выход из функции, чтобы не продолжать авторизацию
        }

        // Проверка подтверждения аккаунта
        if (!decoded.verified) {
          alert("Ваш аккаунт не подтвержден Администратором. Пожалуйста, подождите.");
          // Можно оставить пользователь авторизованным или нет, в зависимости от логики
          // В данном случае, можно не сохранять токен и не входить
          
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          
          authState.isAuthenticated = false;
          authState.userRole = null;
          authState.userName = null;
          return;
        }

        // Если все проверки прошли
        const role = decoded.role;
        const userName = this.username; // или из другого поля, например, decoded.name

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", userName);

        authState.isAuthenticated = true;
        authState.userRole = role;
        authState.userName = userName;

if (role === "admin") {
  this.$router.push("/dashboard/admin");
} else if (role === "expert") {
  this.$router.push("/dashboard/expert");
} else if (role === "user") {
  this.$router.push("/dashboard/user");
} else {
  this.$router.push("/");
}
      } else {
        alert("Ошибка декодирования токена");
      }
    } else {
      alert(data.error || "Ошибка авторизации");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      authState.isAuthenticated = false;
      authState.userRole = null;
      authState.userName = null;
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}
  }
};
</script>

// src/auth.js
import { reactive } from 'vue';

export const authState = reactive({
  isAuthenticated: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'), // 'admin' или 'user' или 'expert'
  userName: localStorage.getItem('userName') // имя пользователя
});


проблема такая что если срок действия токена авторизации закончился то пользователь всё равно остаётся в личном кабинете но апи не работает
надо сделать конроль сессии при её окончании