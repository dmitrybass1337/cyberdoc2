<template>
<div class="jumbotron">
    <!-- Заголовок -->

    <!-- Основной контейнер -->

    <div
      id="ArmFormContainer"
      style="
        margin: 0 auto;
        background: #fff;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        overflow-x: auto;"
    >
<p style="text-align: center; color: #008CBA; font-weight: bold;">СЕТЕВОЕ ОБОРУДОВАНИЕ</p>  
<label for="selectInfoSysForNet" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForNet" @change="onSystemChange" class="form-select" style="margin-bottom: 5px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>
    <!-- Таблица -->
<div style="overflow-x: auto; width: 100%;" class="mt-1">
      <!-- Таблица с оборудованием -->
      <table id="netTable" class="table mt-1 table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
        <thead>
          <tr class="table-primary">
            <th style="text-align: center;">Тип оборудования</th>
            <th style="text-align: center;">Наименование оборудования</th>
            <th style="text-align: center;">Версия</th>
            <th style="text-align: center;">Действия</th>
          </tr>
        </thead>
        <tbody id="netTbody">
          <tr v-if="netEquipment.length === 0">
            <td colspan="4" class="text-center">Нет сетевого оборудования для выбранной системы</td>
          </tr>
          <tr v-for="item in netEquipment" :key="item.id">
            <td style="text-align: center;">{{ item.net_type }}</td>
            <td style="text-align: center;">{{ item.net_model }}</td>
            <td style="text-align: center;">{{ item.net_version }}</td>
            <td style="text-align: center;">
              <button @click="editNetEquipment(item.id)" class="btn btn-info"><i class="fa fa-pencil"></i></button>
              <button @click="deleteNetEquipment(item.id)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
</div>
      <!-- Форма добавления/редактирования -->
      <form v-if="showForm" @submit.prevent="saveNetEquipment" style="margin-top: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <label for="net_type" style="display: block; margin-bottom: 5px; font-weight: bold;">Тип оборудования</label>
        <select v-model="formData.net_type" required id="net_type" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
          <option v-for="type in netTypes" :key="type.value" :value="type.value">{{ type.value }}</option>
        </select>

        <label for="net_model" style="display: block; margin-top: 10px; margin-bottom: 5px; font-weight: bold;">Наименование</label>
        <input v-model="formData.net_model" type="text" id="net_model" placeholder="Наименование оборудования" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;" />

        <label for="net_version" style="display: block; margin-top: 10px; margin-bottom: 5px; font-weight: bold;">Версия</label>
        <input v-model="formData.net_version" type="text" id="net_version" placeholder="Версия" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;" />


        <div style="display: flex; justify-content: flex-end; margin-top: 20px; gap: 10px;">
          <button type="submit" style="background-color: #4CAF50; color: #fff; padding: 12px 24px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Сохранить</button>
          <button type="button" @click="cancelForm" style="background-color: #f44336; color: #fff; padding: 12px 24px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Отмена</button>
        </div>
      </form>

<!-- Кнопка добавления -->
<!-- Кнопка добавления -->
<div v-if="showAddNetButton && !showForm" id="netControls" class="d-flex justify-content-end align-items-center" style="margin-bottom: 10px;">
  <button @click="showAddForm" class="btn btn-primary">
    Добавить
  </button>
</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem('token') || '',
      systems: [], // список систем
      showAddNetButton: false, // по умолчанию скрывать
      selectedSystemId: null,
      netEquipment: [], // текущие сетевые оборудования
      netTypes: [], // список типов оборудования, полученных с сервера
      showForm: false,
      apiUrl: '',
      formData: {
        net_type: '',
        net_model: '',
		net_version: ''
      },
      currentEditingId: null,
      dictionaries: {} // для хранения справочников
    };
  },
  methods: {
    // Загрузка систем
async loadSystems() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();
    this.systems = data;

    const savedSystemId = localStorage.getItem('selectedSystemId');

    if (savedSystemId && data.some(s => String(s.id) === savedSystemId)) {
      this.selectedSystemId = savedSystemId;
    } else if (data.length > 0) {
      this.selectedSystemId = String(data[0].id);
    } else {
      this.selectedSystemId = null;
    }

    // После установки выбранной системы
    await this.loadNetEquipment();

    // Показывать кнопку, если есть системы
    this.showAddNetButton = data.length > 0;

  } catch (e) {
    console.error(e);
    this.showAddNetButton = false;
  }
},
    // Обработка смены системы
