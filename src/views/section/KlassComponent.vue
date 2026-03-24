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
<p style="text-align: center; color: #008CBA; font-weight: bold;">КЛАССИФИКАЦИЯ ИНФОРМАЦИОННОЙ СИСТЕМЫ</p>
    <!-- Выбор системы -->
      <label for="selectSystem" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
      <select v-model="selectedSystemId" id="selectSystem" @change="onSystemChange" class="form-select" style="margin-top:10px;">
        <option v-for="sys in systems" :key="sys.id" :value="sys.id">
          {{ sys.i_name }}
        </option>
      </select>
      <!-- Показать параметры выбранной системы -->
      <!-- После выбора системы -->
  
  <div v-if="classificationData">
  <h5 style="text-align: center;">Система уже классифицирована, повторная классификаци приведёт в обновлению этих данных</h5>
 <!-- Таблица классификации -->
<!-- Таблица с параметрами как столбцами -->
<table id="classificationTable" class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
  <thead>
    <tr class="table-primary">
      <!-- Заголовки колонок с параметрами -->
      <th style="text-align: center;">Имя системы</th>
      <th style="text-align: center;">Тип системы</th>
      <th style="text-align: center;">Обработка ПДн</th>
      <th style="text-align: center;">Класс защищённости</th>
      <th style="text-align: center;">Уровень значимости</th>
      <th style="text-align: center;">Конфиденциальность</th>
      <th style="text-align: center;">Целостность</th>
      <th style="text-align: center;">Доступность</th>
      <th style="text-align: center;">Масштаб системы</th>
      <th style="text-align: center;">Уровень защищённости</th>
      <th style="text-align: center;">Тип угроз</th>
      <th style="text-align: center;">Тип ПДн</th>
      <th style="text-align: center;">Тип владения ПДн</th>
      <th style="text-align: center;">Количество ПДн</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- Значения под заголовками -->
      <td style="text-align: center;">{{ systemInfo ? getSystemName(systemInfo.id) : '' }}</td>
      <td style="text-align: center;">{{ systemInfo ? getSystemType(systemInfo.id) : '' }}</td>
      <td style="text-align: center;">{{ systemInfo ? getSystemPers(systemInfo.id) : '' }}</td>
      <td style="text-align: center;">{{ classificationData.class_gis }}</td>
      <td style="text-align: center;">{{ classificationData.level_znachimosti }}</td>
      <td style="text-align: center;">{{ classificationData.confidentiality }}</td>
      <td style="text-align: center;">{{ classificationData.integrity }}</td>
      <td style="text-align: center;">{{ classificationData.availability }}</td>
      <td style="text-align: center;">{{ classificationData.current_mashtab }}</td>
      <td style="text-align: center;">{{ classificationData.level_zashishenost }}</td>
      <td style="text-align: center;">{{ classificationData.type_ugroz }}</td>
      <td style="text-align: center;">{{ classificationData.type_pdn }}</td>
      <td style="text-align: center;">{{ classificationData.type_vladpdn }}</td>
      <td style="text-align: center;">{{ classificationData.kol_pdn }}</td>
    </tr>
  </tbody>
</table>
</div>
      <div v-if="systemInfo" style="margin-top:0px;">
<br />
<div v-if="systemInfo.i_type === 'КИИ'">
<KIICalculation v-if="currentStepKII === 1" @next-step-kii="handleNextStepKII" :systemName="selectedSystemName" :systemType="selectedSystemType" :systemPers="selectedSystemPers" :systemId="systemInfo.id"/>
</div>
<div v-if="systemInfo.i_type === 'ГИС' && systemInfo.i_pers === 'Нет'">
<GisBzPDnCalculation v-if="currentStepGISBzPDn === 1" @next-step-gis-bzpdn="handleNextStepGISBzPDn" :systemName="selectedSystemName" :systemType="selectedSystemType" :systemPers="selectedSystemPers" />
<ResultGISBzPDn
  v-if="currentStepGISBzPDn === 2"
  :levels="levels"
  :systemName="selectedSystemName"
  :systemType="selectedSystemType"
  :systemPers="selectedSystemPers"
  :currentClass="currentClass"
  :systemId="systemInfo.id"
  :currentMashtab="currentMashtab"
  @next-step-gis-bzpdn="handleNextStepGIS2"
  @update-table="fetchClassification"
  @go-back-gis-bzpdn="handleGoBackGISBzPDn"
