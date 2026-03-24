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
<p style="text-align: center; color: #008CBA; font-weight: bold;">СХЕМЫ ИНФОРМАЦИОННОЙ СИСТЕМЫ</p>
	
      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
<select v-model="selectedSystemId" id="shemaSystemsSelect" @change="handleSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>
      <!-- Таблица схем -->
      <div id="schemasLinksContainer" style="margin-top: 10px;">
        <p v-if="schemas.length === 0">Нет загруженных схем</p>
        <table id="sysappTable"  v-if="schemas.length > 0" class="table table-hover table-sm">
          <thead>
            <tr class="table-primary">
              <th style="text-align: center;">Тип схемы</th>
              <!-- <th style="text-align: center;">Файл</th> -->
              <th style="text-align: center;">Статус</th>
              <th style="text-align: center;">Действия</th>
            </tr>
          </thead>
          <tbody>
<tr v-for="schema in schemas" :key="schema.id">
  <td style="text-align: center;">{{ schema.label }}</td>
  <!-- <td style="text-align: center;">{{ schema.filepath || 'Нет файла' }}</td> -->
  <td style="text-align: center;">
<i v-if="schema.filepath" class="fa-solid fa-box-archive" :style="{ color: '#43AC6A', fontSize: '20px' }" title="Загружено"></i>
<i v-else class="fa-solid fa-box" :style="{ color: '#008CBA', fontSize: '20px' }" title="Не загружено"></i>
  </td>
  <td style="text-align: center;">
    <button v-if="schema.filepath" @click="openSchema(schema.filepath)" class="btn btn-sm btn-success" style="margin-right: 5px;" title="Просмотр схемы">
      <i class="fa fa-eye" aria-hidden="true"></i>
    </button>
    <button v-if="schema.filepath" @click="deleteSchema(schema.id)" class="btn btn-sm btn-danger" title="Удалить схему">
      <i class="fa fa-trash"></i>
    </button>
    <!-- Альтернативное содержимое, когда файла нет -->
    <span v-else style="color: #888;">Нет схемы</span>
  </td>
</tr>
          </tbody>
        </table>
      </div>

      <!-- Блок загрузки схем -->
      <div v-if="showUpload" style="margin-top: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <form @submit.prevent="uploadSchemas" enctype="multipart/form-data" ref="uploadForm">
          <div>
            <label for="structuralScheme" class="form-label mt-2">Структурная схема</label>
            <input class="form-control" type="file" id="structuralScheme" ref="structuralScheme" accept="image/*" />
          </div>
          <div>
            <label for="zoneScheme" class="form-label mt-2">Контролируемая зона</label>
            <input class="form-control" type="file" id="zoneScheme" ref="zoneScheme" accept="image/*" />
          </div>
          <div>
            <label for="flowScheme" class="form-label mt-2">Потоки данных</label>
            <input class="form-control" type="file" id="flowScheme" ref="flowScheme" accept="image/*" />
          </div>
          <div class="d-flex justify-content-end" style="margin-top: 10px;">
          <button class="btn btn-primary" type="submit" style="margin-top: 10px;">Загрузить</button>
          </div>		  
        </form>
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
      selectedSystemId: null,
      schemas: [], // схемы для выбранной системы
      showUpload: false,
      apiUrl: '',
      allSchemas: [
      { schema_name: 'structuralScheme', label: 'Структурная схема' },
      { schema_name: 'zoneScheme', label: 'Контролируемая зона' },
      { schema_name: 'flowScheme', label: 'Потоки данных' }
      ],
    };
  },
  methods: {
    // Получение названия системы по id
    getSystemName(id) {
      const system = this.systems.find(s => s.id === id);
      return system ? system.i_name : '';
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
    // Загрузка систем
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
    // Загружаем схемы для выбранной системы
    await this.loadSystemSchemas();

    // Показывать кнопку добавления, если есть системы
    this.showUpload = data.length > 0;

  } catch (e) {
    console.error('Ошибка загрузки систем:', e);
  }
},
    // Загрузка схем для выбранной системы
