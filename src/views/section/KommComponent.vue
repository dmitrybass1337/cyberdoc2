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
<p style="text-align: center; color: #008CBA; font-weight: bold;">ПРИКАЗЫ</p>
	
      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForCommission" @change="handleSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>


    <!-- Таблица комиссий -->
    <table id="commTable"  class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
      <thead>
        <tr class="table-primary">
          <th>Статус</th>
          <th>Тип документа</th>
          <th>Председатель или Утверждающий</th>
          <th>Члены комиссии или Ответственный</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="commissions.length === 0">
          <td  colspan="8" class="text-center">Нет документов для выбранной системы</td>
        </tr>
        <tr v-for="comm in commissions" :key="comm.id">
<td style="text-align: center;">
  <div v-html="getCommStatus(comm)"></div>
</td>
          <td>{{ comm.type }}</td>
          <td>{{ getEmployeeNameById(comm.chairperson_id) }}<br>({{ getEmployeePositionById(comm.chairperson_id) }})</td>
<td>
    <div v-for="memberId in comm.member_ids" :key="memberId">
      {{ getEmployeeNameById(memberId) }}<br>({{ getEmployeePositionById(memberId) }})
    </div>
</td>
          <td>
            <button @click="editCommission(comm.id)" class="btn btn-info"><i class="fa fa-pencil"></i></button>
            <button @click="deleteCommission(comm.id)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Кнопка добавить -->
	
<div id="CommissionControls"  v-if="systems.length > 0 && !showForm" class="d-flex justify-content-end align-items-center" style="margin-bottom: 10px;">
  <button @click="showAddForm" id="addCommissionBtn" :disabled="isCommissionExistsForType" title="Для выбранной системы с таким типом комиссия уже существует" class="btn btn-primary">
    Добавить
  </button>
</div>	

	


    <!-- Форма редактирования/создания комиссии -->
    <div v-show="showForm" id="commissionFormContainer" style="padding:5px; margin-top:10px;">
      <form id="commissionForm">
        <label for="commissionTypeSelect" style="color: #008CBA; font-weight: bold;">Выберите тип документа:   </label>
<select class="form-select" id="commissionTypeSelect" v-model="currentCommission.type" required>
  <option v-for="type in commissionTypes" :key="type.id" :value="type.value">
    {{ type.value }}
  </option>
</select>

 <div v-if="currentCommission.type === 'Приказ о назначении ответственного по ИБ'">
 <br />
<label class="form-label fw-semibold" style="color: #008CBA;">Выберите утверждающего:</label>
<Vue3Select
  v-model="approverId"
  :options="employeesOptions"
  placeholder="Введите фамилию имя или отчество для быстрого поиска"
  label="label"
  :get-option-label="option => option.label"
  :get-option-value="option => option.value"
/>
<label class="form-label fw-semibold" style="color: #008CBA;">Ответственный за ИБ:</label>
<Vue3Select
  v-model="responsibleId"
  :options="employeesOptions"
  placeholder="Введите фамилию имя или отчество для быстрого поиска"
  label="label"
  :get-option-label="option => option.label"
  :get-option-value="option => option.value"
/>






        </div>
        <!-- Для других типов показываем стандартные селекты -->
        <div v-else>

        <label style="color: #008CBA; font-weight: bold;">Председатель:</label>
<select class="form-select" id="chairpersonSelect" v-model="currentCommission.chairperson_id" @change="updateMembersCheckboxes(currentCommission.chairperson_id)" required>
  <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">
    {{ emp.p_surname }} {{ emp.p_name }} {{ emp.p_patronymic }} ({{ emp.p_position }})
  </option>
</select>
        <label style="color: #008CBA; font-weight: bold; margin-top: 5px;">Члены комиссии:</label>
        <div style="display: none; margin-top: 0px;" id="membersSelectionContainer" v-show="showMembersSelection">
