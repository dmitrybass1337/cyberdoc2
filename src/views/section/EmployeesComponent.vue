<template>
  <div class="jumbotron">
    <!-- Заголовок -->
    <!-- Основной контейнер -->
    <div
      id="personalFormContainer"
      style="
        margin: 0 auto;
        background: #fff;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        overflow-x: auto;"
    >
      <p style="text-align: center; color: #008CBA; font-weight: bold;">РЕЕСТР СОТРУДНИКОВ</p>
<div v-if="deleteSuccessMessage" class="delete-success-message">
  {{ deleteSuccessMessage }}
</div>
<div v-if="employees.length > 0" class="mt-3 d-flex justify-content-between align-items-center">
  <div class="input-group" style="width: 100%;">
    <input v-model="searchQuery" placeholder="Поиск по имени, фамилии или должности" class="form-control me-sm-2" type="search"/>
  </div>
  <button @click="deleteAllPersonal()" class="btn btn-danger btn-sm" style="width: 120px; height: 38px;">
    <i class="fa fa-trash" aria-hidden="true"></i> Отчистить
  </button>
</div>

      <p></p>

      <!-- Таблица сотрудников -->
      <div style="overflow-x: auto; width: 100%;">
        <table id="appTable" class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
          <thead>
            <tr class="table-primary">
              <th style="text-align: left;">Фамилия</th>
              <th style="text-align: left;">Имя</th>
              <th style="text-align: left;">Отчество</th>
              <th style="text-align: left;">Должность</th>
              <th style="text-align: left;">Подразделение</th>
              <th style="text-align: left;">Отдел</th>
              <th style="text-align: left;">Почта</th>
              <th style="text-align: left;">Телефон</th>
              <th style="text-align: left;">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="employees.length === 0">
              <td colspan="9" class="text-center">Нет сотрудников.</td>
            </tr>
            <tr v-for="employee in paginatedEmployees" :key="employee.id">
              <td>{{ employee.p_surname }}</td>
              <td>{{ employee.p_name }}</td>
              <td>{{ employee.p_patronymic }}</td>
              <td>{{ employee.p_position }}</td>
              <td>{{ employee.p_department }}</td>
              <td>{{ employee.p_otdel }}</td>
              <td>{{ employee.p_email }}</td>
              <td>{{ employee.p_tel }}</td>
              <td style="text-align: center;">
                <button class="btn btn-danger btn-sm" @click="deleteEmployee(employee.id)">
                  <i class="fa fa-trash"></i>
                </button>
                <button class="btn btn-info btn-sm" @click="editEmployee(employee.id)">
                  <i class="fa fa-pencil"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- кнопки пагинации -->
        <div class="d-flex align-items-center mt-2">
          <div class="d-flex justify-content-center flex-grow-1">
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
          <div v-if="!showForm" class="d-flex justify-content-end align-items-center" style="margin-bottom: 10px;">
            <button id="addArmBtn" class="btn btn-primary" @click="showAddForm">Добавить Вручную</button>
          </div>
        </div>
      </div>
<!-- Прогресс-бар -->
<div v-if="showProgress" class="progress-container" style="margin-top: 10px;">
  <div class="progress" style="height: 20px;">
    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%;"></div>
  </div>
  <div style="text-align: center; margin-top: 5px;"> {{ progressMessage }} </div>
