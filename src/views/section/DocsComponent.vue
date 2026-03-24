<template>
<div class="jumbotron">
    <!-- Заголовок -->

    <!-- Основной контейнер -->
    <div id="DocsFormContainer" style="margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">

<p style="text-align: center; color: #008CBA; font-weight: bold;">КОМПЛЕКТ ДОКУМЕНТОВ</p>


	
	
      <div style="text-align: center;">

        <span style="color:#008CBA; font-weight: bold;">ГИС: </span><span style="color:#5BC0DE; font-weight: bold;">3</span>&nbsp;
        <span style="color:#008CBA; font-weight: bold;">ИСПДн: </span><span style="color:#5BC0DE; font-weight: bold;">3</span>&nbsp;
        <span style="color:#008CBA; font-weight: bold;">КИИ: </span><span style="color:#5BC0DE; font-weight: bold;">0</span>&nbsp;
        <span style="color:#008CBA; font-weight: bold;">АС: </span><span style="color:#5BC0DE; font-weight: bold;">0</span>
  
</div>
    <!-- Основной контейнер -->

      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="existingSystemsSelect" @change="onSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name || 'Без названия' }}
        </option>
      </select>

    <!-- Блок с документами -->
    <div v-if="showDocuments" style="margin-top:20px;">
<!-- Блок с документами - таблица -->
<div v-if="showDocuments" style="margin-top:20px;">
<div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
  <button @click="downloadAllDocumentsAsZip" class="btn btn-info">⎙ Скачать полный комплект документов</button>
</div>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th style="color:#008CBA; font-weight: bold;">Тип документа</th>
        <th style="color:#008CBA; font-weight: bold;">Требуемые данные <label style="font-weight: bold; color: green;">(контроль для выгрузки документа временно отключен)</label></th>
        <th style="color:#008CBA; font-weight: bold;">Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(doc) in documents" :key="doc.id">
        <td>{{ doc.name }}</td>
<td>
  <div v-if="doc.name === 'Акт классификации'">
    <i class="fa fa-university text-success" :style="{ fontSize: '20px' }" title="Организация"></i>
    <i class="fa fa-id-card text-success" :style="{ fontSize: '20px' }" title="Сотрудники"></i>
    <i class="fa fa-tasks text-success" :style="{ fontSize: '20px' }" title="Система"></i>
    <i class="fa fa-address-book text-success" :style="{ fontSize: '20px' }" title="Приказы"></i>
    <i class="fa fa-bar-chart text-success" :style="{ fontSize: '20px' }" title="Классификация"></i>
  </div>
  <div v-else-if="doc.name === 'Технический паспорт'">
<i class="fa fa-university text-success" :style="{ fontSize: '20px' }" title="Организация"></i>
<i class="fa fa-id-card text-success" :style="{ fontSize: '20px' }" title="Сотрудники"></i>
    <i class="fa fa-tasks text-success" :style="{ fontSize: '20px' }" title="Система"></i>
    <i class="fa fa-desktop text-success" :style="{ fontSize: '20px' }" title="ЭВМ"></i>
    <i class="fa fa-share-alt-square text-success" :style="{ fontSize: '20px' }" title="Сетевое оборудование"></i>
    <i class="fa fa-shield text-success" :style="{ fontSize: '20px' }" title="СЗИ"></i>
    <i class="fa fa-window-maximize text-success" :style="{ fontSize: '20px' }" title="Системное ПО"></i>
    <i class="fa fa-window-restore text-success" :style="{ fontSize: '20px' }" title="Прикладное ПО"></i>
    <i class="fa fa-map text-success" :style="{ fontSize: '20px' }" title="Схемы"></i>
    <i class="fa fa-address-book text-success" :style="{ fontSize: '20px' }" title="Приказы"></i>
    <i class="fa fa-pie-chart text-success" :style="{ fontSize: '20px' }" title="Сегменты"></i>
    <i class="fa fa-bar-chart text-success" :style="{ fontSize: '20px' }" title="Классификация"></i>
  </div>
  <div v-else-if="doc.name === 'Приказ о создании Комиссии по классификации'">
    <i class="fa fa-university text-success" :style="{ fontSize: '20px' }" title="Организация"></i>
    <i class="fa fa-id-card text-success" :style="{ fontSize: '20px' }" title="Сотрудники"></i>
    <i class="fa fa-tasks text-success" :style="{ fontSize: '20px' }" title="Система"></i>
    <i class="fa fa-address-book text-success" :style="{ fontSize: '20px' }" title="Приказы"></i>
  </div>
  <div v-else>
          <!-- <ul style="margin:0; padding-left:15px;">
            <li v-for="req in doc.requirements" :key="req.field">
              <strong>{{ req.field }}</strong>: {{ req.description }}
            </li>
          </ul> -->
  </div>
</td>
        <td>
          <button
            @click="downloadDocument(doc, selectedSystemIName)"
            class="btn btn-info"
          >
            ⎙ Скачать
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div></div>
    </div>
</div>
</template>

