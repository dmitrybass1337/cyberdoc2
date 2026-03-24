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
<p style="text-align: center; color: #008CBA; font-weight: bold;">ПРИКЛАНОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ</p>
     <label for="selectInformationSystem" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInformationSystem" @change="onSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>
<div v-if="applicationSoftware.length > 0" class="mt-2 d-flex justify-content-between align-items-center">
  <input v-model="searchQuery" placeholder="Поиск по названию" class="form-control" />
  <button @click="deleteAllApplicationSoftware(this.selectedSystemId)" class="btn btn-danger btn-sm" style="height: 38px;">
    Удалить
  </button>
</div>
<div style="margin-bottom: 5px;"></div>
    <!-- Таблица справочника -->
    <table id="appTable"  class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
      <thead>
        <tr class="table-primary">
          <th>Название ПО</th>
          <!-- <th>Архитектура</th> -->
          <!-- <th>Серт. ФСТЭК</th> -->
          <!-- <th>Производитель</th> -->
          <th>Версия</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="applicationSoftware.length === 0">
          <td colspan="3" class="text-center">Нет прикладного ПО для выбранной системы</td>
        </tr>
		<tr v-for="item in paginatedApplicationSoftware" :key="item.id">
          <td>{{ item.app_name }}</td>
          <!-- <td>{{ item.app_architecture }}</td> -->
          <!-- <td>{{ item.app_certification }}</td> -->
          <!-- <td>{{ item.app_manufacturer }}</td> -->
          <td>{{ item.app_version }}</td>
          <td>
            <button @click="editApplicationSoftware(item.id)" class="btn btn-info btn-sm"><i class="fa fa-pencil"></i></button>
            <button @click="deleteApplicationSoftware(item.id)" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

<div class="d-flex justify-content-center align-items-center mt-3">
  <button class="btn btn-outline-primary btn-sm me-2" @click="prevPage" :disabled="currentPage === 1">&laquo;</button>
  <span>{{ currentPage }} из {{ totalPages }}</span>
  <button class="btn btn-outline-primary btn-sm ms-2" @click="nextPage" :disabled="currentPage === totalPages">&raquo;</button>
</div>
    <!-- Форма добавления/редактирования -->
<!-- Форма добавления/редактирования -->
<form v-if="showForm" @submit.prevent="saveApplicationSoftware" class="card p-4" style="max-width: auto; margin: 20px auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 10px; transition: box-shadow 0.3s;">
  <h5 class="mb-4 text-center" style="color: #2c3e50;">{{ form.id ? 'Редактировать ПО' : 'Добавить новое ПО' }}</h5>
  <div class="mb-3">
    <label for="app_name" class="form-label fw-semibold">Название ПО</label>
    <input list="appNames" id="app_name" v-model="form.app_name" placeholder="Введите название ПО или выберите из справочника" class="form-control" required />
    <datalist id="appNames">
      <option v-for="name in appNames" :key="name" :value="name"></option>
    </datalist>
  </div>
  <div class="mb-3">
    <label for="app_architecture" class="form-label fw-semibold">Архитектура</label>
    <select id="app_architecture" v-model="form.app_architecture" class="form-select" required>
      <option v-for="arch in dictionaries.typeArch" :key="arch.value" :value="arch.value">{{ arch.value }}</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="app_certification" class="form-label fw-semibold">Сертификация ФСТЭК/ФСБ</label>
    <select id="app_certification" v-model="form.app_certification" class="form-select" required>
      <option v-for="cert in dictionaries.answers" :key="cert.value" :value="cert.value">{{ cert.value }}</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="app_manufacturer" class="form-label fw-semibold">Производитель</label>
    <input type="text" id="app_manufacturer" v-model="form.app_manufacturer" placeholder="Производитель" class="form-control" required />
  </div>
  <div class="mb-3">
    <label for="app_version" class="form-label fw-semibold">Версия</label>
    <input type="text" id="app_version" v-model="form.app_version" placeholder="Версия" class="form-control" required />
  </div>
    <!-- Кнопки -->
          <div style="display: flex; justify-content: flex-end; margin-top: 20px; gap: 10px;">
            <button class="btn btn-success" type="submit">Сохранить</button>
            <button class="btn btn-danger" @click="cancelEdit" type="button">Отмена</button>
          </div>