/>
</div>
        <div v-if="systemInfo.i_type === 'ГИС' && systemInfo.i_pers === 'Да'">
<GisCalculation v-if="currentStepGIS === 1" @next-step-gis="handleNextStepGIS" :systemName="selectedSystemName" :systemType="selectedSystemType" :systemPers="selectedSystemPers"/>
<ResultGIS
  v-if="currentStepGIS === 2"
  :levels="levels"
  :currentClass="currentClass"
  :currentMashtab="currentMashtab"
  :systemName="selectedSystemName"
  :systemType="selectedSystemType"
  :systemPers="selectedSystemPers"
  @next-step-gis-pdn="handleNextStepGIS2"
  @go-back-gis="handleGoBackGIS"
/>
<GisCalculationPDn
  v-if="currentStepGIS === 3"
  :currentData="currentData"
  :level="level"
  :ugroza="ugroza"
  :type-ispdn="type_ispdn"
  :type-sotrud="type_sotrud"
  :kolvo="kolvo"
  :systemId="systemInfo.id"
  :systemName="selectedSystemName"
  :systemType="selectedSystemType"
  :systemPers="selectedSystemPers"
  @update-table="fetchClassification"
  @go-back-gis="handleGoBackGIS2"
/>
</div>
<div v-if="systemInfo.i_type === 'ИСПДн'">
  <div>
    <IspdnCalculation v-if="currentStep === 1" @next-step="handleNextStep" :systemName="selectedSystemName" :systemType="selectedSystemType" :systemPers="selectedSystemPers" />
<ResultISPDN
  v-if="currentStep === 2"
  :systemName="selectedSystemName"
  :systemType="selectedSystemType"
  :systemPers="selectedSystemPers"
  :level="level"
  :ugroza="ugroza"
  :type-ispdn="type_ispdn"
  :type-sotrud="type_sotrud"
  :kolvo="kolvo"
  :systemId="systemInfo.id"
  @update-table="fetchClassification"
  @go-back="handleGoBack"
/>
  </div>
        </div>
</div>
  </div></div>
</template>
<script>
// импорт компонентов для расчетов
import GisCalculation from './KlassGIS/GisCalculation.vue';
import IspdnCalculation from './KlassISPDN/IspdnCalculation.vue';
import ResultISPDN from './KlassISPDN/ResultISPDN.vue';
import ResultGIS from './KlassGIS/ResultGIS.vue';
import GisCalculationPDn from './KlassGIS/GisCalculationPDn.vue';
import GisBzPDnCalculation from './KlassGISbzPDn/GisBzPDnCalculation.vue';
import ResultGISBzPDn from './KlassGISbzPDn/ResultGISBzPDn.vue';
import KIICalculation from './KatKII/KIICalculation.vue';


