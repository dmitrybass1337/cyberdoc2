<template>
  <div class="container mt-4">
    <h2 class="mb-4">Панель администратора</h2>
    <p>Управление учётными записями и глобальными справочниками.</p>

    <!-- Вкладки -->
<!-- Вкладки -->
<ul class="nav nav-tabs" id="adminTab" role="tablist">
  <!-- существующие вкладки -->
  <li class="nav-item" role="presentation">
    <button
      class="nav-link active"
      id="users-tab"
      data-bs-toggle="tab"
      data-bs-target="#users"
      type="button"
      role="tab"
      aria-controls="users"
      aria-selected="true"
    >
      Пользователи
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      id="dictionary-tab"
      data-bs-toggle="tab"
      data-bs-target="#dictionary"
      type="button"
      role="tab"
      aria-controls="dictionary"
      aria-selected="false"
    >
      Управление справочниками
    </button>
  </li>
  <!-- Вкладка "Документы" -->
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      id="documents-tab"
      data-bs-toggle="tab"
      data-bs-target="#documents"
      type="button"
      role="tab"
      aria-controls="documents"
      aria-selected="false"
    >
      Документы
    </button>
  </li>
  <!-- Новая вкладка "Средства защиты" -->
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      id="protection-tab"
      data-bs-toggle="tab"
      data-bs-target="#protection"
      type="button"
      role="tab"
      aria-controls="protection"
      aria-selected="false"
    >
      Средства защиты
    </button>
  </li>
</ul>
    <!-- Контент вкладок -->
    <div class="tab-content mt-3" id="adminTabContent">
<!-- Вкладка "Средства защиты" -->
<div
  class="tab-pane fade"
  id="protection"
  role="tabpanel"
  aria-labelledby="protection-tab"
>
  <h2 class="mt-4">Средства защиты</h2>
  <!-- Здесь разместите содержимое этой вкладки -->
  <p>Загрузка реестра сертифицированных СЗИ и СКЗИ.</p>
<!-- Прогрессбар -->
<div v-if="isUploading" class="progress mt-3" style="height: 20px;">
  <div
    class="progress-bar progress-bar-striped progress-bar-animated"
    role="progressbar"
    :style="{ width: uploadProgress + '%' }"
    :aria-valuenow="uploadProgress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    {{ uploadProgress }}%
  </div>
</div>
<!-- Форма загрузки файла -->
<div class="mb-3">
  <label for="csvFileInput" class="form-label">Загрузить файл .csv или .htm</label>
  <input
    type="file"
    placeholder="Загрузить базу сертифицированых СЗИ ФСТЭК или HTML"
    class="form-control"
    id="csvFileInput"
    accept=".csv,.htm"
    @change="handleFileUpload"
  />
</div>
  <p>Реестр сертифицированных СЗИ ФСТЭК можно взять на официальном сайте ФСТЭК и СКЗИ. Формат файл .csv</p>
<p>Реестр сертифицированных СКЗИ ФСБ можно взять на официальном сайте ФСБ. Формат файла .docx предварительно надо пересохранить в .htm</p>
  <!-- Например, формы, таблицы или другие компоненты -->