<table style="width: 100%; border-collapse: collapse; border: 2px solid #008CBA;">
  <thead>
    <tr>
      <th style="border: 2px solid #E8E8E8; color: #008CBA;">Выбор</th>
      <th style="border: 2px solid #E8E8E8; color: #008CBA;">ФИО</th>
      <th style="border: 2px solid #E8E8E8; color: #008CBA;">Должность</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="emp in employeesList" :key="emp.id">
      <!-- Колонка выбора -->
      <td style="border: 2px solid #E8E8E8; text-align: center;">
        <input type="checkbox" class="form-check-input" :data-id="emp.id" v-model="currentMembers" :value="emp.id" :disabled="emp.id == currentCommission.chairperson_id">
      </td>
      
      <!-- Колонка ФИО -->
      <td :class="{'text-red': isCheckboxDisabled(emp)}" style="border: 2px solid #E8E8E8;">
        {{ emp.p_surname }} {{ emp.p_name }} {{ emp.p_patronymic }}
      </td>
      
      <!-- Колонка Должность -->
      <td style="border: 2px solid #E8E8E8;">
        {{ emp.p_position }}
      </td>
    </tr>
  </tbody>
</table>
</div></div>
 <br />
        <!-- Кнопки -->
        <div class="d-flex justify-content-end gap-3">
    <button @click="saveCommission" class="btn btn-success px-4 py-2">Сохранить</button>
    <button type="button" @click="cancelForm" class="btn btn-danger px-4 py-2">Отмена</button>
  </div>
      </form>

    </div>
  </div>
</div>
</template>

<script>
import Vue3Select from 'vue3-select'
import 'vue3-select/dist/vue3-select.css'
export default {
  components: { Vue3Select },
  data() {
    return {
      token: localStorage.getItem('token') || '',
      systems: [],
      selectedSystemId: null,
      employeesPage: 1,
      employeesPerPage: 10,
      commissions: [],
      employeesList: [], // список сотрудников
      dictionaries: {}, // для хранения словарей
      commissionTypes: [], // сюда загрузим из сервера
      apiUrl: '',
      currentCommission: {
        id: null,
        type: '',
        chairperson_id: null,
        member_ids: [],
      },
      showForm: false,
      showMembersSelection: false,
      currentMembers: [], // выбранные участники
      approverId: null,
      responsibleId: null,
    };
  },
computed: {
  employeesOptions() {
    return this.employeesList.map(emp => ({
      label: `${emp.p_surname} ${emp.p_name} ${emp.p_patronymic} (${emp.p_position})`,
      value: emp.id,
    }));
  },
  isCommissionExistsForType() {
    return this.commissions.some(comm => comm.system_id === this.selectedSystemId && comm.type === this.currentCommission.type);
  }
},
  methods: {
async handleSystemChange() {
  // сохраняем выбранную систему
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  this.commissions = []; // очищаем список перед загрузкой
  await this.loadCommissionForSystem(this.selectedSystemId);
  this.showForm = false; // скрываем форму
  this.resetCurrentCommission();
},
    isCheckboxDisabled(emp) {
    return emp.id == this.currentCommission.chairperson_id;
  },
getCommStatus(comm) {
  // Проверка председателя
  const chairName = this.getEmployeeNameById(comm.chairperson_id);
  const chairPosition = this.getEmployeePositionById(comm.chairperson_id);
  if (chairName === 'Сотрудник не найден' || chairPosition === 'Должность отсутствует') {
    return `<span style="color: red; font-weight: bold; font-size: 18px;" title="Председатель не найден в реестре сотрудников.\nАктуализируйте данную комиссию!">⚠️</span>`;
  }

  // Проверка участников
  for (const memberId of comm.member_ids) {
    const name = this.getEmployeeNameById(memberId);
    const position = this.getEmployeePositionById(memberId);
    if (name === 'Сотрудник не найден' || position === 'Должность отсутствует') {
      return `<span style="color: red; font-weight: bold; font-size: 18px;" title="Один из членов комиссии не найден в реестре сотрудников.\nАктуализируйте данную комиссию!">⚠️</span>`;
    }
  }

  // Все проверки прошли успешно
  return `<span style="color: green; font-weight: bold; font-size: 18px;" title="Данные по Приказу корректны.">✅</span>`;
},
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
        this.dictionaries[type] = data;
        if (type === 'typeKomis') {
          this.commissionTypes = data;
        }
      } catch (err) {
        console.error('Ошибка загрузки справочника:', err);
      }
    },
    async loadSystems() {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/system`, {
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        const data = await res.json();
        this.systems = data;
        if (this.systems.length > 0) {
          this.selectedSystemId = this.systems[0].id;
          await this.loadCommissionForSystem(this.selectedSystemId);
        }
      } catch (e) {
        console.error('Ошибка загрузки систем:', e);
      }
    },
async loadCommissionForSystem(systemId) {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/commissions?systemId=${systemId}`, {
      headers: { 'Authorization': 'Bearer ' + this.token },
    });
    const data = await res.json();
    console.log('Загруженные комиссии:', data);
    if (Array.isArray(data)) {
      this.commissions = data;
    } else if (data && Array.isArray(data.items)) {
      this.commissions = data.items;
    } else {
      this.commissions = [];
    }
  } catch (e) {
    console.error('Ошибка загрузки комиссий:', e);
    this.commissions = [];
  }
},
getEmployeeNameById(id) {
  const numericId = Number(id);
  const emp = this.employeesList.find(e => e.id === numericId);
  return emp ? `${emp.p_surname} ${emp.p_name} ${emp.p_patronymic}` : `Сотрудник не найден`;
},
getEmployeePositionById(id) {
  const numericId = Number(id);
  const emp = this.employeesList.find(e => e.id === numericId);
  return emp && emp.p_position ? emp.p_position : 'Должность отсутствует';
},
async showAddForm() {
  // Загружаем список сотрудников
  await this.loadEmployees();

  // Сброс текущей комиссии
  this.resetCurrentCommission();

  // Устанавливаем тип
  if (this.commissionTypes.length > 0) {
    this.currentCommission.type = this.commissionTypes[0].value;
  }

  // Устанавливаем председателя по умолчанию, например первого
  if (this.employeesList.length > 0) {
    this.currentCommission.chairperson_id = this.employeesList[0].id;
  }

  // Показываем форму
  this.showForm = true;
  this.showMembersSelection = true;
},
    cancelForm() {
      this.showForm = false;
      this.resetCurrentCommission();
    },
    resetCurrentCommission() {
      this.currentCommission = {
        id: null,
        type: '',
        chairperson_id: null,
        member_ids: [],
      };
      this.currentMembers = [];
    },