</div>
      <div style="display: flex; gap: 5px; flex-wrap: nowrap;">
        <!-- Выгрузка из 1С ЗУП [.XML] -->
        <div v-if="!showForm" style="margin-top: 20px; text-align: right; flex: 1;" class="input-group mb-3">
          <input type="file" @change="handleFileUpload" accept=".xml" class="d-none" id="fileInput2" />
          <input type="text" class="form-control" placeholder="Выгрузка из 1С ЗУП [.XML]" readonly aria-label="Выбор файла" />
          <button class="btn btn-primary" type="button" onclick="document.getElementById('fileInput2').click();">Загрузить файл</button>
        </div>

        <!-- Выгрузка из 1С ЗУП [.MXL] -->
        <div v-if="!showForm" style="margin-top: 20px; text-align: right; flex: 1;" class="input-group mb-3">
          <input type="file" @change="handleFileUpload2" accept=".mxl" class="d-none" id="fileInput3" />
          <input type="text" class="form-control" placeholder="Выгрузка из 1С ЗУП [.MXL]" readonly aria-label="Выбор файла" />
          <button class="btn btn-primary" type="button" @click="triggerFileInput">Загрузить файл</button>
        </div>
      </div>

      <!-- Модальное окно -->
<!-- Окно сообщения -->
<div v-if="showMessageModal" class="modal-overlay">
  <div class="modal-box">
    <p>{{ messageModalText }}</p>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn btn-primary" @click="addEmployees">Добавить</button>
      <button class="btn btn-secondary btn-sm" @click="closeMessageModal">Закрыть</button>
    </div>
  </div>
</div>
<!-- Окно сообщения -->
<div v-if="showMessageModalС" class="modal-overlay">
  <div class="modal-box">
    <p>{{ messageModalText }}</p>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn btn-secondary btn-sm" @click="closeMessageModal">Закрыть</button>
    </div>
  </div>
</div>
<!-- Модальное окно подтверждения -->
<div v-if="showConfirmAddModal" class="modal-overlay">
  <div class="modal-box" style="max-width: 400px;">
    <h5>Подтверждение</h5>
    <p>{{ confirmAddMessage }}</p>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn btn-secondary" @click="closeConfirmAddModal">Закрыть</button>
      <button class="btn btn-primary" @click="addEmployees">Добавить</button>
    </div>
  </div>
</div>
<!-- Окно добавления сотрудников -->
<div v-if="showAddEmployeesModal" class="modal-overlay">
  <div class="modal-box" style="max-width: 500px;">
    <h5>{{ addEmployeesMessage }}</h5>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn btn-primary" @click="addEmployees">Добавить</button>
      <button class="btn btn-secondary" @click="closeAddEmployeesModal">Отмена</button>
    </div>
  </div>
</div>
<!-- Модальное окно -->
<div v-if="showModal" class="modal-overlay">
  <div class="modal-box">
    <form @submit.prevent="saveEmployee" class="modal-form">
      <!-- Поля формы -->
<!-- Поля "Фамилия, Имя, Отчество" -->
<div class="grid-container">
  <div class="form-group">
    <label for="p_surname">Фамилия</label>
    <input v-model="formData.p_surname" type="text" id="p_surname" required />
  </div>
  <div class="form-group">
    <label for="p_name">Имя</label>
    <input v-model="formData.p_name" type="text" id="p_name" required />
  </div>
  <div class="form-group">
    <label for="p_patronymic">Отчество</label>
    <input v-model="formData.p_patronymic" type="text" id="p_patronymic" required />
  </div>
</div>

<!-- Поля "Электронная почта" и "Телефон" по всей ширине -->
<!-- Поля "Электронная почта" и "Телефон" на одном уровне -->
<div class="flex-row-full-width">
  <div class="form-group flex-item">
    <label for="p_email">Электронная почта</label>
    <input v-model="formData.p_email" type="email" id="p_email" required />
  </div>
  <div class="form-group flex-item">
    <label for="p_tel">Телефон</label>
    <input v-model="formData.p_tel" type="text" id="p_tel" @input="filterPhone" required />
  </div>
</div>

<!-- Поля "Должность, Отдел, Подразделение" -->
<div class="grid-container">
<!-- Поля "Должность, Отдел, Подразделение" каждое с новой строки -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div class="form-group">
    <label for="p_position">Должность</label>
    <input v-model="formData.p_position" type="text" id="p_position" required />
  </div>
  <div class="form-group">
    <label for="p_otdel">Отдел</label>
    <input v-model="formData.p_otdel" type="text" id="p_otdel" required />
  </div>
  <div class="form-group">
    <label for="p_department">Подразделение</label>
    <input v-model="formData.p_department" type="text" id="p_department" required />
  </div>