</div>
      <!-- Вкладка "Пользователи" -->
      <div
        class="tab-pane fade show active"
        id="users"
        role="tabpanel"
        aria-labelledby="users-tab"
      >
        <!-- Поле поиска -->
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск по логину, почте, Организации"
            v-model="searchQuery"
          />
        </div>
        <!-- Таблица пользователей -->
        <table v-if="users.length > 0" class="table table-striped table-bordered">
          <thead class="thead-dark table-info">
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Организация</th>
              <th class="text-center">Почта</th>
              <th @click="sortBy('role')" class="text-center" style="cursor:pointer;">
                Роль
                <span>{{ sortField==='role' ? (sortDirection==='asc' ? '⇈' : '⇊') : '⇅' }}</span>
              </th>
              <th>Сменить Роль</th>
              <th @click="sortBy('verified')" class="text-center" style="cursor:pointer;">
                Верифицировать
                <span>{{ sortField==='verified' ? (sortDirection==='asc' ? '⇈' : '⇊') : '⇅' }}</span>
              </th>
              <th @click="sortBy('blocked')" class="text-center" style="cursor:pointer;">
                Доступ
                <span>{{ sortField==='blocked' ? (sortDirection==='asc' ? '⇈' : '⇊') : '⇅' }}</span>
              </th>
              <th class="text-center">Пароль</th>
              <th class="text-center">Удалить</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td
                :style="{
                  color:
                    user.organization === 'Не заполнено' || !user.organization
                      ? 'red'
                      : 'green'
                }"
              >
                {{ user.organization || 'Не заполнено' }}
              </td>
              <td>{{ user.email }}</td>
              <td
                :style="{
                  color: user.role === 'admin' ? 'red' : 'green',
                  fontWeight: 'bold'
                }"
              >
                {{ user.role || 'Не указана' }}
              </td>
              <td>
                <div class="form-group mb-0">
                  <select
                    class="form-control form-control-sm"
                    v-model="user.role"
                    @change="changeUserRole(user.id, user.role)"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Админ</option>
                    <option value="expert">Эксперт</option>
                  </select>
                </div>
              </td>
              <!-- Подтверждение -->
              <td class="text-center">
                <button
                  v-if="!user.verified"
                  @click="verifyUser(user.id)"
                  class="btn btn-sm btn-primary"
                >
                  Одобрить
                </button>
                <span v-else class="text-success">✔</span>
              </td>
              <!-- Блокировка -->
              <td class="text-center">
                <button
                  @click="toggleUserBlock(user)"
                  :class="['btn btn-sm', user.blocked ? 'btn-danger' : 'btn-success']"
                >
                  {{ user.blocked ? '🛇' : '✓' }}
                </button>
              </td>
              <!-- Изменение пароля -->
              <td class="text-center">
                <button
                  class="btn btn-sm btn-warning"
                  @click="showChangePasswordForUser(user)"
                >
                  🔐
                </button>
              </td>
              <td class="text-center">
                <button
                  @click="deleteUser(user.id)"
                  class="btn btn-sm btn-danger"
                  title="Удалить пользователя"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="users.length === 0" class="text-center text-muted">
          Нет данных пользователей
        </div>
        <!-- Пагинация -->
        <div class="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button
            @click="prevPage"
            class="btn btn-outline-primary btn-sm"
            :disabled="currentPage === 1"
          >
            ❮
          </button>
          <span>
            Стр. {{ currentPage }} из {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            class="btn btn-outline-primary btn-sm"
            :disabled="currentPage === totalPages || totalPages === 0"
          >
            ❯
          </button>
        </div>
      </div>

      <!-- Вкладка "Управление справочниками" -->
      <div
        class="tab-pane fade"
        id="dictionary"
        role="tabpanel"
        aria-labelledby="dictionary-tab"
      >
        <!-- Управление справочниками -->
        <h2 class="mt-4">Управление глобальными справочниками</h2>
        <div class="d-flex align-items-center mb-3 gap-2">
          <label for="directoryTypeSelect" class="form-label mb-0"
            >Тип справочника:</label
          >
          <select
            id="directoryTypeSelect"
            v-model="selectedDictionaryType"
            @change="changeDictionaryType"
            class="form-select form-select-sm"
            style="width: auto;"
          >
            <option value="infoSysType">Тип информационной системы</option>
            <option value="securityLevel">Уровень защищённости</option>
            <option value="answers">Ответы</option>
            <option value="inet_answers">Доступ в интернет</option>
            <option value="regimIS">Режим обработки данных ИС</option>
            <option value="strukIS">Структура ИС</option>
            <option value="netType">Тип сетевого оборудования</option>
            <option value="cod_answers">Расположение ИС в ЦОД</option>
            <option value="typeArm">Тип АРМ</option>
            <option value="vidArm">Вид АРМ</option>
            <option value="typeSzi">Функции СЗИ</option>
            <option value="typeArch">Архитектура ПО</option>
            <option value="typeApp">Прикладное ПО</option>
            <option value="typeKomis">Тип комиссии</option>
            <!-- добавьте другие по необходимости -->
          </select>
        </div>

        <!-- Ввод нового значения -->
        <div class="input-group mb-3" style="max-width: 400px;">
          <input
            type="text"
            id="newDictionaryValue"
            class="form-control"
            placeholder="Новое значение"
            v-model="newDictionaryValue"
          />
          <button class="btn btn-primary" @click="addDictionaryValue">Добавить</button>
        </div>

        <!-- Таблица текущих значений -->
        <table
          id="dictionaryValuesTable"
          class="table table-striped table-bordered"
          style="margin-top:10px;"
        >
          <thead class="thead-dark" >
            <tr>
              <th>Значение</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in (dictionaries[selectedDictionaryType] || [])"
              :key="item.id"
              :data-id="item.id"
            >
              <td>{{ item.value }}</td>
              <td>
                <button
                  class="delete-dict-item btn btn-sm btn-danger"
                  :data-id="item.id"
                  title="Удалить"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Вкладка "Документы" -->
      <div
        class="tab-pane fade"
        id="documents"
        role="tabpanel"
        aria-labelledby="documents-tab"
      >
        <h2 class="mt-4">Управление шаблонами документов</h2>
        <!-- Форма добавления / редактирования шаблонов -->
        <div class="card mb-4">
          <div class="card-body">
            <h5>{{ isEditingTemplate ? 'Редактировать шаблон' : 'Добавить новый шаблон' }}</h5>
            <form @submit.prevent="isEditingTemplate ? updateTemplate() : addTemplate()">
              <!-- Используем currentTemplateData для v-model -->
              <div class="mb-3">
                <label class="form-label">Название шаблона</label>
                <input v-model="currentTemplateData.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Имя файла</label>
                <input v-model="currentTemplateData.file_name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Тип шаблона</label>
                <input v-model="currentTemplateData.template_type" class="form-control" required />
              </div>
<div class="mb-3">
  <label class="form-label">Обработка ПДн</label>
  <select v-model="currentTemplateData.system_pdn" class="form-control" :disabled="isSystemPdnDisabled" required>
    <option value="Да">Да</option>
    <option value="Нет">Нет</option>
  </select>
</div>
<div class="mb-3">
  <label class="form-label">Тип системы</label>
  <select v-model="currentTemplateData.system_type" class="form-control" required>
    <option value="ГИС">ГИС</option>
    <option value="ИСПДн">ИСПДн</option>
    <option value="АС">АС</option>
    <option value="ЗП">ЗП</option>
    <option value="КИИ">КИИ</option>
  </select>
</div>
              <button type="submit" class="btn btn-primary me-2">
                {{ isEditingTemplate ? 'Обновить' : 'Добавить' }}
              </button>
              <button v-if="isEditingTemplate" type="button" class="btn btn-secondary" @click="cancelEdit()">Отмена</button>
            </form>
          </div>
        </div>

        <!-- Список шаблонов -->
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Имя файла</th>
              <th>Тип шаблона</th>
              <th>Тип системы</th>
              <th>Обработка ПДн</th>		  
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tpl in templates" :key="tpl.id">
              <td>{{ tpl.id }}</td>
              <td>{{ tpl.name }}</td>
              <td>{{ tpl.file_name }}</td>
              <td>{{ tpl.template_type }}</td>
              <td>{{ tpl.system_type }}</td>
              <td>{{ tpl.system_pdn }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="editTemplate(tpl)">✎</button>
                <button class="btn btn-sm btn-danger" @click="deleteTemplate(tpl.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>

    <!-- Модальное окно для смены пароля -->
    <div
      class="modal fade"
      id="passwordModal"
      tabindex="-1"
      aria-labelledby="passwordModalLabel"
      aria-hidden="true"
      ref="passwordModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="passwordModalLabel">
              Смена пароля [{{ passwordModalUserName }}]
            </h5>
            <button type="button" class="btn-close" @click="closePasswordModal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <input
              type="password"
              class="form-control"
              v-model="newPassword"
              placeholder="Введите новый пароль"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closePasswordModal">Отмена</button>
            <button class="btn btn-primary" @click="changePassword">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      // ваши существующие свойства
      isSystemPdnDisabled: false, // по умолчанию разрешен
      users: [], // список пользователей
      currentPage: 1,
      recordsPerPage: 10,
      token: '',
      selectedUser: null,
      uploadProgress: 0, // прогресс загрузки в %
      isUploading: false, // флаг, что идет загрузка
      newPassword: '',
      searchQuery: '',
      sortField: 'verified',
      sortDirection: 'asc',
      // Справочники
      dictionaries: {},
      selectedDictionaryType: 'infoSysType',
      newDictionaryValue: '',
      apiUrl: '',
      passwordModalUserName: '',
      modalInstance: null,
      templates: [], // список шаблонов
      selectedTemplate: null, // шаблон для редактирования
      currentTemplateData: { name: '', file_name: '', template_type: '', system_type: '', system_pdn: '' }, // форма
      isEditingTemplate: false, // режим редактирования
    };
  },
  computed: {
    totalPages() {
      const filteredCount = this.users.filter(user => {
        const query = this.searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.organization && user.organization.toLowerCase().includes(query))
        );
      }).length;
      return Math.ceil(filteredCount / this.recordsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.recordsPerPage;
      const filtered = this.users.filter(user => {
        const query = this.searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.organization && user.organization.toLowerCase().includes(query))
        );
      });
      const sorted = filtered.slice().sort((a, b) => {
        if (!this.sortField) return 0;
        let aField = a[this.sortField];
        let bField = b[this.sortField];

        if (this.sortField === 'verified') {
          aField = aField ? 1 : 0;
          bField = bField ? 1 : 0;
        }

        if (typeof aField === 'string') {
          return this.sortDirection === 'asc'
            ? aField.localeCompare(bField)
            : bField.localeCompare(aField);
        } else {
          return this.sortDirection === 'asc'
            ? aField - bField
            : bField - aField;
        }
      });
      return sorted.slice(start, start + this.recordsPerPage);
    },
  },
  methods: {
  
parseHTMLContent(htmlText) {
  // Создаем DOM из текста HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const dataRecords = [];

  // Находим все таблицы на странице
  const tables = Array.from(doc.querySelectorAll('table'));
  console.log(`Найдено таблиц: ${tables.length}`);

  // Перебираем все таблицы
  tables.forEach((table, tableIndex) => {
    // Находим все строки таблицы
    const rows = Array.from(table.querySelectorAll('tr'));
    console.log(`Таблица ${tableIndex + 1}: строк ${rows.length}`);

    // Предположим, что первая строка — заголовки, пропускаем
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td'));

      // Проверка, что есть достаточное число ячеек
      if (cells.length < 4) {
        console.warn(`Строка ${i + 1} в таблице ${tableIndex + 1} содержит меньше 4 ячеек`);
        continue; // пропускаем
      }

      // Извлекаем текст из ячеек
      const certNumber = cells[0]?.textContent.trim();
      const certExpiryRaw = cells[1]?.textContent.trim();
      const nameRaw = cells[2]?.textContent.trim();
      const functionsRaw = cells[3]?.textContent.trim();

      // Обработка certExpiry: взять вторую дату после \n
      const expiryParts = certExpiryRaw.split('\n').map(s => s.trim()).filter(s => s);
      const certExpiry = expiryParts.length > 1 ? expiryParts[1] : expiryParts[0];

      // Обработка name: объединить все строки в одну
      const name = nameRaw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      // Обработка functions: объединить все строки в одну
      const functions = functionsRaw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      // Проверка, что есть все необходимые данные
      if (certNumber && certExpiry && name && functions) {
        dataRecords.push({
          certNumber,
          certExpiry,
          name,
          functions,
          manufacturer: '',
          tpExpiry: null,
          certOrgan: 'ФСБ'
        });
      } else {
        console.warn(`Пустые данные в строке ${i + 1} таблицы ${tableIndex + 1}`);
      }
    }
  });

  console.log('Извлеченные данные:', dataRecords);

  // Теперь вызываем отправку данных
  this.sendProtectionData(dataRecords, true); // true — сырые данные
},  
handleFileUpload(event) {
  const input = event.target;


  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    const arrayBuffer = e.target.result;
    let decoder;

    // Определяем кодировку в зависимости от расширения файла
    if (file.name.endsWith('.htm')) {
      decoder = new TextDecoder('windows-1251'); // для HTML-файлов
    } else {
      decoder = new TextDecoder('utf-8'); // для CSV и других
    }

    const text = decoder.decode(arrayBuffer);

    // Обработка текста
    if (file.name.endsWith('.htm') || file.type === 'text/html') {
      this.parseHTMLContent(text);
    } else {
      this.parseCSV(text);
    }
  };

  reader.readAsArrayBuffer(file);
  // сбрасываем значение, чтобы при повторном выборе того же файла сработал change
  input.value = '';
},
parseCSV(csvText) {
  // Простая парсинг CSV, без внешних библиотек
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    alert('Файл пуст или содержит только заголовки');
    return;
  }

  // Получаем заголовки
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  // Объединяем два соседних заголовка, связанные запятой внутри кавычек
  headers[4] = headers[4] + ', ' + headers[5];
  headers.splice(5, 1); // Удаляем второй элемент
  headers.splice(9, 1); // Удаляем второй элемент
  headers.splice(10, 1); // Удаляем второй элемент

  headers[10] = headers[10] + ', ' + headers[11];
  headers.splice(11, 1); // Удаляем второй элемент
  console.log('Обновленные заголовки CSV:', headers);
  const dataLines = lines.slice(1);
  const records = dataLines.map(line => {
    // Разделение по запятой, учитывая кавычки
    const values = this.parseCSVLine(line);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    return record;
  });

  // После парсинга вызываем отправку данных на сервер