<script>
import JSZip from 'jszip';
export default {
  data() {
    return {
      token: localStorage.getItem('token') || '',
      systems: [],
      selectedSystemId: null,
      selectedSystemIType: null,
      selectedSystemIPers: null, 
      selectedSystemIName: null,
      documents: [],
      apiUrl: '',
      showDocuments: false,
      templateRequirements: [],
      selectedTemplateType: null,
    };
  },
  methods: {
  async downloadAllDocumentsAsZip() {
    if (this.documents.length === 0) {
      alert('Нет документов для скачивания.');
      return;
    }

    const zip = new JSZip();

    for (const doc of this.documents) {
      try {
        const response = await fetch(
          `${this.apiUrl}/api/user/download-existing-system?systemId=${encodeURIComponent(this.selectedSystemId)}&templateType=${encodeURIComponent(doc.template_type)}`,
          {
            headers: { 'Authorization': 'Bearer ' + this.token },
          }
        );
        if (!response.ok) throw new Error(`Ошибка при скачивании файла ${doc.name}`);
        const blob = await response.blob();
        // Добавляем файл в ZIP
        zip.file(`${doc.name}.docx`, blob);
      } catch (err) {
        alert(`Ошибка при добавлении документа ${doc.name}: ${err.message}`);
      }
    }

    // Генерируем ZIP и скачиваем
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Комплект_документов.zip';  // название архива
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Ошибка при создании архива: ' + err.message);
    }
  },

// eslint-disable-next-line vue/no-unused-vars
async loadRequirementsForDocument(templateType, index) {
  try {
    const res = await fetch(
      `${this.apiUrl}/api/user/template-fields?templateType=${encodeURIComponent(templateType)}`,
      {
        headers: { 'Authorization': 'Bearer ' + this.token },
      }
    );
    if (!res.ok) throw new Error('Ошибка при получении требований');
    const requirements = await res.json();
    // Обновляем напрямую
    this.documents[index].requirements = requirements;
  } catch (err) {
    console.error('Ошибка получения требований для документа:', err);
    this.documents[index].requirements = [];
  }
},

async loadTemplateRequirements() {
  if (!this.selectedSystemIType || !this.selectedSystemIPers) return;
  try {
    const res = await fetch(
      `${this.apiUrl}/api/user/template-fields?templateType=${encodeURIComponent(this.selectedSystemIType)}&i_pers=${encodeURIComponent(this.selectedSystemIPers)}`,
      {
        headers: { 'Authorization': 'Bearer ' + this.token },
      }
    );
    if (!res.ok) throw new Error('Ошибка при получении требований');
    this.templateRequirements = await res.json();
  } catch (err) {
    console.error('Ошибка получения требований:', err);
    this.templateRequirements = [];
  }
},
async loadExistingSystems() {
  console.log('вызов loadExistingSystems');
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token },
    });
    if (!res.ok) {
      if (res.status === 404) {
        this.systems = [];
        return;
      } else {
        console.error('Ошибка при загрузке систем:', res.status);
        return;
      }
    }
    const systems = await res.json();
    this.systems = systems;

    const savedId = localStorage.getItem('selectedSystemId');

    if (savedId && systems.some(s => String(s.id) === savedId)) {
      this.selectedSystemId = savedId;
    } else if (systems.length > 0) {
      this.selectedSystemId = String(systems[0].id);
    }
  } catch (err) {
    console.error('Ошибка загрузки систем:', err);
  }
},

async loadSystemDocuments() {
  console.log('loadSystemDocuments вызван для systemId:', this.selectedSystemId);
  if (!this.selectedSystemId || !this.selectedSystemIType || !this.selectedSystemIPers) {
    console.log('Некорректные параметры для загрузки документов');
    alert('Пожалуйста, выберите систему');
    return;
  }
  try {
    const res = await fetch(
      `${this.apiUrl}/api/user/system-documents?type=${encodeURIComponent(this.selectedSystemIType)}&i_pers=${encodeURIComponent(this.selectedSystemIPers)}`,
      {
        headers: { 'Authorization': 'Bearer ' + this.token },
      }
    );
    if (!res.ok) throw new Error('Ошибка при загрузке документов');
    const docs = await res.json();
    console.log('Получено документов:', docs);
    this.documents = docs.map(doc => ({ ...doc, requirements: [] }));
    this.showDocuments = true;

    for (let i = 0; i < this.documents.length; i++) {
      await this.loadRequirementsForDocument(this.documents[i].template_type, i);
    }
  } catch (err) {
    console.error('Ошибка при загрузке документов:', err);
    this.showDocuments = false;
  }
},

onSystemChange() {
  const selectedSystem = this.systems.find(s => s.id === this.selectedSystemId);
if (selectedSystem) {
  this.selectedSystemIType = selectedSystem.i_type;
  this.selectedSystemIPers = selectedSystem.i_pers;
  this.selectedSystemIName = selectedSystem.i_sname;
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  this.loadSystemDocuments();
  this.loadTemplateRequirements();
}
},

    async downloadDocument(Full, FullSys) {
      let systemIName = FullSys;
      let systemIType = Full.template_type;
      try {
        const response = await fetch(
          `${this.apiUrl}/api/user/download-existing-system?systemId=${encodeURIComponent(this.selectedSystemId)}&templateType=${encodeURIComponent(systemIType)}`,
          {
            headers: { 'Authorization': 'Bearer ' + this.token },
          }
        );
        if (!response.ok) throw new Error('Ошибка при скачивании файла');

        let namedocx = Full.name;
        let namedocx2 = systemIName;
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${namedocx}_${namedocx2}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert('Ошибка: ' + err.message);
      }
    },
  },
watch: {
  selectedSystemId(newVal) {
    if (newVal) {
      const selectedSystem = this.systems.find(s => String(s.id) === newVal);
      if (selectedSystem) {
        this.selectedSystemIType = selectedSystem.i_type;
        this.selectedSystemIPers = selectedSystem.i_pers;
        this.selectedSystemIName = selectedSystem.i_sname;
        localStorage.setItem('selectedSystemId', newVal);
        this.loadSystemDocuments();
        this.loadTemplateRequirements();
      }
    }
  }
},
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadExistingSystems();
  },
};
</script>