</div>
</div>
      <div class="modal-buttons">
        <button class="btn btn-success" type="submit">Сохранить</button>
        <button class="btn btn-danger" type="button" @click="cancelEdit">Отмена</button>
      </div>
    </form>
  </div>
</div>
    </div>
<!-- Внутри модального окна, после формы -->
<div v-if="modalMessage" class="modal-message" style="margin-top: 10px; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
  {{ modalMessage }}
  <!-- Можно добавить кнопку "Добавить" -->
  <div style="margin-top: 10px; text-align: right;">
    <button class="btn btn-primary btn-sm" @click="addEmployees">Добавить</button>
    <button class="btn btn-secondary btn-sm" @click="cancelAdd">Отмена</button>
  </div>
</div>
<!-- Модальное окно подтверждения удаления -->
<div v-if="showDeleteConfirm" class="modal-overlay">
  <div class="modal-content-s" style="max-width: 400px;">
    <h5>Удалить этого сотрудника?</h5>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button class="btn btn-danger" @click="confirmDelete">Подтвердить</button>
      <button class="btn btn-secondary" @click="cancelDelete">Отмена</button>
    </div>
  </div>
</div>
<!-- Модальное окно для сообщений -->
<div v-if="modalMessage" class="modal-overlay">
  <div class="modal-box" style="max-width: 400px;">
    <p>{{ modalMessage }}</p>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button class="btn btn-secondary btn-sm" @click="closeModalMessage">Закрыть</button>
    </div>
  </div>
</div>
<!-- Модальное окно подтверждения удаления всех сотрудников -->
<div v-if="showDeleteAllModal" class="modal-overlay">
  <div class="modal-content" style="max-width: 400px;">
    <h5>Удалить всех сотрудников?</h5>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button class="btn btn-danger" @click="confirmDeleteAll">Подтвердить</button>
      <button class="btn btn-secondary" @click="showDeleteAllModal = false">Отмена</button>
    </div>
</div>
</div>
  </div>
</template>