this.sendProtectionData(records, false); // false — данные из CSV, нуждается в 
},

parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map(val => val.replace(/"/g, '').trim());
},

async sendProtectionData(records, isRaw = false) {
  const chunkSize = 200;
  const total = records.length;
  this.isUploading = true;
  this.uploadProgress = 0;

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);

    // В зависимости от isRaw применяем преобразование или нет
    const formattedChunk = isRaw
      ? chunk
      : chunk.map(item => ({
          certNumber: item['№ сертификата'],
          certExpiry: item['Срок действия сертификата'],
          name: item['Наименование средства (шифр)'],
          functions: item['Наименования документов, требованиям которых соответствует средство'],
          manufacturer: item['Заявитель'],
          tpExpiry: item['Информация об окончании срока технической поддержки, полученная от заявителя'],
          certOrgan: 'ФСТЭК'
        }));
console.log(formattedChunk);
    try {
      const response = await fetch(`${this.apiUrl}/api/admin/protection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify({ data: formattedChunk })
      });
      if (!response.ok) {
        const text = await response.text();
        let errorMsg = text;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.error || text;
        } catch (e) {
          console.error('Ошибка:', e);
        }
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error(`Ошибка при отправке части ${i / chunkSize + 1}:`, err);
      alert(`Ошибка при отправке части ${i / chunkSize + 1}: ${err.message}`);
      this.isUploading = false;
      return;
    }
    this.uploadProgress = Math.min(100, Math.round(((i + chunkSize) / total) * 100));
  }

  this.isUploading = false;
},
    async loadAllUsers() {
      // Загрузка пользователей
      try {
        const res = await fetch(`${this.apiUrl}/api/admin/users`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        this.users = await res.json();
        this.currentPage = 1;
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },
async changeUserRole(userId, newRole) {
  const adminCount = this.users.filter(u => u.role === 'admin').length;
  console.log(adminCount);
  const user = this.users.find(u => u.id === userId);
  if (adminCount < 1) {
    alert('Нельзя изменить роль последнего администратора.');
	user.role = 'admin';
    return;
  }
  // остальной код метода
  try {
    const response = await fetch(`${this.apiUrl}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify({ role: newRole })
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    if (user) user.role = newRole;
    alert('Роль успешно изменена');
  } catch (err) {
    console.error('Ошибка изменения роли:', err);
  }
},
    async toggleUserBlock(user) {
      try {
        const newBlockedStatus = !user.blocked;
        const res = await fetch(`${this.apiUrl}/api/admin/users/${user.id}/toggle-block`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: JSON.stringify({ blocked: newBlockedStatus })
        });
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const result = await res.json();
        user.blocked = result.blocked;
      } catch (err) {
        console.error('Ошибка при блокировке/разблокировке:', err);
        alert('Ошибка при смене статуса блокировки');
      }
    },
