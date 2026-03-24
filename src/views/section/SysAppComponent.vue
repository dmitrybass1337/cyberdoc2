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
<p style="text-align: center; color: #008CBA; font-weight: bold;">СИСТЕМНОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ</p>
	
      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForSysSoftware" @change="onSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name || 'Без названия' }}
        </option>
      </select>

    <!-- Таблица системного ПО -->
    <table id="sysappTable" class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
      <thead>
        <tr class="table-primary">
          <th>Название ПО</th>
          <th>Архитектура</th>
          <th>Серт. ФСТЭК</th>
          <th>Производитель</th>
          <th>Версия</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in systemSoftware" :key="item.id">
          <td>{{ item.os_name }}</td>
          <td>{{ item.architecture }}</td>
          <td>{{ item.certification }}</td>
          <td>{{ item.manufacturer }}</td>
          <td>{{ item.supplier }}</td>
          <td>
            <button @click="editSystemSoftware(item.id)" class="btn btn-info"><i class="fa fa-pencil"></i></button>
            <button @click="deleteSystemSoftware(item.id)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
        <tr v-if="systemSoftware.length === 0">
          <td colspan="6" style="text-align:center;">Нет системного ПО для выбранной системы</td>
        </tr>
      </tbody>
    </table>

    <!-- Форма добавления/редактирования -->
    <div v-if="showForm" style="margin-top:20px; border:1px solid #ccc; padding:20px; border-radius:8px;">
      <h5>{{ currentSystemSoftwareId ? 'Редактировать' : 'Добавить' }} системное ПО: <span class="text-success">{{ getSystemName(selectedSystemId) }}</span></h5>
      <form @submit.prevent="saveSystemSoftware">
        <div style="margin-bottom:10px;">
          <label for="os_name" style="color: #008CBA; font-weight: bold;">Название ПО</label><br />
          <input v-model="form.os_name" type="text" id="os_name" placeholder="Введите название ПО" required style="width:100%; padding:5px;"/>
        </div>

        <div style="margin-bottom:10px;">
          <label for="architecture" style="color: #008CBA; font-weight: bold;">Архитектура</label><br />
          <select v-model="form.architecture" id="architecture" required style="width:100%; padding:5px;">
            <option v-for="item in dictionaries.typeArch" :key="item.value" :value="item.value">{{ item.value }}</option>
          </select>
        </div>

        <div style="margin-bottom:10px;">
          <label for="certification" style="color: #008CBA; font-weight: bold;">Сертификация</label><br />
          <select v-model="form.certification" id="certification" required style="width:100%; padding:5px;">
            <option v-for="item in dictionaries.answers" :key="item.value" :value="item.value">{{ item.value }}</option>
          </select>
        </div>

        <div style="margin-bottom:10px;">
          <label for="manufacturer" style="color: #008CBA; font-weight: bold;">Производитель</label><br />
          <input v-model="form.manufacturer" type="text" id="manufacturer" placeholder="Производитель" required style="width:100%; padding:5px;"/>
        </div>

        <div style="margin-bottom:10px;">
          <label for="supplier" style="color: #008CBA; font-weight: bold;">Версия</label><br />
          <input v-model="form.supplier" type="text" id="supplier" placeholder="Версия" required style="width:100%; padding:5px;"/>
        </div>
  <div class="d-flex justify-content-end gap-3">
    <button type="submit" class="btn btn-success px-4 py-2">Сохранить</button>
    <button type="button" @click="cancelEdit" class="btn btn-danger px-4 py-2">Отмена</button>
  </div>

      </form>
    </div>