</form>
<br />
<div v-if="importProgressPercent > 0" class="mt-3">
  <div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{ width: importProgressPercent + '%' }" :aria-valuenow="importProgressPercent" aria-valuemin="0" aria-valuemax="100">
    </div>
  </div>
</div>
<!-- загрузка из файла AIDA64 [.htm] -->
<div v-if="systems.length > 0 && selectedSystemId && !showForm" style="margin-top: 5px; text-align: right;" class="input-group mb-2">
  <input type="file" @change="onHtmlFilesChange" accept=".htm,.html" multiple class="d-none" id="fileInput2" />
  <input type="text" class="form-control" placeholder="Выгрузка из AIDA64 [.htm]" readonly aria-label="Выбор файла" />
  <button class="btn btn-primary" type="button" onclick="document.getElementById('fileInput2').click();">Загрузить файлы</button>
</div>
<!-- загрузка из файла MaxPatrolVM [.xml] -->
<div v-if="systems.length > 0 && selectedSystemId && !showForm" style="margin-top: 5px; text-align: right;" class="input-group mb-2">
  <!-- Это скрытый input для файла (если хотите оставить загрузку через кнопку) -->
  <input type="file" @change="onFileChange" accept=".xml" class="d-none" id="fileInput" />
  <!-- Текстовая часть с подписью -->
  <input type="text" class="form-control" placeholder="Выгрузка из MaxPatrolVM [.xml]" readonly aria-label="Выбор файла" />
  <!-- Кнопка для открытия диалога выбора файла -->
  <button  class="btn btn-primary" type="button" onclick="document.getElementById('fileInput').click();">Загрузить файл</button>
</div>

<!-- загрузка из файла Альфа [.json] -->
<!-- загрузка из файла Альфа [.json], разрешены несколько файлов -->
<div v-if="systems.length > 0 && selectedSystemId && !showForm" style="margin-top: 5px; text-align: right;" class="input-group mb-2">
  <input type="file" @change="onAlfaFileChange" accept=".json" class="d-none" id="fileInputAlfa" multiple />
  <input type="text" class="form-control" placeholder="Выгрузка из Альфа [.json]" readonly aria-label="Выбор файла" />
  <button class="btn btn-primary" type="button" onclick="document.getElementById('fileInputAlfa').click();">Загрузить файлы</button>
  <p> </p> <br />
  <div v-if="importProgressPercent > 0" class="mt-3">
    <!-- прогресс бар или сообщение -->
  </div>
</div>

<!-- Кнопка добавления ручное -->
<div v-if="systems.length > 0 && selectedSystemId && !showForm" style="margin-top: 20px; text-align: right;">
  <button @click="showAddForm" class="btn btn-primary">Добавить Вручную</button>
</div>


  </div>
</div>
</template>

<script>
//import jschardet from 'jschardet';
export default {
  data() {
    return {
    importProgress: null,    // прогресс (можно использовать для отображения прогресс-бара)
    importStatusMessage: '', // сообщение о ходе процесса
    importProgressPercent: 0, // прогресс в %
    importResults: {
      added: 0,
      updated: 0,
      skipped: 0,
    },
      searchQuery: '',
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      systems: [], // список систем
      selectedSystemId: null,
      applicationSoftware: [], // список прикладного ПО
      applicationSoftwareDict: [], // полный массив данных
      currentSystemIType: null,
      apiUrl: '',
      showForm: false,
      form: {
        id: null,
        app_name: '',
        app_architecture: '',
        app_certification: '',
        app_manufacturer: '',
        app_version: '',
      },
      dictionaries: {
        typeArch: [],
        answers: [],
      },
      appNames: [], // список названий ПО для datalist
      token: localStorage.getItem('token') || '',
    };
  },
  created() {
    this.apiUrl = this.$API_URL;
    this.loadInitialData();
  },
computed: {
  // существующие
  paginatedApplicationSoftware() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredApplicationSoftware.slice(start, end);
  },
  totalPages() {
    return Math.ceil(this.filteredApplicationSoftware.length / this.itemsPerPage);
  },
  // объединяем фильтр
  filteredApplicationSoftware() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.applicationSoftware;
    }
    return this.applicationSoftware.filter(item => {
      const nameMatch = item.app_name.toLowerCase().includes(query);
      // const vendorMatch = item.app_manufacturer.toLowerCase().includes(query);
      // return nameMatch || vendorMatch;
      return nameMatch;
    });
  },
},
  watch: {
    searchQuery() {
      this.currentPage = 1;
    }
  },