<script>
export default {
  name: "EmployeesComponent",
  data() {
    return {
      newEmployees: [], // добавьте это
      showAddEmployeesModal: false,
      addEmployeesMessage: '',
      employees: [],
      formData: {
        p_surname: '',
        p_name: '',
        p_patronymic: '',
        p_email: '',
        p_tel: '',
        p_position: '',
        p_otdel: '',
        p_department: ''
      },
      modalMessageС: false, // окно с сообщением
      showMessageModal: false, // окно с сообщением
      showMessageModalС: false, // окно с сообщением
      messageModalText: '',    // текст сообщения
      modalMessage: '',
      showConfirmAddModal: false,
      confirmAddMessage: '', // сообщение
      deleteSuccessMessage: '',
      showProgress: false,
      pendingEmployeesToAdd: [],
      progressMessage: '',
      showDeleteAllModal: false,
      searchQuery: '',
      showDeleteConfirm: false,
      deleteEmployeeId: null,
      currentPage: 1,
      itemsPerPage: 10,
      apiUrl: "", // Укажите ваш API-адрес
      currentEmployeeId: null,
      showForm: false,
      showModal: false, // управление модальной
      token: localStorage.getItem('token') || '',
    };
  },
  computed: {
    filteredEmployees() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        return this.employees;
      }
      return this.employees.filter(item => {
        const surname = item.p_surname.toLowerCase();
        const name = item.p_name.toLowerCase();
        const patronymic = item.p_patronymic.toLowerCase();
        const position = item.p_position.toLowerCase();
        return (
          surname.includes(query) ||
          name.includes(query) ||
          patronymic.includes(query) ||
          position.includes(query)
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.itemsPerPage) || 1;
    },
    paginatedEmployees() {
      const filtered = this.filteredEmployees;
      if (!Array.isArray(filtered)) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    }
  },
  methods: {
closeConfirmAddModal() {
  this.showConfirmAddModal = false;
  this.confirmAddMessage = '';
},
closeMessageModal() {
  this.showMessageModal = false;
  this.showMessageModalС = false;
  this.messageModalText = '';
},
closeAddEmployeesModal() {
  this.showAddEmployeesModal = false;
},
  closeModalMessage() {
    this.modalMessage = '';
    this.showModal = false; // если хотите закрывать главное окно
  },
addEmployees() {
  console.log('Массив сотрудников для добавления:', this.newEmployees);
  this.saveEmployeesToServer(this.newEmployees);
  this.addEmployeesMessage = '';
  this.showAddEmployeesModal = false;
  this.showMessageModal = false;
  this.showMessageModalС = false;
  this.showConfirmAddModal = false;
},
  triggerFileInput() {
    const input = document.getElementById('fileInput3');
    input.value = ''; // очистить значение
    input.click();
  },
cancelAdd() {
  this.modalMessage = '';
},
    filterPhone() {
      this.formData.p_tel = this.formData.p_tel.replace(/[^0-9()+-]/g, '');
    },
    goToFirstPage() {
      this.currentPage = 1;
    },
    goToLastPage() {
      this.currentPage = this.totalPages;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
async deleteAllPersonal() {
  this.showDeleteAllModal = true;
},
async confirmDeleteAll() {
  this.showDeleteAllModal = false;
  try {
    const res = await fetch(`${this.apiUrl}/api/user/personal/all`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const result = await res.json();
    // показываем сообщение в отдельном окне
    this.deleteSuccessMessage = result.message || 'Все сотрудники успешно удалены.';
    // очищаем сообщение через некоторое время (например, через 5 секунд)
    setTimeout(() => {
      this.deleteSuccessMessage = '';
    }, 5000);
    // Обновляем список
    this.loadEmployees();
  } catch (err) {
    console.error('Ошибка при удалении всех сотрудников:', err);
    alert('Не удалось удалить сотрудников.');
  }
},
    // Загрузка сотрудников
    async loadEmployees() {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/personal`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        const data = await res.json();
        this.employees = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('Ошибка загрузки сотрудников:', err);
      }
    },

    showAddForm() {
      this.resetForm();
      this.currentEmployeeId = null;
      this.showModal = true;
    },

    cancelEdit() {
      this.resetForm();
      this.showModal = false;
    },

    resetForm() {
      this.formData = {
        p_surname: '',
        p_name: '',
        p_patronymic: '',
        p_email: '',
        p_tel: '',
        p_position: '',
        p_otdel: '',
        p_department: ''
      };
    },

    trimAndLimit(str, maxLength = 100) {
      if (!str) return '';
      return str.substring(0, maxLength);
    },

    async saveEmployee() {
      const data = {
        p_surname: this.trimAndLimit(this.formData.p_surname),
        p_name: this.trimAndLimit(this.formData.p_name),
        p_patronymic: this.trimAndLimit(this.formData.p_patronymic),
        p_email: this.trimAndLimit(this.formData.p_email),
        p_tel: this.trimAndLimit(this.formData.p_tel),
        p_position: this.trimAndLimit(this.formData.p_position),
        p_otdel: this.trimAndLimit(this.formData.p_otdel),
        p_department: this.trimAndLimit(this.formData.p_department)
      };
      try {
        let res, result;
        if (this.currentEmployeeId) {
          res = await fetch(`${this.apiUrl}/api/user/personal/${this.currentEmployeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(data)
          });
        } else {
          res = await fetch(`${this.apiUrl}/api/user/personal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(data)
          });
        }
        result = await res.json();
        if (res.ok) {
          this.messageModalText = "Данные сотрудника успешно сохранены";
          this.showMessageModalС = true;
          this.loadEmployees();
          this.showModal = false;
        } else {
          alert('Ошибка: ' + (result.message || 'Произошла ошибка'));
        }
      } catch (err) {
        console.error('Ошибка при сохранении:', err);
        alert('Не удалось сохранить данные сотрудника.');
      }
    },

  confirmDeleteEmployee(id) {
    this.deleteEmployeeId = id;
    this.showDeleteConfirm = true;
  },
  async deleteEmployee(id) {
    // заменяем вызов confirm() на вызов confirmDeleteEmployee
    this.confirmDeleteEmployee(id);
  },
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteEmployeeId = null;
  },
  async confirmDelete() {
    // вызывается при подтверждении
    const id = this.deleteEmployeeId;
    this.showDeleteConfirm = false;
    try {
      const res = await fetch(`${this.apiUrl}/api/user/personal/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      this.loadEmployees();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить сотрудника.');
    }
  },
    async editEmployee(id) {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/personal/${id}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        const data = await res.json();
        this.formData = {
          p_surname: data.p_surname || '',
          p_name: data.p_name || '',
          p_patronymic: data.p_patronymic || '',
          p_email: data.p_email || '',
          p_tel: data.p_tel || '',
          p_position: data.p_position || '',
          p_otdel: data.p_otdel || '',
          p_department: data.p_department || ''
        };
        this.currentEmployeeId = data.id;
        this.showModal = true;
      } catch (err) {
        console.error('Ошибка редактирования:', err);
        alert('Не удалось загрузить данные сотрудника.');
      }
    },

  handleFileUpload2(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    input.value = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      const mxlText = e.target.result;
      this.parseMXL(mxlText);
    };
    reader.readAsText(file);
  },

    parseMXL(mxlText) {
      console.log('Parsing MXL...');
      const lines = [];
      const rawLines = mxlText.split(/\r?\n/);
      let foundSection = false;

      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i].trim();

        if (line.includes('{1,1,')) {
          foundSection = true;
          continue;
        }
        if (foundSection) {
          if (line.startsWith('{"#","') && line.endsWith('"}')) {
            const content = line.slice(6, -2).trim();
            lines.push(content);
          }
          if (line === '}') {
            foundSection = false;
          }
        }
      }

      console.log('Lines для парсинга:', lines);

      const newEmployees = this.parseDepartmentsAndEmployees(lines);
      console.log('Найдено сотрудников:', newEmployees.length);
      console.log('Сотрудники:', newEmployees);