async onSystemChange() {
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  await this.loadNetEquipment();
  this.showForm = false; // скрываем форму при смене системы
},
    // Загрузка оборудования для выбранной системы
    async loadNetEquipment() {
      if (!this.selectedSystemId) return;
      try {
      const res = await fetch(`${this.apiUrl}/api/user/network-equipment?systemId=${this.selectedSystemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
        this.netEquipment = data;
console.log(this.netEquipment);
      } catch (e) {
        console.error('Ошибка загрузки сетевого оборудования:', e);
      }
    },
    // Загрузка справочников
async loadDictionaryValuesForUser(type) {
  try {
    const response = await fetch(`${this.apiUrl}/api/user/dictionaries/${type}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (!response.ok) {
      console.error(`Ошибка API: ${response.status}`);
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    this.dictionaries = { ...this.dictionaries, [type]: data };
    if (type === 'netType') {
      this.netTypes = data;
      // Если форма открыта для добавления, установите выбранное значение по умолчанию
      if (this.showForm && !this.formData.net_type && data.length > 0) {
        this.formData.net_type = data[0].value; // или data[0].value, если структура такова
      }
    }
  } catch (err) {
    console.error('Ошибка загрузки справочника:', err);
  }
},
    // Открытие формы для добавления
    async showAddForm() {
      this.showForm = true;
      this.currentEditingId = null;
      this.formData = { net_type: '', net_model: '', net_version: '' };
      await this.loadDictionaryValuesForUser('netType');
    },
    // Отмена формы
    cancelForm() {
      this.showForm = false;
      this.formData = { net_type: '', net_model: '', net_version: '' };
    },
    // Сохранение оборудования (создание или обновление)
    async saveNetEquipment() {
      const payload = {
        net_type: this.formData.net_type,
        net_model: this.formData.net_model,
		net_version: this.formData.net_version,
        systemId: this.selectedSystemId
      };
      try {
        if (this.currentEditingId) {
          // Обновление
          await fetch(`${this.apiUrl}/api/user/network-equipment/${this.currentEditingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
            body: JSON.stringify(payload)
          });
        } else {
          // Создание
          await fetch(`${this.apiUrl}/api/user/network-equipment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
            body: JSON.stringify(payload)
          });
        }
        await this.loadNetEquipment();
        this.cancelForm();
      } catch (e) {
        console.error('Ошибка при сохранении оборудования:', e);
      }
    },
    // Редактировать
    async editNetEquipment(id) {
      const item = this.netEquipment.find(i => i.id === id);
      if (item) {
        this.formData.net_type = item.net_type || '';
        this.formData.net_model = item.net_model || '';
        this.formData.net_version = item.net_version || '';
        this.currentEditingId = id;
        this.showForm = true;
        await this.loadDictionaryValuesForUser('netType');
      }
    },
    // Удалить
    async deleteNetEquipment(id) {
      if (confirm('Удалить это сетевое оборудование?')) {
        try {
          const response = await fetch(`${this.apiUrl}/api/user/network-equipment/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token }
          });
          if (response.ok) {
            await this.loadNetEquipment();
          } else {
            console.error('Ошибка при удалении:', response.status);
          }
        } catch (err) {
          console.error('Ошибка при удалении:', err);
        }
      }
    }
  },
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadSystems();
    this.loadDictionaryValuesForUser('netType');
  }
};
</script>
<style>
#netTable td, #netTable th {
  min-width: 30px !important; /* по необходимости */
}
#netTable thead tr {
  height: 30px !important;
}
#netTable tbody tr {
  height: 30px !important; /* если нужно оставить высоту тела */
}

</style>