async mounted() {
  await this.loadInitialData(); // Загружает системы и словари

  const savedId = localStorage.getItem('selectedSystemId');
  if (savedId !== null) {
    this.selectedSystemId = Number(savedId);
  }

  // Проверяем, есть ли такой ID в списке систем
  if (this.selectedSystemId && this.systems.some(s => s.id === this.selectedSystemId)) {
    this.loadApplicationSoftware(this.selectedSystemId);
  } else if (this.systems.length > 0) {
    // Устанавливаем первый системный ID по умолчанию
    this.selectedSystemId = this.systems[0].id;
    this.loadApplicationSoftware(this.selectedSystemId);
  }
},
  methods: {


  async deleteAllApplicationSoftware(systemId) {
    if (confirm('Вы уверены, что хотите удалить всё прикладное ПО для выбранной системы?')) {
      try {
        const response = await fetch(`${this.apiUrl}/api/user/applicationSoftware?systemId=${systemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        if (response.ok) {
          await this.loadApplicationSoftware(this.selectedSystemId);
          alert('Все прикладные ПО успешно удалены.');
        } else {
          alert('Не удалось удалить прикладное ПО.');
        }
      } catch (err) {
        console.error('Ошибка при удалении всего прикладного ПО:', err);
        alert('Произошла ошибка при удалении.');
      }
    }
  },
async onAlfaFileChange(event) {
  this.loadingFile = true;
  this.importProgressPercent = 0;
  this.importStatusMessage = '';

  const files = Array.from(event.target.files); // все выбранные файлы
  if (files.length === 0) {
    this.loadingFile = false;
    return;
  }

  let totalFiles = files.length;
  let processedCount = 0;

  // Итоговые счетчики
  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    try {
      const content = await file.text();

      // Парсим JSON
      const data = JSON.parse(content);
      if (!data || !data.app_list || !Array.isArray(data.app_list)) {
        alert(`Некорректный формат файла: ${file.name}`);
        continue; // переходим к следующему
      }

      const appList = data.app_list;
      if (appList.length === 0) {
        alert(`В файле "${file.name}" "app_list" пустой.`);
        continue; // переходим к следующему
      }

      // Определяем ОС
      const osInfo = data?.tech?.os;
      console.log('osInfo:', osInfo);
      let isLinux = false;

      if (osInfo && osInfo.linux) {
        isLinux = true;
      }

      // Если Linux, находим минимальную дату
      let minDate = null;
      if (isLinux) {
        const installDates = [];
        for (const item of appList) {
          if (item.install_date) {
            const date = new Date(item.install_date);
            if (!isNaN(date)) {
              installDates.push(date);
            }
          }
        }
        minDate = installDates.length > 0 ? new Date(Math.min(...installDates)) : null;
      }

      // Фильтруем app_list только если ОС Linux
      const filteredAppList = appList.filter(item => {
        if (isLinux && item.install_date && minDate) {
          const itemDate = new Date(item.install_date);
          if (!isNaN(itemDate) && itemDate.getTime() === minDate.getTime()) {
            return false; // исключаем
          }
        }
        return true; // оставляем
      });

      // Подтверждение
      if (!confirm(`Добавить ${filteredAppList.length} программ из файла "${file.name}"?`)) {
        continue; // следующий файл
      }

      // Обрабатываем отфильтрованный список
      for (let i = 0; i < filteredAppList.length; i++) {
        const item = filteredAppList[i];

        // обновляем прогресс
        this.importProgressPercent = Math.round(((processedCount + i + 1) / totalFiles / filteredAppList.length) * 100);
        this.importStatusMessage = `Обработка "${item.name || 'Без названия'}"...`;

        const program = {
          id: null,
          app_name: item.name || 'Без названия',
          app_architecture: '-',
          app_certification: '-',
          app_manufacturer: '-',
          app_version: item.version || '-',
        };

        try {
          const res = await fetch(`${this.apiUrl}/api/user/applicationSoftware`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify({ ...program, systemId: this.selectedSystemId }),
          });
          const dataRes = await res.json();

          if (res.ok) {
            addedCount++;
          } else {
            if (dataRes.message && dataRes.message.includes('уже существует')) {
              updatedCount++;
            } else {
              skippedCount++;
            }
          }
        } catch (err) {
          skippedCount++;
          console.error(`Ошибка сети при добавлении "${program.app_name}":`, err);
        }
      }
    } catch (e) {
      console.error(`Ошибка обработки файла: ${file.name}`, e);
    }
    processedCount++;
    this.importProgressPercent = Math.round((processedCount / totalFiles) * 100);
  }

  this.importStatusMessage = `Обработка файлов завершена. Обработано: ${processedCount} из ${totalFiles}.`;
  alert(`Обработка завершена!\nДобавлено: ${addedCount}\nОбновлено: ${updatedCount}\nПропущено: ${skippedCount}`);
  this.loadApplicationSoftware(this.selectedSystemId);
  event.target.value = '';
  this.importProgressPercent = 0;
},

async onHtmlFilesChange(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  this.loading = true;
  this.importProgressPercent = 0;
  this.importStatusMessage = '';

  let totalFiles = files.length;
  let processedCount = 0;

  let totalAdded = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const file of files) {
    try {
      const result = await this.processHtmlFile(file);
      totalAdded += result.added;
      totalUpdated += result.updated;
      totalSkipped += result.skipped;
    } catch (err) {
      console.error('Ошибка обработки файла:', file.name, err);
    }
    processedCount++;
    this.importProgressPercent = Math.round((processedCount / totalFiles) * 100);
  }

  this.importStatusMessage = `Обработка файлов завершена. Обработано: ${processedCount} из ${totalFiles}.`;
  this.loading = false;

  // Показываем один итоговый алерт
  alert(`Обработка завершена!\nДобавлено: ${totalAdded}\nОбновлено: ${totalUpdated}\nПропущено: ${totalSkipped}`);

  // Обновляем список ПО
  this.loadApplicationSoftware(this.selectedSystemId);
  event.target.value = '';
  this.importProgressPercent = 0;
},

async processHtmlFile(file) {
  const arrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

  const uint8Array = new Uint8Array(arrayBuffer);

  const decodeWithEncoding = (encoding) => {
    try {
      const decoder = new TextDecoder(encoding);
      return decoder.decode(uint8Array);
    } catch (e) {
      console.error(`Ошибка декодирования с ${encoding}:`, e);
      return null;
    }
  };

  let text = decodeWithEncoding('windows-1251');
  const containsProgramKeyword = text && text.toLowerCase().includes('программа');

  if (!containsProgramKeyword) {
    text = decodeWithEncoding('utf-8');
  }
  if (!containsProgramKeyword) {
    text = decodeWithEncoding('unicode');
  }

  if (!text || !text.toLowerCase().includes('программа')) {
    // Не показываем alert тут
    return { programs: [], added: 0, updated: 0, skipped: 0 };
  }

  const programs = await this.parseHtmlReport(text);

  return { programs, added: 0, updated: 0, skipped: 0 };
},

// Обработчик выбора файла HTML
onHtmlFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = async (e) => {
    const arrayBuffer = e.target.result; // ArrayBuffer
    const uint8Array = new Uint8Array(arrayBuffer);

    // Функция для декодирования и проверки содержимого
    const decodeWithEncoding = (encoding) => {
      try {
        const decoder = new TextDecoder(encoding);
        const text = decoder.decode(uint8Array);
        return text;
      } catch (e) {
        console.error(`Ошибка декодирования с ${encoding}:`, e);
        return null;
      }
    };

    // Попытка декодировать в windows-1251
    let text = decodeWithEncoding('windows-1251');

    // Проверка, содержит ли текст ключевые слова
    const containsProgramKeyword = text && text.toLowerCase().includes('программа');

    if (!containsProgramKeyword) {
      // Если не содержит, пробуем utf-8
      text = decodeWithEncoding('utf-8');
    }

    if (!containsProgramKeyword) {
      // Если не содержит, пробуем unicode
      text = decodeWithEncoding('unicode');
    }
    
    if (!text || !text.toLowerCase().includes('программа')) {
      alert('Не удалось распознать содержимое файла или в файле отсутствует ожидаемый текст.');
      // Сбросить значение input, чтобы можно было выбрать тот же файл повторно
      event.target.value = '';
      return;
    }

    console.log('Файл прочитан, начинаю парсинг...');
    this.parseHtmlReport(text);
    // После обработки сбрасываем значение файла
    event.target.value = '';
  };

  reader.readAsArrayBuffer(file);
  this.importProgressPercent = 0;
},

// Парсинг HTML и извлечение программ
parseHtmlReport(htmlString) {
  // Инициализация индексов колонок
  let Indx_App = -1;
  let Indx_Ver = -1;
  let Indx_Vendor = -1;

  console.log('Начинаю парсинг отчета...');
  this.loading = true; // старт загрузки
  let programs = []; // массив для результатов

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Находим все таблицы
    const allTables = Array.from(doc.getElementsByTagName('table'));

    // Ищем таблицу с <b>Программа</b>
    let targetTable = null;
    for (const table of allTables) {
      const bolds = Array.from(table.getElementsByTagName('b'));
      if (bolds.some(b => b.textContent.trim().toLowerCase() === 'программа')) {
        targetTable = table;
        console.log('Найдена таблица с <b>Программа</b>');
        break;
      }
    }

    if (!targetTable) {
      // Удаляем alert
      // alert('Таблица с <b>Программа</b> не найдена');
      return;
    }

    // Обрабатываем найденную таблицу
    const rows = Array.from(targetTable.getElementsByTagName('tr'));

    // Обнаружение индексов колонок
    const headerRow = Array.from(rows).find(row => {
      const cells = Array.from(row.children);
      return cells.some(cell => {
        const bolds = cell.getElementsByTagName('b');
        const text = bolds.length > 0
          ? Array.from(bolds).map(b => b.innerText.trim()).join(' ')
          : cell.innerText.trim();
        return text.toLowerCase().includes('программа');
      });
    });

    if (headerRow) {
      const headerCells = Array.from(headerRow.children);
      // Определение индексов колонок
      headerCells.forEach((cell, index) => {
        const bolds = cell.getElementsByTagName('b');
        const headerText = bolds.length > 0
          ? Array.from(bolds).map(b => b.innerText.trim()).join(' ')
          : cell.innerText.trim();

        const lowerHeader = headerText.toLowerCase();
        if (lowerHeader.includes('программа')) {
          Indx_App = index;
        } else if (lowerHeader.includes('версия')) {
          Indx_Ver = index;
        } else if (lowerHeader.includes('издатель')) {
          Indx_Vendor = index;
        }
      });

      console.log(`Индексы колонок:`);
      console.log(`Программа: ${Indx_App}`);
      console.log(`Версия: ${Indx_Ver}`);
      console.log(`Издатель: ${Indx_Vendor}`);
    } else {
      // alert('Не удалось найти строку с заголовками таблицы');
      return;
    }

    // Обработка строк таблицы
    for (const row of rows) {
      const cells = Array.from(row.getElementsByTagName('td'));
      if (Indx_App !== -1 && Indx_Ver !== -1 && Indx_Vendor !== -1) {
        if (cells.length > Math.max(Indx_App, Indx_Ver, Indx_Vendor)) {
          const app_name = cells[Indx_App]?.innerText.trim() || '';
          const app_version = cells[Indx_Ver]?.innerText.trim() || '';
          const app_manufacturer = cells[Indx_Vendor]?.innerText.trim() || '';

          // пропускаем заголовочные строки
          if (app_name.toLowerCase() === 'программа' || app_name.toLowerCase().includes('программа')) {
            continue;
          }

          if (app_name !== '') {
            const program = {
              id: null,
              app_name,
              app_architecture: '-', // при необходимости
              app_certification: 'Нет',
              app_manufacturer,
              app_version,
              // остальные поля
            };
            programs.push(program);
          }
        }
      }
    }

    // Если есть программы, предлагаем добавить
    if (programs.length > 0 && confirm(`Добавить ${programs.length} программ из отчёта?`)) {
      let addedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      const promises = programs.map(program => {
        const payload = {
          ...program,
          systemId: this.selectedSystemId,
        };
        return fetch(`${this.apiUrl}/api/user/applicationSoftware`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
          },
          body: JSON.stringify(payload),
        }).then(res => res.json().then(data => ({ res, data })))
          .then(({ res, data }) => {
            if (res.ok) {
              addedCount++;
            } else {
              if (data.message && data.message.includes('уже существует')) {
                updatedCount++;
              } else {
                skippedCount++;
              }
            }
          });
      });

      Promise.all(promises).then(() => {
        // В конце выводим один итог
        alert(`Обработка завершена!\nДобавлено: ${addedCount}\nОбновлено: ${updatedCount}\nПропущено: ${skippedCount}`);
        this.loadApplicationSoftware(this.selectedSystemId);
      });
    } else {
      // alert('Добавление отменено.');
    }

  } catch (e) {
    console.error('Ошибка парсинга:', e);
  } finally {
    this.loading = false; // конец загрузки
  }
},

  // Метод для отправки данных о ПО в API
  saveSoftwareFromReport(program) {
    const payload = {
      ...program,
      systemId: this.selectedSystemId,
    };
    fetch(`${this.apiUrl}/api/user/applicationSoftware`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.message && data.message.includes('уже существует')) {
        // Уже есть
        console.log(`ПО "${program.app_name}" уже существует`);
      } else {
        console.log(`ПО "${program.app_name}" добавлено`);
      }
      // Обновляем список ПО
      this.loadApplicationSoftware(this.selectedSystemId);

    })
    .catch(err => console.error('Ошибка добавления ПО:', err));
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
async loadInitialData() {
  await this.loadSystems();
  await this.loadDictionaries();
  if (this.systems.length > 0) {
    const savedId = localStorage.getItem('selectedSystemId');
    if (savedId && this.systems.some(s => s.id === Number(savedId))) {
      this.selectedSystemId = Number(savedId);
    } else {
      this.selectedSystemId = this.systems[0].id;
    }
    await this.loadApplicationSoftware(this.selectedSystemId);
  }
},
    async loadSystems() {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/system`, {
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        if (res.ok) {
          this.systems = await res.json();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadDictionaries() {
      await Promise.all([
        this.loadDictionaryValuesForUser('typeArch'),
        this.loadDictionaryValuesForUser('answers'),
        this.loadDictionaryValuesForUser('typeApp'),
      ]);
      this.updateAppNames();
    },
async loadDictionaryValuesForUser(type) {
  try {
    const response = await fetch(`${this.apiUrl}/api/user/dictionaries/${type}`, {
      headers: { 'Authorization': 'Bearer ' + this.token },
    });
    if (response.ok) {
      const data = await response.json();
      this.dictionaries[type] = data; // заменили this.$set
    }
  } catch (err) {
    console.error('Ошибка загрузки справочника:', err);
  }
},
    async loadApplicationSoftware(systemId) {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/applicationSoftware?systemId=${systemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        if (res.ok) {
          const data = await res.json();
          this.applicationSoftware = data;
          this.applicationSoftwareDict = data;
console.log(this.applicationSoftware);		  
        }
      } catch (e) {
        console.error(e);
      }
    },
  onSystemChange() {
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  this.loadApplicationSoftware(this.selectedSystemId);
  const selectedSys = this.systems.find(s => s.id === this.selectedSystemId);
  this.currentSystemIType = selectedSys ? selectedSys.i_type : null;
  this.currentPage = 1; // сброс страницы при смене системы
  this.showForm = false; // скрываем форму при смене системы
  },

onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
    this.parseXMLAndAddSoftware(xmlDoc);
    // После обработки сбрасываем значение input, чтобы можно было выбрать тот же файл снова
    event.target.value = '';
  };

  reader.readAsText(file);
},

parseXMLAndAddSoftware(xmlDoc) {
  const assetsList = Array.from(xmlDoc.getElementsByTagName('assets'));
  const newSoftwareItems = [];

  assetsList.forEach(asset => {
    const softName = asset.getElementsByTagName('SoftName')[0]?.textContent.trim() || '';
    const architecture = asset.getElementsByTagName('Host.Softs.Architecture')[0]?.textContent.trim() || '';
    const vendor = asset.getElementsByTagName('Vendor')[0]?.textContent.trim() || '';
    const version = asset.getElementsByTagName('SoftVersion')[0]?.textContent.trim() || '';

    const newItem = {
      id: null,
      app_name: softName,
      app_architecture: architecture,
      app_certification: 'Нет',
      app_manufacturer: vendor,
      app_version: version,
    };

    newSoftwareItems.push(newItem);
  });

  const count = newSoftwareItems.length;

  if (confirm(`Добавить ${count} записей прикладного ПО?`)) {
    // const results = [];
    // Массив промисов для отправки запросов
    const promises = newSoftwareItems.map(item => {
      const payload = {
        ...item,
        systemId: this.selectedSystemId,
      };
      return fetch(`${this.apiUrl}/api/user/applicationSoftware`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token,
        },
        body: JSON.stringify(payload),
      }).then(res => res.json().then(data => ({ res, data })))
        .then(({ res, data }) => {
          if (res.ok) {
            // Успешное добавление
            return { success: true, message: 'Добавлено' };
          } else {
            // Обработка ошибок
            if (data.message && data.message.includes('уже существует')) {
              return { success: false, existing: true, message: 'Уже существует' };
            } else {
              return { success: false, existing: false, message: data.message || 'Ошибка' };
            }
          }
        }).catch(() => {
          return { success: false, existing: false, message: 'Ошибка сети' };
        });
    });

    Promise.all(promises).then(results => {
      let addedCount = 0;
      let existingCount = 0;
      let failedCount = 0;

      results.forEach(r => {
        if (r.success) {
          addedCount++;
        } else if (r.existing) {
          existingCount++;
        } else {
          failedCount++;
        }
      });

      // Формируем итоговое сообщение
      let message = '';
      if (addedCount > 0) {
        message += `Добавлено новых прикладных ПО: ${addedCount}.\n`;
      }
      if (existingCount > 0) {
        message += `${existingCount} наименований прикладного ПО уже есть в системе.\n`;
      }
      if (failedCount > 0) {
        message += `${failedCount} записей не удалось добавить.\n`;
      }

      alert(message);
      // Обновляем список ПО
      this.loadApplicationSoftware(this.selectedSystemId);
    });
  } else {
    alert('Добавление отменено.');
  }
},



    showAddForm() {
      this.resetForm();
      this.showForm = true;
    },
    cancelEdit() {
      this.resetForm();
      this.showForm = false;
    },
    resetForm() {
      this.form = {
        id: null,
        app_name: '',
        app_architecture: '',
        app_certification: '',
        app_manufacturer: '',
        app_version: '',
      };
    },
    editApplicationSoftware(id) {
      const item = this.applicationSoftwareDict.find(i => i.id === id);
      if (item) {
        this.form = { ...item };
        this.showForm = true;
      }
    },
    async saveApplicationSoftware() {
      const payload = {
        ...this.form,
        systemId: this.selectedSystemId,
      };
      try {
        if (this.form.id) {
          await fetch(`${this.apiUrl}/api/user/applicationSoftware/${this.form.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify(payload),
          });
        } else {
          await fetch(`${this.apiUrl}/api/user/applicationSoftware`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify(payload),
          });
        }
        await this.loadApplicationSoftware(this.selectedSystemId);
        this.cancelEdit();
      } catch (err) {
        console.error('Ошибка сохранения:', err);
      }
    },
    async deleteApplicationSoftware(id) {
      if (confirm('Удалить это прикладное ПО?')) {
        try {
          const response = await fetch(`${this.apiUrl}/api/user/applicationSoftware/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token },
          });
          if (response.ok) {
            await this.loadApplicationSoftware(this.selectedSystemId);
          }
        } catch (err) {
          console.error('Ошибка при удалении:', err);
        }
      }
    },
    updateAppNames() {
      this.appNames = this.dictionaries.typeApp ? this.dictionaries.typeApp.map(item => item.value) : [];
    },
  },
};
</script>

<style>
#appTable td, #commTable th {
  min-width: 5px !important; /* по необходимости */
}
</style>