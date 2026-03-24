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
<p style="text-align: center; color: #008CBA; font-weight: bold;">СРЕДСТВА ЗАЩИТЫ</p>
	


      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForSecurityTools" @change="loadSystemDetailsAndTools" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>
    <!-- Кнопка "Добавить" -->

	


<div v-if="showAddButton && !showForm" id="netControls" class="d-flex justify-content-between align-items-center" style="margin-bottom: 10px;">
<p style="margin: 0; color: #008CBA; font-size: 12px;" class="form-label mt-2">
  Текущая база сертифицированных СЗИ и СКЗИ (ФСБ и ФСТЭК) актуальна на: 20.10.2025.<br />Общее количество сертифицированных средств защиты: {{ securityToolsFromDb.length }}
</p>
  <button @click="showAddForm" class="btn btn-primary">
    Добавить
  </button>
</div>
    <!-- Таблица средств защиты -->
    <table id="sziTable"  class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
      <thead>
        <tr class="table-primary">
          <th>Наименование</th>
          <th>Заявитель</th>
          <th>Сертификат</th>
          <th>Функции</th>
          <th>Соответствие</th>
          <th>Версия</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="securityTools.length === 0">
          <td colspan="8" class="text-center">Нет средств защиты для выбранной системы</td>
        </tr>
        <tr v-for="(tool, index) in securityTools" :key="tool.id">
          <td>{{ tool.st_name }}</td>
          <td>{{ tool.st_producer }}</td>
<td>
  Сертификат соответствия {{ tool.st_certorgan }} России № {{ tool.st_cert }} 
  действует до: {{ formatDateForDisplay(tool.st_expiry) }}<br />
  Срок окончания технической поддержки: 
  {{ tool.tp_expiry ? formatDateForDisplay(tool.tp_expiry) : 'не заявлен' }}
</td>
          <td>{{ Array.isArray(tool.st_functions) ? tool.st_functions.join(', ') : '' }}</td>
          <td :title="tool.st_cert_tp">{{ truncateText(tool.st_cert_tp, 100) }}</td>
          <td>{{ tool.st_supplier }}</td>
          <td>
            <button @click="editSecurityTool(index)" class="btn btn-info"><i class="fa fa-pencil"></i></button>
            <button @click="deleteSecurityTool(index)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
<!-- Модальное окно подтверждения удаления -->
<div v-if="showDeleteModal" class="modal-overlay">
  <div class="modal-container">
    <h5>Подтверждение удаления</h5>
    <p>Вы действительно хотите удалить это средство защиты?</p>
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-secondary" @click="closeDeleteModal">Отмена</button>
      <button class="btn btn-danger" @click="confirmDelete">Удалить</button>
    </div>
  </div>
</div>

    <!-- Форма добавления/редактирования -->
<!-- Форма добавления/редактирования с использованием Bootstrap -->
    <!-- Модальное окно -->
	
    <div v-if="showForm" class="modal-overlay">

        <!-- Заголовок и кнопка закрытия -->
        <!-- Тело формы -->
        <div class="modal-body">

          <!-- Ваша форма -->
          <form @submit.prevent="saveSecurityTool" class="bg-white p-4 rounded shadow-sm" style="max-width: 1200px; margin: 0 auto;">
<div class="mb-3 text-center">
  <label class="form-label fw-semibold" style="color: #008CBA;">ОРГАН СЕРТИФИКАЦИИ СРЕДСТВ ЗАЩИТЫ</label>
<div class="radio-group">
  <div class="radio-item">
    <input class="form-check-input" type="radio" id="fstek" value="ФСТЭК" v-model="filterType" @change="resetSelectedTool" />
    <label for="fstek">ФСТЭК (СЗИ)</label>
  </div>
  <div class="radio-item">
    <input class="form-check-input" type="radio" id="fssb" value="ФСБ" v-model="filterType" @change="resetSelectedTool" />
    <label for="fssb">ФСБ (СКЗИ)</label>
  </div>
</div>
</div>
            <!-- Наименование -->
            <div class="mb-3 demo">
              <label class="form-label fw-semibold" style="color: #008CBA;">Наименование:</label>
<Vue3Select
  :taggable="true"
  v-model="selectedTool"
  :options="filteredSecurityToolsOptions"
  label="name"
  placeholder="Выберите или заполните данные по СЗИ"
  @search="onSearch"
  @create="onCreateOption"
  :creatable="true"
  @update:modelValue="onSelectSecurityTool"
  required
/>
            </div>

            <!-- Производитель -->
              <div class="mb-3">
<textarea
  v-model="formData.st_cert_tp"
  id="st_cert_tp"
  rows="1"
  class="form-control"
  placeholder="Соответствие СЗИ"
  style="height: 230px;"
  ref="st_cert_tp"
