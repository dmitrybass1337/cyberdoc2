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
<p style="text-align: center; color: #008CBA; font-weight: bold;">ТЕХНИЧЕСКИЕ СРЕДСТВА</p>
	


      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
      <select id="selectInfoSysForArm" @change="handleSystemChange" class="form-select"></select>
    <!-- Поля поиска -->

<div v-if="allArmData.length > 0" class="mt-2 d-flex justify-content-between align-items-center">
  <input type="text" id="searchInput" @keyup="filterTable" placeholder="Поиск технического средства" class="form-control" />
</div>

    <!-- Таблица -->
<div style="overflow-x: auto; width: 100%;" class="mt-2">
<table id="ArmTable" class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
        <thead>
          <tr class="table-primary">
            <th style="text-align: center;" >Статус</th>
            <th style="text-align: left;" >Тип</th>
            <th style="text-align: left;" >Вид</th>
            <th style="text-align: center;" >Производитель</th>
            <th style="text-align: left;" >Модель</th>
            <th style="text-align: left;" >Заводской/инвентарный номер</th>
            <th style="text-align: center;" >IP-адрес</th>
            <th style="text-align: left;" >Размещение</th>
            <th style="text-align: left;" >Ответственный</th>
            <th style="text-align: left;" >Дополнительно</th>
            <th style="text-align: center;" >Действия</th>
          </tr>
        </thead>
        <tbody id="ArmTbody"></tbody>
      </table>
<!-- кнопки пагинации -->
<!-- кнопки пагинации -->
<div class="d-flex align-items-center mt-2">
  <!-- Контейнер с выбором количества строк -->
  <div style="display: flex; align-items: center;">
    <!-- Лейбл с отступом справа для четкого разделения -->
    <label for="rowsPerPage" style="margin-right: 10px; color: #008CBA; font-weight: bold; margin-bottom: 0;">Показать записей на странице</label>
    <!-- Селект с чуть увеличенным отступом снизу, чтобы не мешал выравниванию -->
    <select id="rowsPerPage" v-model="rowsPerPage" @change="changeItemsPerPage" 
      style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer; margin-bottom: 0;">
      <option v-for="count in [5, 10, 15, 20, 30, 40, 50]" :key="count" :value="count">{{ count }}</option>
    </select>
  </div>
  
  <!-- Центрированные кнопки пагинации -->
  <div id="paginationContainer" class="d-flex justify-content-center flex-grow-1 mx-3">
    <button class="btn btn-outline-primary btn-sm me-2" @click="goToFirstPage" :disabled="currentPage === 1">
      <i class="fa fa-fast-backward" aria-hidden="true"></i>
    </button>
    <button class="btn btn-outline-primary btn-sm me-2" @click="prevPage" :disabled="currentPage === 1">
      <i class="fa fa-backward" aria-hidden="true"></i>
    </button>
    <span>{{ currentPage }} из {{ totalPages }}</span>
    <button class="btn btn-outline-primary btn-sm ms-2" @click="nextPage" :disabled="currentPage === totalPages">
      <i class="fa fa-forward" aria-hidden="true"></i>
    </button>
    <button class="btn btn-outline-primary btn-sm ms-2" @click="goToLastPage" :disabled="currentPage === totalPages">
      <i class="fa fa-fast-forward" aria-hidden="true"></i>
    </button>
  </div>

  <!-- Кнопка "Добавить Вручную" справа -->
<div v-if="isSystemSelected" class="d-flex justify-content-end align-items-center" style="margin-bottom: 10px;">
  <button id="addArmBtn" class="btn btn-primary" @click="onAddArm">Добавить Вручную</button>
</div>
</div>


    </div>


<!-- Форма -->
<form id="ArmForm" style="display:none; margin: 20px auto; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif; font-size: 14px;">


<!-- Основные поля в три колонки -->
<div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
  <!-- Тип -->
  <div style="flex: 1 1 30%;">
    <label for="a_type" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Тип</label>
    <select id="a_type" style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
      <option v-for="option in typeArmOptions" :key="option.value" :value="option.value">{{ option.value }}</option>
    </select>
  </div>
  <!-- Вид -->
  <div style="flex: 1 1 30%;">
    <label for="a_vid" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Вид</label>
    <select id="a_vid" style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
      <option v-for="option in vidArmOptions" :key="option.value" :value="option.value">{{ option.value }}</option>
    </select>
  </div>
  <!-- Сетевое имя -->
  <div style="flex: 1 1 30%;">
    <label for="a_netname" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Производитель</label>
    <input type="text" id="a_netname" placeholder="Производитель(торговая марка)" style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>

  <!-- IP-адрес -->
  <div style="flex: 1 1 30%;">
    <label for="a_ip" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">IP-адрес</label>
    <input type="text" id="a_ip" placeholder="IP-адрес" style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <!-- Модель -->
  <div style="flex: 1 1 30%;">
    <label for="a_model" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Модель</label>
    <input type="text" id="a_model" placeholder="Модель" required style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <!-- Заводской/инвентарный номер -->
  <div style="flex: 1 1 30%;">
    <label for="a_invert" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Заводской/инвентарный номер</label>
    <input type="text" id="a_invert" placeholder="Заводской/инвентарный номер" required style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>
