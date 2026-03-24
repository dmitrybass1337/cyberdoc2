<template>
<div class="jumbotron">
<nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-2 container-fluid">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">КиберДок</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Переключить навигацию">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" ref="navbarCollapse">
        <ul class="navbar-nav ms-auto">
          <!-- Неавторизованные -->
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login" @click.prevent="closeNavbar">Войти</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/register" @click.prevent="closeNavbar">Регистрация</router-link>
          </li>
          
          <!-- Авторизованные -->
          <li class="nav-item" v-if="isAuthenticated && userRole === 'admin'">
            <router-link class="nav-link" to="/dashboard/admin" @click.prevent="closeNavbar">Админ: {{ userName }}</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated && userRole === 'user'">
            <router-link class="nav-link" to="/dashboard/user" @click.prevent="closeNavbar">Пользователь: {{ userName }}</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated && userRole === 'expert'">
            <router-link class="nav-link" to="/dashboard/expert" @click.prevent="closeNavbar">Эксперт: {{ userName }}</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link" href="#"  data-bs-toggle="collapse" @click.prevent="logoutAndClose">Выйти</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
      </div>
</template>

<script>
import { authState } from '../auth.js'
import { Collapse } from 'bootstrap';
export default {
  name: 'AppNavbar',
  computed: {
    isAuthenticated() {
      return authState.isAuthenticated;
    },
    userRole() {
      return authState.userRole;
    },
    userName() {
      return authState.userName;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      authState.isAuthenticated = false;
      authState.userRole = null;
      authState.userName = null;
      this.$router.push("/");
    },
  handleResize() {
    const collapseEl = this.$refs.navbarCollapse;
    const bsCollapse = Collapse.getInstance(collapseEl);
    if (bsCollapse) {
      // Попытка сбросить состояние или обновить
      // Например, закрыть и открыть заново
      if (bsCollapse._isShown) {
        bsCollapse.hide();
        // Через мгновение можно снова показать
        setTimeout(() => {
          bsCollapse.show();
        }, 100);
      } else {
        // Или просто вызвать show
        bsCollapse.show();
      }
    }
  },
closeNavbar() {
  const collapseEl = this.$refs.navbarCollapse;
  if (!collapseEl) {
    console.warn('Элемент collapse не найден');
    return;
  }
  let bsCollapse = Collapse.getInstance(collapseEl);
  if (!bsCollapse) {
    bsCollapse = new Collapse(collapseEl);
  }
  if (bsCollapse._isShown) {
    bsCollapse.hide();
  }
},
    logoutAndClose() {
      this.logout();
      this.closeNavbar();
    }
  },
mounted() {
  window.addEventListener('resize', this.handleResize);
},
beforeUnmount() {
  window.removeEventListener('resize', this.handleResize);
},
};
</script>

<style>
.navbar {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  min-height: 38px !important;
}
</style>