></textarea>
</div>
            <!-- Сертификат и срок -->
            <div class="mb-3 row">
              <div class="col">
                <label for="st_cert" class="form-label fw-semibold" style="color: #008CBA;">Сертификат {{ formData.st_certorgan }}</label>
                <input v-model="formData.st_cert" type="text" class="form-control" id="st_cert" placeholder="Номер сертификата" required />
              </div>
              <div class="col">
                <label for="st_expiry" class="form-label fw-semibold" style="color: #008CBA;">Срок действия сертификата</label>
                <input v-model="formData.st_expiry" type="date" class="form-control" id="st_expiry" required />
              </div>
              <div class="col">
                <label for="tp_expiry" class="form-label fw-semibold" style="color: #008CBA;">Срок действия ТП(*при наличии)</label>
                <input v-model="formData.tp_expiry" type="date" class="form-control" id="tp_expiry"/>
              </div>
            </div>

            <!-- Соответствие и версия -->
            <div class="mb-3 row">
			<div class="col">
              <label for="st_producer" class="form-label fw-semibold" style="color: #008CBA;">Заявитель</label>
              <input v-model="formData.st_producer" type="text" class="form-control" id="st_producer" placeholder="Производитель" required />
            </div>
              <div class="col">
                <label for="st_supplier" class="form-label fw-semibold" style="color: #008CBA;">Версия</label>
                <input v-model="formData.st_supplier" type="text" class="form-control" id="st_supplier" placeholder="Версия" required />
              </div>
            </div>

            <!-- Функции СЗИ -->
            <div class="mb-3">
              <label class="form-label fw-semibold" style="color: #008CBA;">Тип средства защиты (*типы указаны в соответвии СЗИ сертификата):</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="(func, index) in stFunctions" :key="index" class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" v-model="formData.st_functions" :value="func.value" :id="'func'+index" />
                  <label class="form-check-label" :for="'func'+index">{{ func.value }}</label>
                </div>
              </div>
              <!-- сообщение об ошибке -->
              <div v-if="functionsError" style="color:red; margin-top:5px;" class="text-center">{{ functionsError }}</div>
            </div>

            <!-- Кнопки -->
            <div class="d-flex justify-content-end gap-3 mt-3">
              <button type="submit" class="btn btn-success px-4 py-2">Сохранить</button>
              <button type="button" @click="cancelForm" class="btn btn-danger px-4 py-2">Отмена</button>
            </div>
          </form>
