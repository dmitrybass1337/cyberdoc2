<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-4 text-center">Регистрация</h2>
    <form @submit.prevent="register" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="registerUsername" class="form-label">Логин</label>
        <input v-model="username" type="text" id="registerUsername" class="form-control" placeholder="Логин" required />
      </div>
      <div class="mb-3">
        <label for="registerEmail" class="form-label">Email</label>
        <input v-model="email" type="email" id="registerEmail" class="form-control" placeholder="Email" required />
      </div>
      <div class="mb-3">
        <label for="registerPassword" class="form-label">Пароль</label>
        <input v-model="password" type="password" id="registerPassword" class="form-control" placeholder="Пароль" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AppRegister',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      apiUrl: ''
    };
  },
  
  methods: {
async register() {
  try {
    const res = await fetch(`${this.apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        email: this.email,
        password: this.password
      })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Регистрация прошла успешно');
      this.$router.push('/login'); // перенаправление на страницу входа
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    alert('Произошла ошибка. Попробуйте позже.');
  }
}
  },
  mounted() {
    this.apiUrl = this.$API_URL;
  },
}
</script>