</div>
  <!-- Ответственный/Пользователь -->
  <div style="margin-top: 15px;">
    <label for="a_user" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Ответственный/Пользователь</label>
<v-select
  :options="employeesList"
  label="fullName"
  v-model="selectedEmployeeId"
  @input="onEmployeeSelect"
  placeholder="Выберите сотрудника"
/>
  </div>

  <div style="margin-top: 15px;">
    <label for="a_mesto" style="display:block; color: #008CBA; margin-bottom:8px; font-weight: 600;">Размещение/Кабинет</label>
    <input type="text" id="a_mesto" placeholder="Место расположение технического средства" required style="width: 100%; padding:8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>

  <!-- Устройства -->
<!-- Контейнер с заголовком справа и кнопками слева -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px;">
  <!-- Кнопки слева -->
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <button id="addMouseBtn" type="button" style="background:#008CBA; color:#fff; padding:10px 16px; border:none; border-radius:4px; cursor:pointer; font-weight:600; transition:background 0.3s;">+ мышь</button>
    <button id="addKeyboardBtn" type="button" style="background:#008CBA; color:#fff; padding:10px 16px; border:none; border-radius:4px; cursor:pointer; font-weight:600; transition:background 0.3s;">+ клавиатура</button>
    <button id="addMonitorBtn" type="button" style="background:#008CBA; color:#fff; padding:10px 16px; border:none; border-radius:4px; cursor:pointer; font-weight:600; transition:background 0.3s;">+ монитор</button>
    <button id="addPrinterBtn" type="button" style="background:#008CBA; color:#fff; padding:10px 16px; border:none; border-radius:4px; cursor:pointer; font-weight:600; transition:background 0.3s;">+ принтер</button>
  </div>
  <!-- Заголовок справа -->

</div>

  <!-- Периферийные устройства (скрытые по умолчанию) -->
  <!-- Мышь -->
  <div id="mouseFields" style="margin-top: 15px; border:1px solid #ddd; border-radius:8px; padding:15px; display:none; background:#fafafa;">
    <h4 style="margin-bottom:10px; color:#333;">Мышь</h4>
    <div style="display:flex; gap:15px;">
      <div style="flex:1;">
        <label for="mouse_model" style="display:block; margin-bottom:8px; font-weight:600;">Модель</label>
        <input type="text" id="mouse_model" placeholder="Модель" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
      <div style="flex:1;">
        <label for="mouse_invent" style="display:block; margin-bottom:8px; font-weight:600;">Производитель</label>
        <input type="text" id="mouse_invent" placeholder="Производитель(торговая марка)" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
    </div>
    <button id="deleteMouseBtn" type="button" style="margin-top:10px; background:#f44336; color:#fff; padding:8px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Удалить</button>
  </div>

  <!-- Клавиатура -->
  <div id="keyboardFields" style="margin-top: 15px; border:1px solid #ddd; border-radius:8px; padding:15px; display:none; background:#fafafa;">
    <h4 style="margin-bottom:10px; color:#333;">Клавиатура</h4>
    <div style="display:flex; gap:15px;">
      <div style="flex:1;">
        <label for="keyboard_model" style="display:block; margin-bottom:8px; font-weight:600;">Модель</label>
        <input type="text" id="keyboard_model" placeholder="Модель" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
      <div style="flex:1;">
        <label for="keyboard_invent" style="display:block; margin-bottom:8px; font-weight:600;">Производитель</label>
        <input type="text" id="keyboard_invent" placeholder="Производитель(торговая марка)" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
    </div>
    <button id="deleteKeyboardBtn" type="button" style="margin-top:10px; background:#f44336; color:#fff; padding:8px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Удалить</button>
  </div>

  <!-- Монитор -->
  <div id="monitorFields" style="margin-top: 15px; border:1px solid #ddd; border-radius:8px; padding:15px; display:none; background:#fafafa;">
    <h4 style="margin-bottom:10px; color:#333;">Монитор</h4>
    <div style="display:flex; gap:15px;">
      <div style="flex:1;">
        <label for="monitor_model" style="display:block; margin-bottom:8px; font-weight:600;">Модель</label>
        <input type="text" id="monitor_model" placeholder="Модель" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
      <div style="flex:1;">
        <label for="monitor_invent" style="display:block; margin-bottom:8px; font-weight:600;">Производитель</label>
        <input type="text" id="monitor_invent" placeholder="Производитель(торговая марка)" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
    </div>
    <button id="deleteMonitorBtn" type="button" style="margin-top:10px; background:#f44336; color:#fff; padding:8px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Удалить</button>
  </div>

  <!-- Принтер -->
  <div id="printerFields" style="margin-top: 15px; border:1px solid #ddd; border-radius:8px; padding:15px; display:none; background:#fafafa;">
    <h4 style="margin-bottom:10px; color:#333;">Принтер</h4>
    <div style="display:flex; gap:15px;">
      <div style="flex:1;">
        <label for="printer_model" style="display:block; margin-bottom:8px; font-weight:600;">Модель</label>
        <input type="text" id="printer_model" placeholder="Модель" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
      <div style="flex:1;">
        <label for="printer_invent" style="display:block; margin-bottom:8px; font-weight:600;">Производитель</label>
        <input type="text" id="printer_invent" placeholder="Производитель(торговая марка)" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      </div>
    </div>
    <button id="deletePrinterBtn" type="button" style="margin-top:10px; background:#f44336; color:#fff; padding:8px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Удалить</button>
  </div>

  <!-- Кнопки -->
          <div style="display: flex; justify-content: flex-end; margin-top: 20px; gap: 10px;">
            <button class="btn btn-success" type="submit">Сохранить</button>
            <button class="btn btn-danger" id="cancelArmBtn" type="button">Отмена</button>
          </div>
 