</div></div>
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
      showDeleteModal: false,
      deleteIndex: null, // индекс элемента, который собираемся удалить
      filterType: 'ФСТЭК', // по умолчанию можно выбрать один из вариантов
      selectedTool: null,
      securityToolsFromDb: [], // список средств защиты из базы
      token: localStorage.getItem('token') || '',
      systems: [], // список систем
      showAddButton: false, // изначально скрыта
      selectedSystemId: null,
      securityTools: [],
      showForm: false,
      searchQuery: '',
      filteredOptions: [],
      securityToolsIndex: {},
      apiUrl: '',
      functionsError: '', // сообщение об ошибке
      formData: {
        id: null,
        st_name: '',
        st_producer: '',
        st_cert: '',
        st_expiry: '',
        tp_expiry: '',
        st_certorgan: '',
        st_cert_tp: '',
        st_supplier: '',
        st_functions: []
      },
      stFunctions: [], // список функций для чекбоксов
      dictionaries: {
        answers: [],
      },
    };
  },
  watch: {
    'formData.st_name'(newVal) {
      this.onSearch(newVal);
    }
  },
  methods: {
  resetSelectedTool() {
    this.selectedTool = null;
    this.formData.st_name = '';
	this.formData.st_producer = '',
	this.formData.st_cert = '',
	this.formData.st_expiry = '',
	this.formData.tp_expiry = '',
	this.formData.st_certorgan = '',
	this.formData.st_cert_tp = '',
	this.formData.st_supplier = '',
	this.formData.st_functions = []
  },
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  onCreateOption(newOption) {
    // Создайте новый объект, который добавите в список
    const newItem = {
      id: null, // или можно сгенерировать временный id
      name: newOption,
      manufacturer: '',
      certnumber: '',
      certorgan: '',
      certexpiry: '',
      tpexpiry: '',
    };
    // Добавляем новый элемент в список
    this.securityToolsFromDb.push(newItem);
    // Устанавливаем выбранное значение
    this.selectedTool = newItem;
  },
onSelectSecurityTool(selected) {
  if (selected) {
    this.formData.st_name = selected.name;
    this.formData.st_producer = selected.manufacturer || '';
    this.formData.st_cert = selected.certnumber || '';
	this.formData.st_cert_tp = selected.functions || '';
	this.formData.st_certorgan = selected.certorgan || '';
    if (selected.certexpiry === 'Бессрочно') {
      // Устанавливаем дату 10.12.2050
      this.formData.st_expiry = '2050-12-10';
    } else {
      this.formData.st_expiry = this.formatDate(selected.certexpiry);
    }
    if (selected.tpexpiry === 'Бессрочно') {
      // Устанавливаем дату 10.12.2050
      this.formData.tp_expiry = '2050-12-10';
    } else {
      this.formData.tp_expiry = this.formatDate(selected.tpexpiry);
    }
  } else {
    this.formData.st_name = '';
    this.formData.st_producer = '';
    this.formData.st_cert = '';
    this.formData.st_expiry = '';
	this.formData.tp_expiry = '';
	this.formData.st_certorgan = '';
	this.formData.st_cert_tp = '';
  }
},
buildSecurityToolsIndex() {
  this.securityToolsIndex = {};
  this.securityToolsFromDb.forEach(item => {
    this.securityToolsIndex[item.name.toLowerCase()] = item;
  });
  this.allNames = this.securityToolsFromDb.map(item => item.name); // список всех имен
},

  onSearch(query) {
    if (typeof query !== 'string') return;
    const lowerQuery = query.toLowerCase();

    this.filteredOptions = this.securityToolsFromDb.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  },
  // после загрузки данных
async loadSecurityToolsFromDb() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/security-tools-db`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    this.securityToolsFromDb = await res.json();
    console.log('Загружено средств защиты:', this.securityToolsFromDb);
    this.buildSecurityToolsIndex();
  } catch (e) {
    console.error(e);
  }
},
  // при изменении данных или при необходимости
  refreshIndex() {
    this.buildSecurityToolsIndex();
  },
  
fillFieldsFromSelected() {
  const selectedName = this.formData.st_name;
  const selectedItem = this.securityToolsFromDb.find(item => item.name === selectedName);
  if (selectedItem) {
    this.formData.st_producer = selectedItem.manufacturer || '';
    this.formData.st_cert = selectedItem.certnumber || '';
    this.formData.st_expiry = this.formatDate(selectedItem.certexpiry);
    this.formData.tp_expiry = this.formatDate(selectedItem.tpexpiry);
	this.formData.st_certorgan = selectedItem.certorgan || '';
  } else {
    this.formData.st_producer = '';
    this.formData.st_cert = '';
    this.formData.st_expiry = '';
    this.formData.tp_expiry = '';
	this.formData.st_certorgan = '';
  }
},
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
    await this.loadSystemDetailsAndTools();

    // Показывать кнопку, если есть системы
    this.showAddButton = data.length > 0;

  } catch (e) {
    console.error(e);
    this.showAddButton = false;
  }
},
    async loadSecurityTools() {
      if (!this.selectedSystemId) return;
      try {
        const res = await fetch(`${this.apiUrl}/api/user/security-tools?systemId=${this.selectedSystemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
console.log(data);
        this.securityTools = data;
      } catch (e) {
        console.error(e);
      }
    },
	
    // Загрузка словарей
    async loadDictionaries() {
      await this.loadDictionaryValuesForUser('answers');
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
    // В Vue 3 реактивные свойства можно обновлять так:
    this.dictionaries[type] = data;
    if (type === 'typeSzi') {
      this.stFunctions = data; // обновляем список функций
    }
  } catch (err) {
    console.error('Ошибка загрузки справочника:', err);
  }
},
formatDate(dateStr) {
  if (!dateStr) return '';

  // Удаляем лишние пробелы
  dateStr = dateStr.trim();

  // Проверка формата с точками
  if (dateStr.includes('.')) {
    // Формат: DD.MM.YYYY или DD.MM.YYYY
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Форматируем в yyyy-mm-dd
      return `${year.padStart(4,'0')}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
    }
  }

  // Проверка формата с тире
  if (dateStr.includes('-')) {
    // Вероятно уже в ISO формате
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().substr(0, 10);
    }
  }

  // Если формат не распознан, возвращаем пустую строку
  return '';
},
    // обработка времени для показа даты пользователю
formatDateForDisplay(dateStr) {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
},
loadSystemDetailsAndTools() {
  if (this.selectedSystemId) {
    localStorage.setItem('selectedSystemId', this.selectedSystemId);
    this.loadSecurityTools();
    this.showForm = false; // скрываем форму при смене системы
  }
},
    showAddForm() {
      this.resetForm();
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
    },
resetForm() {
  this.formData = {
    id: null,
    st_name: '',
    st_producer: '',
    st_cert: '',
    st_expiry: '',
    tp_expiry: '',
    st_cert_tp: '',
	st_certorgan: '',
    st_supplier: '',
    st_functions: []
  };
  this.selectedTool = null; // добавьте это
},
editSecurityTool(index) {
  const item = this.securityTools[index];
  this.formData = {
    id: item.id,
    st_name: item.st_name,
    st_producer: item.st_producer,
    st_cert: item.st_cert,
    st_expiry: this.formatDate(item.st_expiry),
    tp_expiry: this.formatDate(item.tp_expiry) || '',
    st_certorgan: this.st_certorgan || '',
    st_cert_tp: item.st_cert_tp,
    st_supplier: item.st_supplier,
    st_functions: Array.isArray(item.st_functions) ? [...item.st_functions] : []
  };

  // Ищем в списке options объект по имени
  let foundOption = this.securityToolsFromDb.find(el => el.name === item.st_name);

  // Если не найден, создаем временный объект
  if (!foundOption) {
    foundOption = {
      id: null,
      name: item.st_name,
      manufacturer: item.st_producer,
      certnumber: item.st_cert,
      certexpiry: item.st_expiry,
      tpexpiry: item.tp_expiry,
      certorgan: item.st_certorgan,
      functions: item.st_cert_tp,
    };
    // Можно добавить его в список для корректного отображения
    this.securityToolsFromDb.push(foundOption);
  }

  this.selectedTool = foundOption;

  this.showForm = true;
},
async saveSecurityTool() {
  if (!this.selectedTool) {
    this.functionsError = 'Пожалуйста, выберите или заполните наименование средства защиты.';
    return;
  }
  // Проверка, что хотя бы одна функция выбрана
if (!this.formData.st_functions || this.formData.st_functions.length === 0) {
  this.functionsError = 'Пожалуйста, выберите функции средства защиты.';
  return;
} else {
  this.functionsError = '';
}
  // Обработка дат: если пустая строка или undefined, передать null
  const st_expiry = this.formData.st_expiry ? this.formData.st_expiry : null;
  const tp_expiry = this.formData.tp_expiry ? this.formData.tp_expiry : null;
      const payload = { ...this.formData, st_expiry: st_expiry, tp_expiry: tp_expiry, systemId: this.selectedSystemId };
      try {
        if (this.formData.id) {
          // обновление
          await fetch(`${this.apiUrl}/api/user/security-tools/${this.selectedSystemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(payload)
          });
        } else {
          // создание
          await fetch(`${this.apiUrl}/api/user/security-tools`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(payload)
          });
        }
        this.loadSecurityTools();
        this.showForm = false;
      } catch (e) {
        console.error(e);
      }
    },
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteIndex = null;
  },
  async confirmDelete() {
    const item = this.securityTools[this.deleteIndex];
    try {
      await fetch(`${this.apiUrl}/api/user/security-tools/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      this.loadSecurityTools();
    } catch (e) {
      console.error(e);
    } finally {
      this.showDeleteModal = false;
      this.deleteIndex = null;
    }
  },
deleteSecurityTool(index) {
  this.deleteIndex = index;
  this.showDeleteModal = true;
}
  },
computed: {
  filteredSecurityToolsOptions() {
    if (!this.filterType) return this.securityToolsFromDb;
    return this.securityToolsFromDb.filter(item => item.certorgan === this.filterType);
  },
  securityToolsMap() {
    const map = {};
    this.securityToolsFromDb.forEach(item => {
      map[item.name] = item;
    });
    return map;
  },
  securityToolsOptions() {
    return this.securityToolsFromDb.map(item => item.name);
  }
},

  async mounted() {
  this.apiUrl = this.$API_URL;
  this.token = localStorage.getItem('token') || '';
  await this.loadDictionaries();
  await this.loadDictionaryValuesForUser('typeSzi');
  await this.loadSystems();
  await this.loadSecurityToolsFromDb();
  // индекс уже построен внутри loadSecurityToolsFromDb
  }
};
</script>
<style scoped>

:deep(.form-control)::placeholder {
  color: var(--v-input-placeholder-color, #E8E8E8);
}
::v-deep(.vue3-select__single),
::v-deep(.vue3-select__multi-value),
::v-deep(.vue3-select__control),
::v-deep(.vue3-select__option) {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
}
/* Обеспечить перенос текста внутри опций и выбранных значений */
:deep(.demo) {
  --vs-controls-color: #664cc3;
  --vs-search-input-color: #282c34;
  --vs-search-input-placeholder-color: #E8E8E8;
  --vs-dropdown-option-color: #008CBA;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-container {
  background: #fff;
  padding: 15px;
  border-radius: 0px;
  max-width: 1000px;
  width: auto;
}
.radio-group {
  display: flex;
  justify-content: center;
  gap: 30px; /* расстояние между радиокнопками */
  align-items: center;
}
.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>