showChangePasswordForUser(user) {
  this.selectedUser = user;
  this.newPassword = '';
  this.passwordModalUserName = user.username; // присваиваем имя пользователя

  const modalEl = this.$refs.passwordModal;
  if (modalEl) {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.modalInstance = new Modal(modalEl);
    this.modalInstance.show();
  } else {
    console.error('Modal DOM-элемент не найден');
  }
},
    closePasswordModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
        this.modalInstance = null;
      }
      this.selectedUser = null;
      this.newPassword = '';
    },
    async changePassword() {
      if (!this.newPassword || !this.selectedUser) return;
      try {
        const res = await fetch(`${this.apiUrl}/api/admin/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: JSON.stringify({ userId: this.selectedUser.id, newPassword: this.newPassword })
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || res.statusText);
        }
        alert('Пароль успешно изменен');
        this.closePasswordModal();
      } catch (err) {
        console.error('Ошибка смены пароля:', err);
        alert('Ошибка при смене пароля: ' + err.message);
      }
    },
    async verifyUser(userId) {
      try {
        const response = await fetch(`${this.apiUrl}/api/admin/verify/${userId}`, {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const user = this.users.find(u => u.id === userId);
        if (user) user.verified = true;
        alert('Пользователь подтвержден');
      } catch (err) {
        console.error('Ошибка подтверждения пользователя:', err);
      }
    },
async deleteUser(userId) {
  const user = this.users.find(u => u.id === userId);
  if (user && user.role === 'admin') {
    const adminCount = this.users.filter(u => u.role === 'admin').length;
    if (adminCount === 1) {
      alert('Нельзя удалить последнего администратора.');
      return;
    }
  }
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
  try {
    const response = await fetch(`${this.apiUrl}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
    this.users = this.users.filter(u => u.id !== userId);
    if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
      this.currentPage--;
    }
    alert('Пользователь успешно удален');
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
    alert('Ошибка при удалении пользователя: ' + err.message);
  }
},
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    // --- Работа со справочниками ---
async loadDictionaryValues(type) {
  try {
    const res = await fetch(`${this.apiUrl}/api/admin/dictionaries/${type}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const data = await res.json();
    this.dictionaries[type] = data; // Обновляем реактивно свойство
  } catch (err) {
    console.error('Ошибка получения данных справочника:', err);
  }
},
    async changeDictionaryType() {
      await this.loadDictionaryValues(this.selectedDictionaryType);
    },
    async addDictionaryValue() {
      const type = this.selectedDictionaryType;
      const value = this.newDictionaryValue.trim();
      if (!value) return;

      const existingValues = this.dictionaries[type] || [];
      const alreadyExists = existingValues.some(
        (item) => item.value.toLowerCase() === value.toLowerCase()
      );
      if (alreadyExists) {
        alert('Это значение уже существует в справочнике.');
        return;
      }

      try {
        const res = await fetch(
          `${this.apiUrl}/api/admin/dictionaries/${type}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify({ value }),
          }
        );
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        await this.loadDictionaryValues(type);
        this.newDictionaryValue = '';
      } catch (err) {
        console.error('Ошибка добавления значения:', err);
      }
    },
    async deleteDictionaryItem(id) {
      const type = this.selectedDictionaryType;
      if (!confirm('Вы уверены, что хотите удалить это значение?')) return;
      try {
        const res = await fetch(
          `${this.apiUrl}/api/admin/dictionaries/${type}/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + this.token,
            },
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || res.statusText);
        }
        await this.loadDictionaryValues(type);
        alert('Значение успешно удалено');
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Ошибка при удалении: ' + err.message);
      }
    },

    // --- УПРАВЛЕНИЕ ШАБЛОНАМИ ---
    async loadTemplates() {
      try {
        const res = await fetch(`${this.apiUrl}/api/admin/templates`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        this.templates = await res.json();
      } catch (err) {
        console.error('Ошибка загрузки шаблонов:', err);
      }
    },

    openAddTemplate() {
      this.currentTemplateData = { name: '', file_name: '', template_type: '', system_type: '', system_pdn: '' };
      this.isEditingTemplate = false;
    },

    async addTemplate() {
      try {
        await fetch(`${this.apiUrl}/api/admin/templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
          body: JSON.stringify(this.currentTemplateData)
        });
        await this.loadTemplates();
        this.cancelEdit();
      } catch (err) {
        console.error('Ошибка добавления шаблона:', err);
      }
    },

    editTemplate(tpl) {
      this.selectedTemplate = { ...tpl };
      this.currentTemplateData = { ...tpl }; // копия для формы
      this.isEditingTemplate = true;
    },

    async updateTemplate() {
      try {
        await fetch(`${this.apiUrl}/api/admin/templates/${this.selectedTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
          body: JSON.stringify(this.currentTemplateData)
        });
        await this.loadTemplates();
        this.cancelEdit();
      } catch (err) {
        console.error('Ошибка обновления шаблона:', err);
      }
    },

    async deleteTemplate(id) {
      if (!confirm('Вы уверены, что хотите удалить этот шаблон?')) return;
      try {
        await fetch(`${this.apiUrl}/api/admin/templates/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        await this.loadTemplates();
      } catch (err) {
        console.error('Ошибка удаления шаблона:', err);
      }
    },

cancelEdit() {
  this.selectedTemplate = null;
  this.isEditingTemplate = false;
  this.currentTemplateData = {
    name: '',
    file_name: '',
    template_type: '',
    system_type: '',
    system_pdn: ''
  };
},

    handleDictTableClick(event) {
      if (event.target.matches('.delete-dict-item')) {
        const id = event.target.getAttribute('data-id');
        this.deleteDictionaryItem(id);
      }
    },
  },
  mounted() {
    this.token = localStorage.getItem('token') || '';
    this.apiUrl = this.$API_URL;
    this.loadAllUsers();
    this.loadDictionaryValues(this.selectedDictionaryType);
    this.loadTemplates(); // загрузка шаблонов
    document
      .querySelector('#dictionaryValuesTable tbody')
      .addEventListener('click', this.handleDictTableClick);
  },
  watch: {
  'currentTemplateData.system_type'(newVal) {
    if (newVal === 'ИСПДн') {
      this.currentTemplateData.system_pdn = 'Да';
      this.isSystemPdnDisabled = true; // флаг для disabled
    } else {
      this.isSystemPdnDisabled = false;
    }
  }
},
};
</script>