</form>

</div>
    <!-- Контейнер для кнопки редактировать -->

  </div>
</template>

<script>
import vSelect from 'vue3-select'
import 'vue3-select/dist/vue3-select.css'
export default {
  components: { 'v-select': vSelect },
  name: 'ArmComponent',
  data() {
    return {
      selectedEmployee: null, // выбранный
      selectedEmployeeId: null,
      // массивы, переменные состояния
      currentArmId: null,
      currentPeripheralValue: '', // новое свойство
      currentSelectedSystemId: null,
      currentSystemArm: [],
      ArmDict: [],
      employeesList: [], // список сотрудников, если есть
      token: localStorage.getItem('token') || '',
      typeArmOptions: [],
      vidArmOptions: [],
      formFields: {
      a_user: '',
      apiUrl: '',
      },
      // новые переменные для пагинации
      allArmData: [], // все текущие данные
      currentPage: 1,
      itemsPerPage: 5,
      totalPages: 1,
      isSystemSelected: false, // добавляем
      rowsPerPage: 5, // добавляем переменную
      showAddButton: true, // по умолчанию скрывать кнопку
    };
  },
async mounted() {
  this.apiUrl = this.$API_URL;
  await this.init();
  await this.loadEmployees();

  // Проверка выбранной системы
  const select = document.getElementById('selectInfoSysForArm');
  if (select && select.value) {
    this.handleSystemChange(); // обновит переменную
  }
},
  methods: {
  onEmployeeSelect(selected) {
    this.selectedEmployeeId = selected ? selected.id : null;
  },
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.renderPaginatedTable();
  }
},
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.renderPaginatedTable();
  }
},
goToFirstPage() {
  this.currentPage = 1;
  this.renderPaginatedTable();
},
goToLastPage() {
  this.currentPage = this.totalPages;
  this.renderPaginatedTable();
},
    async init() {
      // Инициализация: загрузка данных и настройка событий
      this.setupEventListeners();
      await this.loadInitialDictionaries();
      await this.loadInformationSystemsForArm();
      // Можно вызвать другие функции по необходимости
    },
  async loadTypeArmDictionary() {
    try {
      const response = await fetch(`${this.apiUrl}/api/user/dictionaries/typeArm`, {
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      if (!response.ok) throw new Error('Ошибка загрузки справочника Тип АРМ');
      this.typeArmOptions = await response.json();
    } catch (err) {
      console.error(err);
    }
  },
  changeItemsPerPage() {
    this.itemsPerPage = this.rowsPerPage; // обновляем переменную для пагинации
    this.currentPage = 1; // сбрасываем на первую страницу
    this.renderPaginatedTable(); // перерисовываем таблицу
  },
  onTypeChange() {
    const typeSelect = document.getElementById('a_type');
    const vidSelect = document.getElementById('a_vid');
    if (typeSelect && vidSelect) {
      const selectedType = typeSelect.value;
      if (selectedType !== 'Сервер') {
        // Устанавливаем "Физический" и блокируем выбор
        vidSelect.value = 'Физический';
        vidSelect.disabled = true;
      } else {
        // Разблокируем для выбора
        vidSelect.disabled = false;
      }
    }
  },
  async loadVidArmDictionary() {
    try {
      const response = await fetch(`${this.apiUrl}/api/user/dictionaries/vidArm`, {
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      if (!response.ok) throw new Error('Ошибка загрузки справочника Вид АРМ');
      let data = await response.json();
      // Обеспечить наличие "Физический" и "Виртуальный"
      const requiredValues = ['Физический', 'Виртуальный'];
      requiredValues.forEach(val => {
        if (!data.some(item => item.value === val)) {
          data.push({ value: val });
        }
      });
      this.vidArmOptions = data;
    } catch (err) {
      console.error(err);
    }
  },

  async loadInitialDictionaries() {
    await Promise.all([this.loadTypeArmDictionary(), this.loadVidArmDictionary()]);
  },
    setupEventListeners() {
  document.getElementById('addArmBtn')?.addEventListener('click', this.onAddArm);
  document.getElementById('cancelArmBtn')?.addEventListener('click', this.onCancel);
  document.querySelector('#ArmTable thead th:nth-child(1)')?.addEventListener('click', this.sortTableByStatus);
  const selectSys = document.getElementById('selectInfoSysForArm');
  if (selectSys) {
    selectSys.addEventListener('change', () => {
      const selectedId = selectSys.value;
      if (selectedId) {
      // скрываем форму при смене системы
      document.getElementById('ArmForm').style.display = 'none';
        this.loadArmForSystem(selectedId);
      }
    });
  }
      // Обработчики для периферии
      document.getElementById('addMouseBtn')?.addEventListener('click', () => {
        this.fillPeripheralFields('mouse', []);
        document.getElementById('mouseFields').style.display = 'block';
        document.getElementById('addMouseBtn').style.display = 'none';
      });
      document.getElementById('addKeyboardBtn')?.addEventListener('click', () => {
        this.fillPeripheralFields('keyboard', []);
        document.getElementById('keyboardFields').style.display = 'block';
        document.getElementById('addKeyboardBtn').style.display = 'none';
      });
      document.getElementById('addMonitorBtn')?.addEventListener('click', () => {
        this.fillPeripheralFields('monitor', []);
        document.getElementById('monitorFields').style.display = 'block';
        document.getElementById('addMonitorBtn').style.display = 'none';
      });
      document.getElementById('addPrinterBtn')?.addEventListener('click', () => {
        this.fillPeripheralFields('printer', []);
        document.getElementById('printerFields').style.display = 'block';
        document.getElementById('addPrinterBtn').style.display = 'none';
      });

      // Обработчики удалений периферии
      document.getElementById('deleteMouseBtn')?.addEventListener('click', () => { this.clearPeripheralFields('mouse'); });
      document.getElementById('deleteKeyboardBtn')?.addEventListener('click', () => { this.clearPeripheralFields('keyboard'); });
      document.getElementById('deleteMonitorBtn')?.addEventListener('click', () => { this.clearPeripheralFields('monitor'); });
      document.getElementById('deletePrinterBtn')?.addEventListener('click', () => { this.clearPeripheralFields('printer'); });

      // Обработка формы
      document.getElementById('ArmForm')?.addEventListener('submit', this.saveArm);
      // Обработчик для изменения типа
      const typeSelect = document.getElementById('a_type');
        if (typeSelect) {
      typeSelect.addEventListener('change', this.onTypeChange);
      }
    },

async loadInformationSystemsForArm() {
  const select = document.getElementById('selectInfoSysForArm');
  select.innerHTML = '';
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const systems = await res.json();

    if (Array.isArray(systems) && systems.length > 0) {
      systems.forEach(sys => {
        const opt = document.createElement('option');
        opt.value = sys.id;
        opt.dataset.iType = sys.i_type;
        opt.textContent = sys.i_name || 'Без названия';
        select.appendChild(opt);
      });
      
      // Восстановление выбранной системы из localStorage
      const savedId = localStorage.getItem('selectedSystemId');
      if (savedId && Array.from(select.options).some(opt => opt.value === savedId)) {
        select.value = savedId;
      } else {
        select.value = select.options[0].value; // по умолчанию первый
      }
      
      // Обновляем текущий ID
      this.currentSelectedSystemId = select.value;
      
      // Загружаем ТС для выбранной системы
      await this.loadArmForSystem(this.currentSelectedSystemId);
    }
  } catch (e) {
    console.error('Ошибка загрузки систем:', e);
  }
},

    async initializeSelectedSystemForArm() {
      const select = document.getElementById('selectInfoSysForArm');
      if (select.options.length > 0) {
        const selectedId = select.value;
        if (selectedId) {
          await this.loadArmForSystem(selectedId);
        }
      }
    },

    renderPaginatedTable() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage;
      const endIdx = startIdx + this.itemsPerPage;
      const pageData = this.allArmData.slice(startIdx, endIdx);
this.renderArmTable(pageData);
    },


    // Загрузка и инициализация
async loadArmForSystem(systemId) {
  this.currentSelectedSystemId = systemId;
  try {
    const res = await fetch(`${this.apiUrl}/api/user/arm?systemId=${systemId}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();

    // Перед рендерингом таблицы убедитесь, что сотрудники загружены
    if (this.employeesList.length === 0) {
      await this.loadEmployees();
    }

    this.allArmData = data;
console.log(this.allArmData);
    this.totalPages = Math.ceil(this.allArmData.length / this.itemsPerPage);
    this.currentPage = 1;
    this.renderPaginatedTable();
  } catch (e) {
    console.error('Ошибка загрузки ТС для системы:', e);
  }
},

    renderArmTable(data) {
      const tbody = document.getElementById('ArmTbody');
      tbody.innerHTML = '';

      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Нет Технических средств для выбранной системы</td></tr>';
        return;
      }

      data.forEach(Arm => {
        const tr = document.createElement('tr');

        // Статус
        const statusTd = document.createElement('td');
        statusTd.style.textAlign = 'center';
        const responsibleName = this.getEmployeeNameById(Arm.a_user);
        if (responsibleName === 'Сотрудник не найден') {
          statusTd.innerHTML = '<span style="color: red; font-weight: bold; font-size: 18px;" title="Ответственный за АРМ не найден в базе сотрудников.\nАктуализируйте данный актив!">⚠️</span>';
        } else {
          statusTd.innerHTML = '<span style="color: green; font-weight: bold; font-size: 18px;" title="Данные по АРМ корректны.">✅</span>';
        }
        tr.appendChild(statusTd);

        // Остальные ячейки
        const fields = ['a_type', 'a_vid', 'a_netname', 'a_model', 'a_invert', 'a_ip', 'a_mesto'];
        fields.forEach(field => {
          const td = document.createElement('td');
          td.textContent = Arm[field] || '';
          tr.appendChild(td);
        });

        // Ответственный
        const responsibleTd = document.createElement('td');
        if (responsibleName === 'Сотрудник не найден') {
          responsibleTd.innerHTML = `<span style="color: red;"><strong>${responsibleName}</strong></span>`;
        } else {
          responsibleTd.textContent = responsibleName;
        }
        tr.appendChild(responsibleTd);

        // Периферия
        const peripheralsTd = document.createElement('td');
        peripheralsTd.id = `peripherals-cell-${Arm.id}`;
        peripheralsTd.innerHTML = 'Загрузка...';
        tr.appendChild(peripheralsTd);

        // Действия
        const actionsTd = document.createElement('td');

        // Кнопки удаления и редактирования
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.onclick = () => this.deleteArm(Arm.id);

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
        editBtn.className = 'btn btn-info';
        editBtn.onclick = () => this.editArm(Arm.id);

        actionsTd.appendChild(deleteBtn);
        actionsTd.appendChild(editBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);

        // Загружаем периферию
        this.loadPeripherals(Arm.id).then(peripherals => {
          const cell = document.getElementById(`peripherals-cell-${Arm.id}`);
          if (peripherals && peripherals.length > 0) {
            cell.innerHTML = peripherals.map(p => p.type).join(', ');
          } else {
            cell.innerHTML = '-';
          }
        });
      });
    },
    getEmployeeNameById(id) {
      if (!id) return 'Сотрудник не найден';
      const emp = this.employeesList.find(e => String(e.id) === String(id));
      return emp ? `${emp.p_surname} ${emp.p_name} ${emp.p_patronymic}` : 'Сотрудник не найден';
    },

    async loadPeripherals(armId) {
      // const cell = document.getElementById(`peripherals-cell-${armId}`);
      // cell.innerHTML = 'Редактирование...';
      try {
        const res = await fetch(`${this.apiUrl}/api/user/arm/${armId}/peripherals`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const peripherals = await res.json();
        console.log('Периферийные устройства для armId', armId, ':', peripherals);
        return peripherals;
      } catch (err) {
        console.error('Ошибка загрузки периферии:', err);
        throw err;
      }
    },

  async deleteArm(id) {
    if (confirm('Удалить этот ТС?')) {
      try {
        const res= await fetch(`${this.apiUrl}/api/user/arm/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const result = await res.json();
      alert(result.message || 'Техническое средство удалено.');
      this.loadArmForSystem(this.currentSelectedSystemId); // Обновляем таблицу
    } catch (err) {
      console.error('Ошибка при удалении технического средства:', err);
      alert('Не удалось удалить техническое средство.');
    }
    }
  },
async editArm(id) {
  // подготовка формы
  document.getElementById('addArmBtn').style.display = 'none';
  document.getElementById('cancelArmBtn').style.display = 'block';
  document.getElementById('ArmForm').style.display = 'block';

  try {
    const res = await fetch(`${this.apiUrl}/api/user/arm/${id}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (!res.ok) throw new Error('Ошибка получения данных ТС');
    const data = await res.json();

    // Заполняем поля формы
    document.getElementById('a_type').value = data.a_type || '';
    document.getElementById('a_vid').value = data.a_vid || '';
    document.getElementById('a_netname').value = data.a_netname || '';
    document.getElementById('a_model').value = data.a_model || '';
    document.getElementById('a_invert').value = data.a_invert || '';
    document.getElementById('a_ip').value = data.a_ip || '';
    document.getElementById('a_mesto').value = data.a_mesto || '';

    // Загрузка сотрудников и установка выбранного
    await this.loadEmployees(); // дождаться загрузки сотрудников
    this.selectedEmployeeId = this.employeesList.find(e => String(e.id) === String(data.a_user)) || null;

    // Загрузка периферии
    const peripherals = await this.loadPeripherals(id);
    this.fillPeripheralFields('mouse', peripherals);
    this.fillPeripheralFields('keyboard', peripherals);
    this.fillPeripheralFields('monitor', peripherals);
    this.fillPeripheralFields('printer', peripherals);
// сохраняем текущие периферийные устройства в свойство
const peripheralsNames = peripherals.length > 0 ? peripherals.map(p => p.type).join(', ') : '';
this.currentPeripheralValue = peripheralsNames;

    // Обновляем текущий ID
    this.currentArmId = data.id;
  } catch (err) {
    console.error('Ошибка редактирования:', err);
  }
},

async saveArm(e) {
  e.preventDefault();
  // сбор данных формы
  const a_type = document.getElementById('a_type').value;
  const a_vid = document.getElementById('a_vid').value;
  const a_netname = document.getElementById('a_netname').value;
  const a_model = document.getElementById('a_model').value;
  const a_invert = document.getElementById('a_invert').value;
  const a_ip = document.getElementById('a_ip').value;
  const a_user = this.selectedEmployeeId.id; // тут
  const a_mesto = document.getElementById('a_mesto').value;

  // собираем периферию
  const equipmentArray = [];
  const mouseModel = document.getElementById('mouse_model').value.trim();
  const mouseInvent = document.getElementById('mouse_invent').value.trim();
  if (mouseModel || mouseInvent) {
    equipmentArray.push(`Мышь: ${mouseModel} / ${mouseInvent}`);
  }
  const keyboardModel = document.getElementById('keyboard_model').value.trim();
  const keyboardInvent = document.getElementById('keyboard_invent').value.trim();
  if (keyboardModel || keyboardInvent) {
    equipmentArray.push(`Клавиатура: ${keyboardModel} / ${keyboardInvent}`);
  }
  const monitorModel = document.getElementById('monitor_model').value.trim();
  const monitorInvent = document.getElementById('monitor_invent').value.trim();
  if (monitorModel || monitorInvent) {
    equipmentArray.push(`Монитор: ${monitorModel} / ${monitorInvent}`);
  }
  const printerModel = document.getElementById('printer_model').value.trim();
  const printerInvent = document.getElementById('printer_invent').value.trim();
  if (printerModel || printerInvent) {
    equipmentArray.push(`Принтер: ${printerModel} / ${printerInvent}`);
  }

  const payload = {
    a_type,
    a_vid,
    a_netname,
    a_model,
    a_invert,
    a_ip,
    a_user,
    a_mesto,
    a_equipment: equipmentArray,
    systemId: this.currentSelectedSystemId
  };

  if (this.currentArmId) {
    // обновление
    await fetch(`${this.apiUrl}/api/user/arm/${this.currentArmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify(payload)
    });
    alert('ТС успешно обновлено');
  } else {
    // создание
    await fetch(`${this.apiUrl}/api/user/arm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify(payload)
    });
    alert('ТС успешно добавлено');
  }

  // Перед вызовом loadArm() сохраняем текущий выбранный systemId
  const previousSystemId = this.currentSelectedSystemId;

  // Обновляем список систем/таблицу
await this.loadArmForSystem(this.currentSelectedSystemId);

  // Восстановление выбранной системы
  const select = document.getElementById('selectInfoSysForArm');
  if (previousSystemId && Array.from(select.options).some(opt => opt.value === previousSystemId)) {
    select.value = previousSystemId;
  } else if (select.options.length > 0) {
    select.value = select.options[0].value;
  }
  this.currentSelectedSystemId = select.value; // Обновляем текущий выбранный id

  // Завершение
  document.getElementById('ArmForm').style.display = 'none';
  document.getElementById('addArmBtn').style.display = 'inline-block';
  document.getElementById('ArmForm').reset();
  this.currentArmId = null;
},

async loadArm() {
  // загрузка систем
  const select = document.getElementById('selectInfoSysForArm');
  select.innerHTML = '';
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const systems = await res.json();
    if (Array.isArray(systems) && systems.length > 0) {
      systems.forEach(sys => {
        const option = document.createElement('option');
        option.value = sys.id;
        option.dataset.iType = sys.i_type;
        option.textContent = sys.i_name || 'Без названия';
        select.appendChild(option);
      });
      // Выбор первого
      select.value = select.options[0].value;
      this.currentSelectedSystemId = select.value;
      
      // Загружаем ТС для выбранной системы
      await this.loadArmForSystem(this.currentSelectedSystemId);
    }
  } catch (err) {
    console.error('Ошибка при загрузке систем:', err);
  }
},

filterTable() {
  const filterValue = document.getElementById('searchInput').value.toLowerCase();
  const tbody = document.getElementById('ArmTbody');
  const rows = Array.from(tbody.rows);

  rows.forEach(row => {
    // Для каждого ряда проверяем все ячейки
    const cells = Array.from(row.cells);
    const match = cells.some(cell => cell.innerText.toLowerCase().includes(filterValue));
    row.style.display = match ? '' : 'none';
  });

  // Сброс текущей страницы на 1 при поиске
  this.currentPage = 1;
  // Обновляем пагинацию

},

    sortTableByStatus() {
      const table = document.getElementById('ArmTable');
      const tbody = table.tBodies[0];
      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const aStatus = a.cells[0].innerHTML;
        const bStatus = b.cells[0].innerHTML;
        const getPriority = (cellContent) => {
          if (cellContent.includes('⚠️')) return 0;
          if (cellContent.includes('✅')) return 1;
          return 2;
        };
        return getPriority(aStatus) - getPriority(bStatus);
      });
      rows.forEach(row => tbody.appendChild(row));
    },

    handleSelectChange() {
      const select = document.getElementById('selectInfoSysForArm');
      const selectedId = select.value;
      if (selectedId) {
        this.loadSystemDetails(selectedId);
        this.loadArmForSystem(selectedId);
      }
    },
    fillPeripheralFields(peripheralType, peripherals) {
      const typeMap = {
        mouse: 'Мышь',
        keyboard: 'Клавиатура',
        monitor: 'Монитор',
        printer: 'Принтер'
      };
      const typeName = typeMap[peripheralType];
      const peripheral = peripherals.find(p => p.type === typeName);
      const modelInput = document.getElementById(`${peripheralType}_model`);
      const inventInput = document.getElementById(`${peripheralType}_invent`);
      const block = document.getElementById(`${peripheralType}Fields`);
      if (peripheral) {
        if (modelInput) modelInput.value = peripheral.model || '';
        if (inventInput) inventInput.value = peripheral.invent || '';
        if (block) block.style.display = 'block';
      } else {
        if (modelInput) modelInput.value = '';
        if (inventInput) inventInput.value = '';
        if (block) block.style.display = 'none';
      }
    },

    clearPeripheralFields(peripheralType) {
      const modelInput = document.getElementById(`${peripheralType}_model`);
      const inventInput = document.getElementById(`${peripheralType}_invent`);
      const block = document.getElementById(`${peripheralType}Fields`);
      if (modelInput) modelInput.value = '';
      if (inventInput) inventInput.value = '';
      if (block) block.style.display = 'none';
      const addBtn = document.getElementById(`add${this.capitalizeFirstLetter(peripheralType)}Btn`);
      if (addBtn) addBtn.style.display = 'inline-block';
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
	
async loadEmployees() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/personal`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();

    if (Array.isArray(data)) {
      this.employeesList = data.map(emp => ({
        ...emp,
        fullName: `${emp.p_surname} ${emp.p_name} ${emp.p_patronymic} (${emp.p_position})`
      }));
      
      // Установите выбранного сотрудника по умолчанию, если нужно
      if (this.employeesList.length > 0 && !this.selectedEmployee) {
        this.selectedEmployee = this.employeesList[0]; // или this.employeesList[0].fullName
      }
    }
  } catch (err) {
    console.error('Ошибка загрузки сотрудников:', err);
  }
},

  loadEmployeesIntoSelect() {
    const select = document.getElementById('a_user');
    select.innerHTML = '';
    this.employeesList.forEach(emp => {
      const option = document.createElement('option');
      option.value = emp.id;
      option.textContent = `${emp.p_surname} ${emp.p_name} ${emp.p_patronymic} (${emp.p_position})`;
      select.appendChild(option);
    });
  },



    async onAddArm() {
      // подготовка формы
      // сброс формы и скрытие блоков периферии
      document.getElementById('addArmBtn').style.display = 'none';
      document.getElementById('ArmForm').reset();
      document.getElementById('mouseFields').style.display = 'none';
      document.getElementById('keyboardFields').style.display = 'none';
      document.getElementById('monitorFields').style.display = 'none';
      document.getElementById('printerFields').style.display = 'none';
      document.getElementById('ArmForm').style.display = 'block';
      this.currentArmId = null;
      // Можно также вызвать handleTypeChange() или подобное
    },
async handleSystemChange() {
  const select = document.getElementById('selectInfoSysForArm');
  if (select && select.value) {
    localStorage.setItem('selectedSystemId', select.value);
    this.currentSelectedSystemId = select.value;
    this.isSystemSelected = true; // система выбрана
    await this.loadArmForSystem(this.currentSelectedSystemId);
  } else {
    this.isSystemSelected = false; // системы нет
  }
},
async onCancel() {
  // скрываем форму
  document.getElementById('ArmForm').style.display = 'none';

  // показываем кнопку добавления
  document.getElementById('addArmBtn').style.display = 'inline-block';

  // восстанавливаем значение периферии в ячейке
  if (this.currentArmId) {
    const cell = document.getElementById(`peripherals-cell-${this.currentArmId}`);
    if (cell) {
      cell.innerHTML = this.currentPeripheralValue || '';
    }
  }

  // показываем все кнопки "+ ..."
  document.querySelectorAll('#addMouseBtn, #addKeyboardBtn, #addMonitorBtn, #addPrinterBtn').forEach(btn => {
    btn.style.display = 'inline-block';
  });

  // скрываем все блоки периферии
  ['mouse', 'keyboard', 'monitor', 'printer'].forEach(type => {
    const block = document.getElementById(`${type}Fields`);
    if (block) block.style.display = 'none';
  });

  // сбрасываем текущий выбранный ID
  this.currentArmId = null;
},
    // функция по вашему добавленная отдельно
async loadSystemDetails(systemId) {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system/${systemId}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const systemData = await res.json();
    window.selectedISDetails = {
      i_name: systemData.i_name,
      i_sname: systemData.i_sname,
      i_type: systemData.i_type,
      i_pers: systemData.i_pers,
      i_regim: systemData.i_regim,
      i_struk: systemData.i_struk,
      i_inet: systemData.i_inet,
      i_mesto: systemData.i_mesto,
      i_naznachenie: systemData.i_naznachenie,
      i_cod: systemData.i_cod,
      i_datais: systemData.i_datais,
    };
  } catch (e) {
    console.error('Ошибка загрузки данных системы:', e);
  }
}
  }
};
</script>

<style>
#appTable td, #appTable th {
  min-width: 20px; /* по необходимости */
}
#appTable thead tr {
  height: 30px !important;
}
#appTable tbody tr {
  height: 30px !important; /* если нужно оставить высоту тела */
}

</style>