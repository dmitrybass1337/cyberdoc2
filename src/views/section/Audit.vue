<template>
<div class="jumbotron">
    <!-- Заголовок -->
    <!-- Основной контейнер -->
    <div
      id="SziFormContainer"
      style="
        margin: 0 auto;
        background: #fff;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        overflow-x: auto;"
    >
<p style="text-align: center; color: #008CBA; font-weight: bold;">АУДИТ ИНФОРМАЦИОННОЙ СИСТЕМЫ</p>
      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForCommission" @change="handleSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>
 
	<h4 style="text-align: center; color: #E8E8E8;">В РАЗРАБОТКЕ</h4>
     <h3 style="text-align: center; color: #59BBD8;">Это будет интересная реализация.</h3>
</div>
   </div>
</template>

<script>
export default {
  name: "Audit",
  data() {
    return {
      token: localStorage.getItem('token') || '',
      systems: [],
      selectedSystemId: null,
      apiUrl: '',
    }
  },
  // В реальном приложении можно получать данные через API или Vuex
methods: {
async handleSystemChange() {
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
},
async loadSystems() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();
    this.systems = data;

    const savedId = localStorage.getItem('selectedSystemId');

    // Если есть сохранённое значение и оно есть в списке систем
if (savedId && data.some(s => String(s.id) === savedId)) {
  this.selectedSystemId = savedId;
} else if (data.length > 0) {
  this.selectedSystemId = String(data[0].id);
}
this.$nextTick(() => {
  // Обновляем имя системы явно
  // хотя это не обязательно, так как computed обновится
});
  } catch (e) {
    console.error('Ошибка загрузки систем:', e);
  }
},
  },
computed: {
  selectedSystemName() {
    return this.getSystemName(this.selectedSystemId);
  }
},
async mounted() {
  this.apiUrl = this.$API_URL;
  await this.loadSystems(); // загрузка систем
  }
};
</script>
<style scoped>
h3 {
  margin-bottom: 20px;
}
</style>