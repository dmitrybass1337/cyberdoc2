<template>
  <div class="text-center mt-5">
    <!-- Логотип по центру -->
    <img src="../assets/logo.png" alt="Логотип" class="logo" />

    <h1>Добро пожаловать в КиберДок</h1>
    <p v-if="isAuthenticated">Вы вошли как: {{ userRole }}</p>
    <p v-else>Пожалуйста, войдите в систему</p>
  </div>
</template>

<script>
import { authState } from '../auth.js'

export default {
  name: 'MainHome',
  computed: {
    isAuthenticated() {
      return authState.isAuthenticated;
    },
    userRole() {
      return authState.userRole;
    }
  }
};
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto; /* Центрируем изображение */
  max-width: 200px; /* Можно ограничить размер логотипа */
  height: auto;
  /* Можно добавить дополнительные стили по необходимости */
}
</style>