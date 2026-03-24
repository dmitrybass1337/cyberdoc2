<template>
  <div>
    <div id="KgisFormContainer" style="margin: 0 auto; background: #fff; padding: 0px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
<p><strong>Название ИС: </strong><span class="text-success"><strong>{{ systemName }}</strong></span></p>
<p><strong>Тип ИС: </strong><span class="text-success"><strong>{{ systemType }}</strong></span></p>
<p><strong>Обработка персональных данных: </strong><span class="text-success"><strong>{{ systemPers }}</strong></span></p>

    <!-- Степень ущерба -->
<p style="text-align: center; color: green;"><strong>Выберите степень ущерба для свойств безопасности информации ИС:</strong></p>
    <div style="display:flex; gap:10px; margin-bottom:20px;">
      <div style="flex:1;" >
        <label for="confidentialityLevel" style="display: block; text-align: center;"><strong>Конфиденциальность</strong></label>
        <select class="form-select" v-model="levels.confidentiality" @change="showExplanation('confidentiality'); calculateClass()">
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
		<div class="alert alert-dismissible alert-success">
		<span><strong>Конфиденциальность: </strong>Защита информации от несанкционированного доступа и её раскрытия. Обеспечивает, чтобы важные данные были доступны только авторизованным лицам.</span>
		</div>
        <div class="explanation" v-if="explanations.confidentiality">{{ explanations.confidentiality }}</div>
      </div>
      <div style="flex:1;">
        <label for="integrityLevel" style="display: block; text-align: center;"><strong>Целостность</strong></label>
        <select class="form-select" v-model="levels.integrity" @change="showExplanation('integrity'); calculateClass()">
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
		<div class="alert alert-dismissible alert-primary">
		<span><strong>Целостность: </strong>Обеспечение неизменности и достоверности информации. Гарантирует, что данные не были случайно или специально изменены без разрешения.</span>
		</div>
        <div class="explanation" v-if="explanations.integrity">{{ explanations.integrity }}</div>
      </div>
      <div style="flex:1;">
        <label for="availabilityLevel" style="display: block; text-align: center;"><strong>Доступность</strong></label>
        <select class="form-select" v-model="levels.availability" @change="showExplanation('availability'); calculateClass()">
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
		<div class="alert alert-dismissible alert-warning">
		<span><strong>Доступность: </strong>Обеспечение наличия информации и систем в нужное время для авторизованных пользователей. Предотвращает простои системы и обеспечивает непрерывную работу.</span>
		</div>		
		
        <div class="explanation" v-if="explanations.availability">{{ explanations.availability }}</div>
      </div>
    </div>
<!-- Масштаб системы -->
    <p style="text-align: center; color: green; padding: 0px;"><strong>Выберите масштаб информационной системы:</strong></p>
    <select class="form-select" v-model="scale" @change="() => { updateScaleDescription(); calculateClass(); }">
      <option value="Федеральный">Федеральный</option>
      <option value="Региональный">Региональный</option>
      <option value="Объектовый">Объектовый</option>
    </select>
    <br />
<div v-if="scaleDescription" class="description alert alert-dismissible alert-info" v-html="scaleDescription"></div>
<!-- <div style="text-align:center; margin-top:10px; color:red; font-weight:bold" v-html="result"></div>-->
<!-- После блока с результатом переход-->
<div style="margin-top: 20px; text-align: center;">
  <button class="btn btn-primary" @click="goNextStepGIS">Далее</button>