<!-- Кнопка добавления -->
<div v-if="showAddButton && !showForm" id="netControls" class="d-flex justify-content-end align-items-center" style="margin-bottom: 10px;">
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
      showAddButton: false, // изначально скрыта
      systemSoftware: [], // список ПО
      selectedSystemId: null,
      selectedSystemIType: null,
      apiUrl: '',
      dictionaries: {
        typeArch: [],
        answers: [],
      },
      currentSystemSoftwareId: null,
      showForm: false,
      form: {
        os_name: '',
        architecture: '',
        certification: '',
        manufacturer: '',
        supplier: '',
      },
    };
  },
  methods: {
    // Загрузка систем
async loadSystems() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token },
    });
    if (res.ok) {
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

      // Вызовем onSystemChange() после установки selectedSystemId
      await this.onSystemChange();

      this.showAddButton = data.length > 0;
    }
  } catch (e) {
    console.error('Ошибка загрузки систем:', e);
    this.showAddButton = false;
  }
},
    // Получение названия системы по id
    getSystemName(id) {
      const system = this.systems.find(s => s.id === id);
      return system ? system.i_name || 'Без названия' : '';
    },
    // Получение метки схемы по имени
    getSchemaLabel(name) {
      switch (name) {
        case 'structuralScheme':
          return 'Структурная (топологическая) схема:';
        case 'zoneScheme':
          return 'Схема контролируемой зоны:';
        case 'flowScheme':
          return 'Схема информационных потоков:';
        default:
          return 'Схема:';
      }
    },
    // Загрузка системного ПО
    async loadSystemSoftwareForSystem(systemId) {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/systemSoftware?systemId=${systemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        const data = await res.json();
        this.systemSoftware = data;
console.log(this.systemSoftware);
      } catch (e) {
        console.error('Ошибка загрузки системного ПО:', e);
      }
    },

    // Загрузка словарей
    async loadDictionaries() {
      await this.loadDictionaryValuesForUser('typeArch');
      await this.loadDictionaryValuesForUser('answers');
    },

async loadDictionaryValuesForUser(type) {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/dictionaries/${type}`, {
      headers: { 'Authorization': 'Bearer ' + this.token },
    });
    if (res.ok) {
      const data = await res.json();
      this.dictionaries[type] = data; // заменили $set на прямое присваивание
    }
  } catch (err) {
    console.error('Ошибка загрузки справочника:', err);
  }
},

    // Обработка смены выбранной системы
async onSystemChange() {
  if (this.selectedSystemId) {
    localStorage.setItem('selectedSystemId', this.selectedSystemId);
    await this.loadSystemSoftwareForSystem(this.selectedSystemId);
    this.showForm = false; // скрываем форму при смене системы
  }
},

    // Открытие формы для добавления
    showAddForm() {
      this.resetForm();
      this.showForm = true;
    },

    // Редактировать ПО
    editSystemSoftware(id) {
      const item = this.systemSoftware.find(i => i.id === id);
      if (item) {
        this.form.os_name = item.os_name || '';
        this.form.architecture = item.architecture || '';
        this.form.certification = item.certification || '';
        this.form.manufacturer = item.manufacturer || '';
        this.form.supplier = item.supplier || '';
        this.currentSystemSoftwareId = id;
        this.showForm = true;
      }
    },

    // Отмена редактирования
    cancelEdit() {
      this.resetForm();
      this.showForm = false;
    },

    // Очистить форму
    resetForm() {
      this.form = {
        os_name: '',
        architecture: '',
        certification: '',
        manufacturer: '',
        supplier: '',
      };
      this.currentSystemSoftwareId = null;
    },

    // Сохранить ПО
    async saveSystemSoftware() {
      const payload = {
        os_name: this.form.os_name,
        architecture: this.form.architecture,
        certification: this.form.certification,
        manufacturer: this.form.manufacturer,
        supplier: this.form.supplier,
        systemId: this.selectedSystemId,
      };
      try {
        if (this.currentSystemSoftwareId) {
          // Обновление
          await fetch(`${this.apiUrl}/api/user/systemSoftware/${this.currentSystemSoftwareId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Создание
          await fetch(`${this.apiUrl}/api/user/systemSoftware`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify(payload),
          });
        }
        // Обновляем список
        await this.loadSystemSoftwareForSystem(this.selectedSystemId);
        this.cancelEdit();
      } catch (e) {
        console.error('Ошибка сохранения:', e);
      }
    },

    // Удаление ПО
    async deleteSystemSoftware(id) {
      if (confirm('Удалить это прикладное ПО?')) {
        try {
          const response = await fetch(`${this.apiUrl}/api/user/systemSoftware/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token },
          });
          if (response.ok) {
            await this.loadSystemSoftwareForSystem(this.selectedSystemId);
          }
        } catch (err) {
          console.error('Ошибка при удалении:', err);
        }
      }
    },
  },
  async mounted() {
    this.apiUrl = this.$API_URL;
    await this.loadDictionaries();
    await this.loadSystems();

  },
};
</script>

<style>
#sysappTable td, #sysappTable th {
  min-width: 20px; /* по необходимости */
}
#sysappTable thead tr {
  height: 30px !important;
}
#sysappTable tbody tr {
  height: 30px !important; /* если нужно оставить высоту тела */
}

</style>