async saveCommission() {
  const systemId = Number(this.selectedSystemId);
  const exists = this.commissions.some(c => c.system_id === systemId && c.type === this.currentCommission.type && c.id !== this.currentCommission.id);
  if (exists) {
    alert('Такой документ уже существует для выбранной системы!');
    return;
  }

  // Обработка участников
  this.currentMembers = this.currentMembers.filter(id => id != this.currentCommission.chairperson_id);
  this.currentMembers = this.currentMembers.filter(id => {
    const numericId = Number(id);
    return this.employeesList.some(emp => emp.id === numericId);
  });
  const memberIds = this.currentMembers.map(id => Number(id));
  // Для типа "Приказ о назначении ответственного по ИБ" не требуется минимум 3 участника
  if (this.currentCommission.type !== 'Приказ о назначении ответственного по ИБ') {
    if (memberIds.length < 3) {
      alert('Должны быть выбраны не менее 3 участников');
      return;
    }
  }

  const commData = {
    type: this.currentCommission.type,
    chairperson_id: this.currentCommission.chairperson_id,
    member_ids: memberIds,
  };

// Для "Приказ о назначении ответственного по ИБ"
if (this.currentCommission.type === 'Приказ о назначении ответственного по ИБ') {
  commData.chairperson_id = this.approverId ? this.approverId.value : null;
  commData.member_ids = this.responsibleId ? [this.responsibleId.value] : [];
} else {
  // Для других типов
  commData.chairperson_id = this.currentCommission.chairperson_id;
  commData.member_ids = this.currentMembers.map(id => {
    const empOption = this.employeesOptions.find(e => e.value === id);
    return empOption ? empOption.value : id;
  });
}

  try {
    let response;
    if (this.currentCommission.id) {
      response = await fetch(`${this.apiUrl}/api/user/commissions/${this.currentCommission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token,
        },
        body: JSON.stringify({ ...commData, systemId: this.selectedSystemId }),
      });
    } else {
      response = await fetch(`${this.apiUrl}/api/user/commissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token,
        },
        body: JSON.stringify({ ...commData, systemId: this.selectedSystemId }),
      });
    }

    const result = await response.json();

    if (response.ok) {
      alert('Комиссия сохранена');
      await this.loadCommissionForSystem(this.selectedSystemId);
      this.cancelForm();
    } else {
      alert('Ошибка при сохранении: ' + result.error);
    }
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
},
async editCommission(commId) {
  await this.loadEmployees();

  const comm = this.commissions.find(c => c.id === commId);
  if (!comm) {
    alert('Комиссия не найдена');
    return;
  }

  this.currentCommission.id = comm.id;
  this.currentCommission.type = comm.type;
  this.currentCommission.chairperson_id = comm.chairperson_id;

  // исключаем председателя из участников
  this.currentMembers = comm.member_ids.filter(id => id != comm.chairperson_id);

  // Для типа "Приказ о назначении ответственного по ИБ" — устанавливаем объекты для селектов
  if (this.currentCommission.type === 'Приказ о назначении ответственного по ИБ') {
    // Находим объекты для селектов
	console.log(comm);
    this.approverId = this.employeesOptions.find(opt => opt.value === comm.chairperson_id) || null;
    this.responsibleId = this.employeesOptions.find(opt => opt.value === Number(comm.member_ids[0])) || null;
  }

  this.showForm = true;
  this.showMembersSelection = true;
},
    async deleteCommission(commId) {
      if (confirm('Удалить эту комиссию?')) {
        try {
          await fetch(`${this.apiUrl}/api/user/commissions/${commId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token },
          });
          await this.loadCommissionForSystem(this.selectedSystemId);
        } catch (e) {
          console.error('Ошибка удаления:', e);
        }
      }
    },
    updateMembersCheckboxes(chairpersonId) {
console.log('обновление')
      this.currentMembers = this.currentMembers.filter(id => id !== chairpersonId);
    },
async loadEmployees() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/personal`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Посмотрите тип id
      //console.log('Тип id сотрудников:', typeof data[0].id);
      this.employeesList = data;
    } else {
      console.warn('Список сотрудников пуст или не получен');
    }
  } catch (err) {
    console.error('Ошибка загрузки сотрудников:', err);
  }
}
  },