</div>	
<!-- пока выключим меры в  handleResultAndShowMeasures установим measuresVisible false -->
    <!-- Результат и меры защиты -->
    <div v-if="measuresVisible" id="measuresContainer" style="margin-top:20px;">
  <h2 style="text-align:center; margin-top:30px;">СОСТАВ МЕР ЗАЩИТЫ ИНФОРМАЦИИ И ИХ БАЗОВЫЕ НАБОРЫ ДЛЯ ТЕКУЩЕГО КЛАССА ЗАЩИЩЕННОСТИ ИНФОРМАЦИОННОЙ СИСТЕМЫ</h2>
      <div v-for="(group, groupName) in filteredMeasures" :key="groupName">
        <h4>{{ groupName }}</h4>
        <table border="1" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th>Условное обозначение и номер меры</th>
              <th>Меры защиты информации</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="measure in group" :key="measure.code">
              <td>{{ measure.code }}</td>
              <td>{{ measure.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { ref, reactive } from 'vue';
export default {
  name: 'SecurityClassComponent',
// реализация перехода на следующую страницу
  emits: ['next-step-gis-bzpdn'],
  setup(props, { emit }) {
const goNextStepGIS = () => {
  emit('next-step-gis-bzpdn', levels, currentClass.value, currentMashtab.value);
//  console.log('Передаю:', levels, currentClass.value, currentMashtab.value);
};
// уровни ущерба
const levels = reactive({
  confidentiality: 'низкий',
  integrity: 'низкий',
  availability: 'низкий',
});
    const currentMashtab = ref(null);
    const currentClass = ref(null);
    // объяснения для уровней ущерба
    const explanations = reactive({
      confidentiality: '',
      integrity: '',
      availability: '',
    });
    const showExplanation = (property) => {
      const explanationsMap = {
        низкий: 'Выбран: (Низкий ущерб) Нарушение свойства не вызывает значительных негативных последствий, проблему легко устранить.',
        средний: 'Выбран: (Средний ущерб) Нарушение вызывает умеренные негативные последствия, требует должное внимания, но не критичное.',
        высокий: 'Выбран: (Высокий ущерб) Нарушение приводит к серьёзным последствиям, крупным потерям или угрозам.',
      };
      const val = levels[property];
      explanations[property] = val ? explanationsMap[val] : '';
    };
  // если хотите, чтобы объяснения уровней тоже отображались при инициализации
  showExplanation('confidentiality');
  showExplanation('integrity');
  showExplanation('availability');
    // масштаб системы
    const scale = ref('Региональный');
    const scaleDescription = ref('');
    const updateScaleDescription = () => {
      const descriptionsMap = {
        'Федеральный': `<strong>Федеральный масштаб</strong>:<br>Информационная система имеет федеральный масштаб, если она функционирует на территории Российской Федерации (в пределах федерального округа) и включает сегменты в субъектах РФ, муниципальных образованиях и/или организациях. Такая система охватывает всю страну или значительную её часть, требует высоких стандартов защиты.`,
        'Региональный': `<strong>Региональный масштаб</strong>:<br>Информационная система имеет региональный масштаб, если она функционирует на территории одного субъекта РФ и включает сегменты в нескольких муниципальных образованиях или подведомственных организациях. Это системы, обслуживающие конкретный регион, требуют защиты, соответствующей региональной ответственности.`,
        'Объектовый': `<strong>Объектовый масштаб</strong>:<br>Информационная система имеет объектовый масштаб, если она функционирует на отдельных объектах одного федерального органа, органа власти субъекта РФ, муниципального образования или организации, без сегментов в территориальных органах или филиалах. Это локальные системы, например, системы конкретного предприятия или учреждения, с меньшими требованиями к защите, но всё равно соблюдающими базовые стандарты.`,
      };
      scaleDescription.value = descriptionsMap[scale.value] || '';
    };
  // вызовите сразу после определения
  updateScaleDescription();
    // массив мер защиты
    const measuresData = reactive({
      'I. Идентификация и аутентификация субъектов доступа и объектов доступа (ИАФ)': [
        { code: 'ИАФ.1', name: 'Идентификация и аутентификация пользователей, являющихся работниками оператора', class1: '+', class2: '+', class3: '+' },
      ],
      'II. Управление доступом субъектов доступа к объектам доступа (УПД)': [
        { code: 'УПД.17', name: 'Обеспечение доверенной загрузки', class1: '', class2: '+', class3: '+' },
      ],
      'III. Ограничение программной среды (ОПС)': [
        { code: 'ОПС.4', name: 'Управление временными файлами', class1: '', class2: '', class3: '' },
      ],
      'IV. Защита машинных носителей информации (ЗНИ)': [
        { code: 'ЗНИ.8', name: 'Уничтожение информации на носителях', class1: '+', class2: '+', class3: '+' },
      ],
      'V. Регистрация событий безопасности (РСБ)': [
        { code: 'РСБ.8', name: 'Просмотр и анализ действий', class1: '', class2: '', class3: '' },
      ],
      'VI. Антивирусная защита (АВЗ)': [
        { code: 'АВЗ.2', name: 'Обновление базы признаков', class1: '+', class2: '+', class3: '+' },
      ],
      'VII. Обнаружение вторжений (СОВ)': [
        { code: 'СОВ.2', name: 'Обновление правил', class1: '', class2: '+', class3: '+' },
      ],
      'VIII. Контроль (анализ) защищенности информации (АНЗ)': [
        { code: 'АНЗ.5', name: 'Контроль смены паролей', class1: '+', class2: '+', class3: '+' },
      ],
      'IX. Обеспечение целостности информации (ОЦЛ)': [
        { code: 'ОЦЛ.8', name: 'Контроль ошибок', class1: '', class2: '', class3: '' },
      ],
      'X. Обеспечение доступности информации (ОДТ)': [
        { code: 'ОДТ.7', name: 'Контроль ресурсов', class1: '', class2: '+', class3: '+' },
      ],
      'XI. Защита среды виртуализации (ЗСВ)': [
        { code: 'ЗСВ.10', name: 'Разделение сегментов ВМ', class1: '+', class2: '+', class3: '+' },
      ],
      'XII. Защита технических средств (ЗТС)': [
        { code: 'ЗТС.5', name: 'Защита от внешних воздействий', class1: '', class2: '', class3: '' },
      ],
      'XIII. Защита информационной системы, систем связи и передачи данных (ЗИС)': [
        { code: 'ЗИС.1', name: 'Разделение функций', class1: '', class2: '+', class3: '+' },
      ],
    });

    const result = ref('');
    const measuresVisible = ref(false);
    const selectedClassNumber = ref('');

    const measureForClass = (measure) => {
      const classKey = 'class' + selectedClassNumber.value;
      return measure[classKey] === '+';
    };

    const calculateClass = () => {
      if (
        !levels.confidentiality ||
        !levels.integrity ||
        !levels.availability ||
        !scale.value
      ) {
        result.value = 'Пожалуйста, выберите все параметры.';
        measuresVisible.value = false;
        return;
      }
      const damagesMap = { низкий: 1, средний: 2, высокий: 3 };
      const confScore = damagesMap[levels.confidentiality];
      const integScore = damagesMap[levels.integrity];
      const availScore = damagesMap[levels.availability];
      let uz;
      if (confScore === 3 || integScore === 3 || availScore === 3) {
        uz = '1';
      } else if (confScore === 2 || integScore === 2 || availScore === 2) {
        uz = '2';
      } else {
        uz = '3';
      }
      const table = {
        '1_Федеральный': 'К1',
        '1_Региональный': 'К1',
        '1_Объектовый': 'К1',
        '2_Федеральный': 'К1',
        '2_Региональный': 'К2',
        '2_Объектовый': 'К2',
        '3_Федеральный': 'К2',
        '3_Региональный': 'К3',
        '3_Объектовый': 'К3',
      };
      const key = `${uz}_${scale.value}`;
      const cls = table[key];
      currentMashtab.value = scale.value; // исправлено 
      currentClass.value = cls; // исправлено
      // console.log('Присвоен класс:', currentClass.value, currentMashtab.value);
      const classNumber = cls.replace('К', '');

      result.value = `<p style="text-align: center;"><strong>КЛАСС ЗАЩИЩЁННОСТИ: <b>${cls}</b></strong></p>`;
      selectedClassNumber.value = classNumber;
      handleResultAndShowMeasures(classNumber);
    };
const handleResultAndShowMeasures = (klass) => {
  // выполнить какую-то логику с klass
  console.log('Класс:', klass);
  measuresVisible.value = false;
};
// после определения всех реактивных переменных и функций
calculateClass();
    return {
      levels,
      explanations,
      showExplanation,
      scale,
      scaleDescription,
      updateScaleDescription,
      measuresData,
      result,
      calculateClass,
      measuresVisible,
      measureForClass,
      goNextStepGIS,
      currentClass,
      currentMashtab,
    };
  },
  props: {
systemName: String,
systemType: String,
systemPers: String,
},
computed: {
  filteredMeasures() {
    // возвращает объект групп с только подходящими мерами
    const result = {};
    for (const [groupName, measures] of Object.entries(this.measuresData)) {
      result[groupName] = measures.filter(measure => this.measureForClass(measure));
    }
    return result;
  }
},
};
</script>
<style scoped>
h2 {
  margin-top: 20px;
}
.explanation {
  margin-bottom: 20px;
}
</style>