export default {
  components: { GisCalculation, IspdnCalculation, ResultISPDN, ResultGIS, GisCalculationPDn, GisBzPDnCalculation, ResultGISBzPDn, KIICalculation },
  data() {
    return {
      selectedSystemId: localStorage.getItem('selectedSystemId') || null,
      systems: [], // список систем
      systemInfo: null,
      finalData: null, // итоговые данные для отображения и сохранения
      currentStep: 1,
      currentStepGIS: 1,
      currentStepGISBzPDn: 1,
      currentStepKII: 1,	  
      level: null,
levels: {
  confidentiality: '',
  integrity: '',
  availability: ''
},
    classificationData: null, // сюда будем загружать классификацию
    currentData: {
      class: '',
      levelImportance: '',
      levels: {
        confidentiality: '',
        integrity: '',
        availability: ''
      },
      currentMashtab: ''
    },
    currentClass: null,
    currentMashtab: null,
    ugroza: null,
    type_ispdn: null,
    type_sotrud: null,
    kolvo: null,
    };
  },
computed: {
  selectedSystemName() {
    return this.getSystemName(this.systemInfo?.id);
  },
  selectedSystemType() {
    return this.getSystemType(this.systemInfo?.id);
  },
  selectedSystemPers() {
    return this.getSystemPers(this.systemInfo?.id);
  },
  // остальные вычисляемые...
},
  methods: {
  handleNextStep(level, ugroza, type_ispdn, type_sotrud, kolvo) {
  this.level = level;
console.log(this.level);
  this.ugroza = ugroza;
console.log(this.ugroza);
  this.type_ispdn = type_ispdn;
console.log(this.type_ispd);
  this.type_sotrud = type_sotrud;
console.log(this.type_sotrud);
  this.kolvo = kolvo;
console.log(this.kolvo);
    this.currentStep = 2;
  },
  handleNextStepGISBzPDn(levels, currentClass, currentMashtab) {
this.levels = levels;
this.currentClass = currentClass;
this.currentMashtab = currentMashtab;
    this.currentStepGISBzPDn = 2;
  },
  handleNextStepKII() {
    this.currentStepKII = 2;
  },
  handleNextStepGIS(levels, currentClass, currentMashtab) {
this.levels = levels;
this.currentClass = currentClass;
this.currentMashtab = currentMashtab;
// console.log('Получены:', levels, currentClass, currentMashtab);
    this.currentStepGIS = 2;
  },
handleNextStepGIS2(currentData, level, ugroza, type_ispdn, type_sotrud, kolvo) {
  this.currentData = currentData;
  console.log('Получен объект currentData:', currentData, level, ugroza, type_ispdn, type_sotrud, kolvo);
  this.level = level;
console.log(this.level);
  this.ugroza = ugroza;
console.log(this.ugroza);
  this.type_ispdn = type_ispdn;
console.log(this.type_ispd);
  this.type_sotrud = type_sotrud;
console.log(this.type_sotrud);
  this.kolvo = kolvo;
console.log(this.kolvo);
  this.currentStepGIS = 3;
},

  handleGoBack() {
    this.currentStep = 1;
  },
  handleGoBackGIS() {
    this.currentStepGIS = 1;
  },
  handleGoBackGISBzPDn() {
    this.currentStepGISBzPDn = 1;
  },
  handleGoBackGIS2() {
    this.currentStepGIS = 2;
  },
    // Загрузка систем
	
async loadSystems() {
  const response = await fetch(`${this.$API_URL}/api/user/system`, {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  this.systems = await response.json();

  if (this.systems.length > 0) {
    // Проверяем, есть ли выбранный системный ID в localStorage
    const storedId = localStorage.getItem('selectedSystemId');
    if (storedId && this.systems.some(s => s.id == storedId)) {
      this.selectedSystemId = storedId;
    } else {
      this.selectedSystemId = this.systems[0].id;
      localStorage.setItem('selectedSystemId', this.selectedSystemId);
    }
    // Мгновенно обновляем systemInfo
    this.systemInfo = this.systems.find(s => s.id == this.selectedSystemId);
    // Загружаем классификацию
    this.fetchClassification();
  }
},
    systemId: {
      type: Number,
      required: true
    },
    getSystemName(id) {
      const sys = this.systems.find(s => s.id === id);
      return sys ? sys.i_name : '';
    },
    getSystemType(id) {
      const sys = this.systems.find(s => s.id === id);
      return sys ? sys.i_type : '';
    },
    getSystemPers(id) {
      const sys = this.systems.find(s => s.id === id);
      return sys ? sys.i_pers : '';
    },
  async fetchClassification() {
    console.log('fetchClassification вызван');
    // ваш существующий метод для получения классификации
    if (!this.selectedSystemId) {
      this.classificationData = null;
      return;
    }
    try {
      const response = await fetch(`${this.$API_URL}/api/user/classification/${this.selectedSystemId}`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (response.ok) {
        const data = await response.json();
        this.classificationData = data; // обновляем таблицу
      } else {
        this.classificationData = null;
      }
    } catch (e) {
      console.error('Ошибка при получении классификации:', e);
      this.classificationData = null;
    }
  },
onSystemChange() {
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
  this.systemInfo = this.systems.find(s => s.id === this.selectedSystemId);
console.log('вызван');
  this.fetchClassification();
},
saveData(data) {
  console.log('saveData вызван', data);
  this.finalData = {
    i_name: this.getSystemName(this.systemInfo.id),
    i_pers: this.getSystemPers(this.systemInfo.id),
    ...data
  };
  alert('Данные сохранены:\n' + JSON.stringify(this.finalData, null, 2));
      this.onSystemChange();
},
    saveToDB() {
      // здесь делаете API-запрос для сохранения finalData
      alert('Данные сохранены:\n' + JSON.stringify(this.finalData, null, 2));
      this.onSystemChange();
    },
    resetFinal() {
      this.finalData = null;
      this.onSystemChange();
    }
  },
async mounted() {
  await this.loadSystems();
}
}
</script>