if (newEmployees.length > 0) {
  this.newEmployees = newEmployees; // сохраняем в состояние компонента
  this.addEmployeesMessage = `Найдено сотрудников: ${newEmployees.length}. Добавить?`;
  this.showAddEmployeesModal = true; // показываем модальное
}
    },

    parseDepartmentsAndEmployees(lines) {
      const departments = [];
      let currentDept = null;
      const employees = [];
      let zeroRecordSkipped = false; // флаг для пропуска первой записи "0"

      const findDepartment = (name) => departments.find(d => d.name === name);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Обнаружение названий отделов
        if (line && !line.match(/^\d+$/)) {
          currentDept = findDepartment(line);
          if (!currentDept) {
            currentDept = { name: line, employees: [] };
            departments.push(currentDept);
          }
          continue;
        }

        // Обработка строки с номером сотрудника
        if (line.match(/^\d+$/)) {
          const number = line;

          // Если это первая запись "0", пропускаем
          if (number === "0" && !zeroRecordSkipped) {
            zeroRecordSkipped = true; // отмечаем, что пропустили первую "0"
            i += 2; // пропускаем строки с ФИО и должностью
            continue; // пропускаем создание объекта
          }

          // Обработка остальных номеров
          const fio = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
          const positionLine = (i + 2 < lines.length) ? lines[i + 2].trim() : '';

          const position = (positionLine && !positionLine.match(/^\d+$/)) ? positionLine : '-';

          const fioParts = fio ? fio.split(' ') : [];

          // Создаем объект только если не пропустили
          const employee = {
            p_department: currentDept ? currentDept.name : '',
            p_email: '-',
            p_name: fioParts[1] || '',
            p_otdel: '-',
            p_patronymic: fioParts[2] || '',
            p_position: position,
            p_surname: fioParts[0] || '',
            p_tel: '-'
          };

          employees.push(employee);
          if (currentDept) {
            currentDept.employees.push(employee);
          }

          i += 2; // пропускаем строки с ФИО и должностью
        }
      }

      return employees;
    },

    handleFileUpload(xmlEvent) {
      const input = xmlEvent.target;
      const file = input.files[0];
      if (!file) return;

      input.value = '';

      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlText = e.target.result;
        this.parseXML(xmlText);
      };
      reader.readAsText(file);
    },

parseXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  // Проверка ошибок парсинга XML
  if (xmlDoc.getElementsByTagName("parsererror").length) {
    this.messageModalText = "Ошибка парсинга XML файла";
    this.showMessageModalС = true;
    return;
  }

  const ns = null; // если есть namespace, укажите его
  const root = ns
    ? xmlDoc.getElementsByTagNameNS(ns, "ОрганизационнаяСтруктура")[0]
    : xmlDoc.getElementsByTagName("ОрганизационнаяСтруктура")[0];

  if (!root) {
    this.messageModalText = "Некорректный формат файла";
    this.showMessageModalС = true;
    return;
  }

  const workers = ns
    ? root.getElementsByTagNameNS(ns, "Работник")
    : root.getElementsByTagName("Работник");

  const divisions = {};
  const klassifier = ns
    ? xmlDoc.getElementsByTagNameNS(ns, "Классификатор")[0]
    : xmlDoc.getElementsByTagName("Классификатор")[0];

  if (klassifier) {
    const divs = ns
      ? klassifier.getElementsByTagNameNS(ns, "Подразделение")
      : klassifier.getElementsByTagName("Подразделение");
    for (let div of divs) {
      const id = ns
        ? div.getElementsByTagNameNS(ns, "Ид")[0]?.textContent
        : div.getElementsByTagName("Ид")[0]?.textContent;
      const name = ns
        ? div.getElementsByTagNameNS(ns, "Наименование")[0]?.textContent
        : div.getElementsByTagName("Наименование")[0]?.textContent;
      if (id && name) {
        divisions[id] = name;
      }
    }
  }

  const newEmployees = [];
  for (let worker of workers) {
    const surname =
      ns && worker.getElementsByTagNameNS(ns, "Фамилия")[0]
        ? worker.getElementsByTagNameNS(ns, "Фамилия")[0].textContent
        : worker.getElementsByTagName("Фамилия")[0]?.textContent || '';

    const name =
      ns && worker.getElementsByTagNameNS(ns, "Имя")[0]
        ? worker.getElementsByTagNameNS(ns, "Имя")[0].textContent
        : worker.getElementsByTagName("Имя")[0]?.textContent || '';

    const patronymic =
      ns && worker.getElementsByTagNameNS(ns, "Отчество")[0]
        ? worker.getElementsByTagNameNS(ns, "Отчество")[0].textContent
        : worker.getElementsByTagName("Отчество")[0]?.textContent || '';

    const position =
      ns && worker.getElementsByTagNameNS(ns, "Должность")[0]
        ? worker.getElementsByTagNameNS(ns, "Должность")[0].textContent
        : worker.getElementsByTagName("Должность")[0]?.textContent || '';

    let email = "-";
    let tel = "-";
    const contacts = ns
      ? worker.getElementsByTagNameNS(ns, "Контакт")
      : worker.getElementsByTagName("Контакт");
    for (let contact of contacts) {
      const type =
        ns && contact.getElementsByTagNameNS(ns, "Тип")[0]
          ? contact.getElementsByTagNameNS(ns, "Тип")[0].textContent
          : contact.getElementsByTagName("Тип")[0]?.textContent;
      const value =
        ns && contact.getElementsByTagNameNS(ns, "Значение")[0]
          ? contact.getElementsByTagNameNS(ns, "Значение")[0].textContent
          : contact.getElementsByTagName("Значение")[0]?.textContent;
      if (type === "Почта" && value) email = value;
      if (type === "Телефон" && value) tel = value;
    }

    const divisionNodes = ns
      ? worker.getElementsByTagNameNS(ns, "Подразделение")
      : worker.getElementsByTagName("Подразделение");
    const divisionId = divisionNodes.length > 0 ? divisionNodes[0]?.textContent : '';
    const departmentName = divisions[divisionId] || "-";

    newEmployees.push({
      p_surname: surname,
      p_name: name,
      p_patronymic: patronymic,
      p_email: email,
      p_tel: tel,
      p_position: position,
      p_otdel: "-", // по выгрузке не идет
      p_department: departmentName
    });
  }

  if (newEmployees.length === 0) {
    this.messageModalText = "Не найдено сотрудников для добавления.";
    this.showMessageModalС = true;
    return;
  }

  // Запрос подтверждения
  this.newEmployees = newEmployees; // сохраняем для подтверждения
  this.messageModalText = `Найдено сотрудников: ${newEmployees.length} Добавить?`;
  this.showMessageModal = true;
},
async saveEmployeesToServer(employeesArray) {
  this.showProgress = true;
  this.progressMessage = 'Обработка данных...';

  try {
    this.progressMessage = 'Отправка данных на сервер...';

    const res = await fetch(`${this.apiUrl}/api/user/personal/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify(employeesArray)
    });
    const result = await res.json();

    if (res.ok) {
      const msg = result.message || '';
      const updateMatch = msg.match(/Обновлено сотрудников: (\d+)/);
      const addMatch = msg.match(/Добавлено сотрудников: (\d+)/);
      const updatedCount = updateMatch ? updateMatch[1] : '0';
      const addedCount = addMatch ? addMatch[1] : '0';

      this.progressMessage = `Обновлено сотрудников: ${updatedCount}, Добавлено сотрудников: ${addedCount}`;
      // После успешной отправки сразу перезагружаем список сотрудников
      this.loadEmployees();
    } else {
      this.progressMessage = 'Ошибка при сохранении сотрудников.';
    }
  } catch (err) {
    console.error('Ошибка при сохранении сотрудников:', err);
    this.progressMessage = 'Не удалось сохранить сотрудников.';
  } finally {
    // скрываем прогресс через 2 сек
    setTimeout(() => {
      this.showProgress = false;
    }, 1000);
  }
}
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadEmployees();
  }
};
</script>

<style>
#appTable td,
#appTable th {
  min-width: 20px; /* по необходимости */
}
#appTable thead tr {
  height: 30px !important;
}
#appTable tbody tr {
  height: 60px !important; /* если нужно оставить высоту тела */
}

/* стили для модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* чтобы было сверху остальных */
}
.modal-content-s {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease-out;
}

/* Заголовок модалки */
.modal-title {
  margin-bottom: 0px;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

/* Раскладка формы */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Сетка полей */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

/* Группы формы */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

/* Кнопки */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Анимация появления */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Обертка для двух полей на одной линии */
.flex-row-full-width {
  display: flex;
  gap: 15px;
  width: 100%;
}

/* Чтобы оба поля занимали равную ширину */
.flex-item {
  flex: 1;
  display: flex;
  flex-direction: column; /* для label и input */
}
.progress-container {
  width: 100%;
}
.delete-success-message {
  padding: 10px;
  background-color: #d4edda; /* зеленый фон для успеха */
  color: #155724; /* темно-зеленый текст */
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-top: 10px;
}
</style>