async loadSystemSchemas() {
  if (!this.selectedSystemId) return;
  try {
    const res = await fetch(`${this.apiUrl}/api/user/get_system_schemas?systemId=${this.selectedSystemId}`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (!res.ok) throw new Error('Ошибка получения схем');
    const loadedSchemas = await res.json(); // массив схем с id
    // Создаем массив схем, где у каждого есть id
    this.schemas = this.allSchemas.map(schema => {
      const found = loadedSchemas.find(s => s.schema_name === schema.schema_name);
      return {
        id: found ? found.id : null, // числовой id или null
        schema_name: schema.schema_name,
        label: schema.label,
        filepath: found ? found.filepath : null
      };
    });
  } catch (err) {
    console.error('Ошибка загрузки схем:', err);
    this.schemas = this.allSchemas.map(schema => ({
      id: null,
      schema_name: schema.schema_name,
      label: schema.label,
      filepath: null
    }));
  }
},
async handleSystemChange() {
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  await this.loadSystemSchemas();
},
    // Открыть схему
    openSchema(filepath) {
      const url = `${this.apiUrl}/uploads/schemas/${filepath}`;
      window.open(url, '_blank');
    },
    // Удалить схему
    async deleteSchema(id) {
      if (!confirm('Вы действительно хотите удалить эту схему?')) return;
      try {
        const res = await fetch(`${this.apiUrl}/api/user/delete_schema/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (res.ok) {
          alert('Схема успешно удалена');
          this.loadSystemSchemas();
        } else {
          const errData = await res.json();
          alert('Ошибка при удалении: ' + (errData.error || res.status));
        }
      } catch (err) {
        alert('Ошибка: ' + err.message);
      }
    },
    // Загрузка схем (при выборе системы)
    async loadShemaSystems() {
      await this.loadSystems();
    },
updateSchema(schema_name, { filepath }) {
  const index = this.schemas.findIndex(s => s.schema_name === schema_name);
  if (index !== -1) {
    // Обновляем существующую схему
    this.schemas[index].filepath = filepath;
  } else {
    // Добавляем новую
    this.schemas.push({ id: Date.now(), schema_name, filepath });
  }
},
    // Загрузка схем
async uploadSchemas() {
  const formData = new FormData();
  const fileStruct = this.$refs.structuralScheme.files[0];
  const fileZone = this.$refs.zoneScheme.files[0];
  const fileFlow = this.$refs.flowScheme.files[0];

  if (!fileStruct && !fileZone && !fileFlow) {
    alert('Пожалуйста, выберите хотя бы один файл схемы');
    return;
  }

  formData.append('systemId', this.selectedSystemId);
  if (fileStruct) formData.append('structuralScheme', fileStruct);
  if (fileZone) formData.append('zoneScheme', fileZone);
  if (fileFlow) formData.append('flowScheme', fileFlow);

  try {
    const res = await fetch(`${this.apiUrl}/api/user/upload_schemes`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token
      },
      body: formData
    });
    if (res.ok) {
      const result = await res.json(); // сервер возвращает пути
      // Обновляем или добавляем схемы по результату
if (fileStruct && result.structuralSchemePath) {
  this.updateSchema('structuralScheme', { filepath: result.structuralSchemePath });
}
if (fileZone && result.zoneSchemePath) {
  this.updateSchema('zoneScheme', { filepath: result.zoneSchemePath });
}
if (fileFlow && result.flowSchemePath) {
  this.updateSchema('flowScheme', { filepath: result.flowSchemePath });
}
      // Обновляем список схем, перезагружая их заново
      await this.loadSystemSchemas();

      alert('Схемы успешно загружены');
      this.$refs.uploadForm.reset();
    } else {
      const errData = await res.json();
      alert('Ошибка загрузки: ' + (errData.error || res.status));
    }
  } catch (err) {
    alert('Ошибка: ' + err.message);
  }
}
  },
computed: {
  selectedSystemName() {
    return this.getSystemName(this.selectedSystemId);
  }
},
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadSystems();
  }
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