async mounted() {
  this.apiUrl = this.$API_URL;

  if (this.selectedSystemId) {
    this.commissions = [];
    await this.loadCommissionForSystem(this.selectedSystemId);
  }

  await this.loadDictionaryValuesForUser('typeKomis'); // загрузка типов комиссии
  await this.loadSystems(); // загрузка систем

  // Установка выбранной системы из localStorage
  const savedSystemId = localStorage.getItem('selectedSystemId');

  // Проверка, что systems — это массив
  if (Array.isArray(this.systems)) {
    if (savedSystemId && this.systems.some(s => s.id == savedSystemId)) {
      this.selectedSystemId = savedSystemId;
    } else if (this.systems.length > 0) {
      this.selectedSystemId = this.systems[0].id;
    }
  } else {
    console.warn('Системы не являются массивом:', this.systems);
  }

  // Загрузка комиссий для выбранной системы
  if (this.selectedSystemId) {
    await this.loadCommissionForSystem(this.selectedSystemId);
  }

  await this.loadEmployees(); // загрузка сотрудников
},
};
</script>

<style>
.text-red {
  color: red;
}
#commTable td, #commTable th {
  min-width: 20px; /* по необходимости */
}
#commTable thead tr {
  height: 30px !important;
}
#commTable tbody tr {
  height: 30px !important; /* если нужно оставить высоту тела */
}

</style>