<template>
  <div>
    <h3 style="text-align: center;">
      <span class="badge rounded-pill bg-success">
        <strong>Определение класса защищённости информационной системы</strong> (ГИС)
      </span>
    </h3>
    <h2 style="text-align: center; margin-bottom: 30px; color: red">
      Раздел временный будет удалён и перенесён в один из шагов мастера классификации и категорирования
    </h2>
    <div id="KgisFormContainer" style="margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
    <!-- Свойства безопасности -->
    <div class="explanation">
      <h2 style="text-align: center; margin-bottom: 30px; color: #333;">
        <strong>Свойства безопасности информации:</strong>
      </h2>
      <ul>
        <li><strong>Конфиденциальность:</strong> Защита информации от несанкционированного доступа и её раскрытия. Обеспечивает, чтобы важные данные были доступны только авторизованным лицам.</li>
        <li><strong>Целостность:</strong> Обеспечение неизменности и достоверности информации. Гарантирует, что данные не были случайно или специально изменены без разрешения.</li>
        <li><strong>Доступность:</strong> Обеспечение наличия информации и систем в нужное время для авторизованных пользователей. Предотвращает простои системы и обеспечивает непрерывную работу.</li>
      </ul>
    </div>
    
    <!-- Степень ущерба -->
    <div class="explanation">
      <h2 style="text-align: center; margin-bottom: 30px; color: #333;">
        <strong>Степень ущерба для свойства безопасности информации:</strong>
      </h2>
      <ul>
        <li><strong>Низкий ущерб:</strong> Нарушение свойства не вызывает значительных негативных последствий, проблему легко устранить.</li>
        <li><strong>Средний ущерб:</strong> Нарушение вызывает умеренные негативные последствия, требует внимания, но не критичное.</li>
        <li><strong>Высокий ущерб:</strong> Нарушение приводит к серьёзным последствиям, крупным потерям или угрозам.</li>
      </ul>
    </div>
    <p><strong>Выберите степень ущерба для свойств безопасности информации:</strong></p>
    <div style="display:flex; gap:10px; margin-bottom:20px;">
      <div style="flex:1;">
        <label for="confidentialityLevel"><strong>Конфиденциальность:</strong></label>
        <select class="form-select" v-model="levels.confidentiality" @change="showExplanation('confidentiality')">
          <option value="">-- Выберите степень ущерба --</option>
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
        <div class="explanation" v-if="explanations.confidentiality">{{ explanations.confidentiality }}</div>
      </div>
      
      <div style="flex:1;">
        <label for="integrityLevel"><strong>Целостность:</strong></label>
        <select class="form-select" v-model="levels.integrity" @change="showExplanation('integrity')">
          <option value="">-- Выберите степень ущерба --</option>
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
        <div class="explanation" v-if="explanations.integrity">{{ explanations.integrity }}</div>
      </div>
      
      <div style="flex:1;">
        <label for="availabilityLevel"><strong>Доступность:</strong></label>
        <select class="form-select" v-model="levels.availability" @change="showExplanation('availability')">
          <option value="">-- Выберите степень ущерба --</option>
          <option value="низкий">Низкий ущерб</option>
          <option value="средний">Средний ущерб</option>
          <option value="высокий">Высокий ущерб</option>
        </select>
        <div class="explanation" v-if="explanations.availability">{{ explanations.availability }}</div>
      </div>
    </div>
    
    <!-- Масштаб системы -->
    <div class="explanation">
      <h2 style="text-align: center; margin-bottom: 30px; color: #333;">
        <strong>Масштабы системы:</strong>
      </h2>
      <ul>
        <li><strong>Федеральный:</strong> охватывает всю страну, важна высокая защита.</li>
        <li><strong>Региональный:</strong> охватывает один субъект РФ, средние требования.</li>
        <li><strong>Объектовый:</strong> локальные системы, меньшие требования.</li>
      </ul>
    </div>
    <label for="scaleSelect"><strong>Масштаб системы:</strong></label>
    <select class="form-select" v-model="scale" @change="updateScaleDescription">
      <option value="">-- Выберите --</option>
      <option value="Федеральный">Федеральный</option>
      <option value="Региональный">Региональный</option>
      <option value="Объектовый">Объектовый</option>
    </select>
    <div class="description" v-html="scaleDescription"></div>
    
    <!-- Кнопка для определения -->
    <div style="margin-top:20px;">
      <button @click="calculateClass">Определить класс защищённости</button>
    </div>
    <div style="text-align:center; margin-top:10px; color:red; font-weight:bold" v-html="result"></div>
    
    <!-- Результат и меры защиты -->
    <h2 style="text-align:center; margin-top:30px;">СОСТАВ МЕР ЗАЩИТЫ ИНФОРМАЦИИ И ИХ БАЗОВЫЕ НАБОРЫ ДЛЯ ТЕКУЩЕГО КЛАССА ЗАЩИЩЕННОСТИ ИНФОРМАЦИОННОЙ СИСТЕМЫ</h2>
    <div v-if="measuresVisible" id="measuresContainer" style="margin-top:20px;">
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
  setup() {
    // уровни ущерба
    const levels = reactive({
      confidentiality: '',
      integrity: '',
      availability: '',
    });

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

    // масштаб системы
    const scale = ref('');
    const scaleDescription = ref('');

    const updateScaleDescription = () => {
      const descriptionsMap = {
        'Федеральный': `<strong>Федеральный масштаб</strong>:<br>Информационная система имеет федеральный масштаб, если она функционирует на территории Российской Федерации (в пределах федерального округа) и включает сегменты в субъектах РФ, муниципальных образованиях и/или организациях. Такая система охватывает всю страну или значительную её часть, требует высоких стандартов защиты.`,
        'Региональный': `<strong>Региональный масштаб</strong>:<br>Информационная система имеет региональный масштаб, если она функционирует на территории одного субъекта РФ и включает сегменты в нескольких муниципальных образованиях или подведомственных организациях. Это системы, обслуживающие конкретный регион, требуют защиты, соответствующей региональной ответственности.`,
        'Объектовый': `<strong>Объектовый масштаб</strong>:<br>Информационная система имеет объектовый масштаб, если она функционирует на отдельных объектах одного федерального органа, органа власти субъекта РФ, муниципального образования или организации, без сегментов в территориальных органах или филиалах. Это локальные системы, например, системы конкретного предприятия или учреждения, с меньшими требованиями к защите, но всё равно соблюдающими базовые стандарты.`,
      };
      scaleDescription.value = descriptionsMap[scale.value] || '';
    };

    // массив мер защиты
    const measuresData = reactive({
      'I. Идентификация и аутентификация субъектов доступа и объектов доступа (ИАФ)': [
        { code: 'ИАФ.1', name: 'Идентификация и аутентификация пользователей, являющихся работниками оператора', class1: '+', class2: '+', class3: '+' },
        { code: 'ИАФ.2', name: 'Идентификация и аутентификация устройств, в том числе стационарных, мобильных и портативных', class1: '+', class2: '+', class3: '' },
        { code: 'ИАФ.3', name: 'Управление идентификаторами, в том числе создание, присвоение, уничтожение идентификаторов', class1: '+', class2: '+', class3: '+' },
        { code: 'ИАФ.4', name: 'Управление средствами аутентификации, в том числе хранение, выдача, инициализация, блокирование средств аутентификации и принятие мер в случае утраты и (или) компрометации средств аутентификации', class1: '+', class2: '+', class3: '+' },
        { code: 'ИАФ.5', name: 'Защита обратной связи при вводе аутентификационной информации', class1: '+', class2: '+', class3: '+' },
        { code: 'ИАФ.6', name: 'Идентификация и аутентификация пользователей, не являющихся работниками оператора (внешних пользователей)', class1: '+', class2: '+', class3: '+' },
        { code: 'ИАФ.7', name: 'Идентификация и аутентификация объектов файловой системы, запускаемых и исполняемых модулей, объектов систем управления базами данных, объектов, создаваемых прикладным и специальным программным обеспечением, иных объектов доступа', class1: '', class2: '', class3: '' },
      ],
      'II. Управление доступом субъектов доступа к объектам доступа (УПД)': [
        { code: 'УПД.1', name: 'Управление (заведение, активация, блокирование и уничтожение) учетными записями пользователей, в том числе внешних пользователей', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.2', name: 'Реализация необходимых методов (дискреционный, мандатный, ролевой или иной метод) и правил разграничения доступа', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.3', name: 'Управление (фильтрация, маршрутизация, контроль соединений, односторонняя передача) информационными потоками между устройствами, сегментами ИС, системами', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.4', name: 'Разделение полномочий (ролей) пользователей, администраторов', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.5', name: 'Назначение минимальных прав и привилегий', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.6', name: 'Ограничение попыток входа', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.7', name: 'Предупреждение при входе', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.8', name: 'Оповещение о предыдущем входе', class1: '', class2: '', class3: '' },
        { code: 'УПД.9', name: 'Ограничение параллельных сеансов', class1: '', class2: '', class3: '+' },
        { code: 'УПД.10', name: 'Блокировка сеанса', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.11', name: 'Разрешение/запрет действий до аутентификации', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.12', name: 'Поддержка атрибутов безопасности', class1: '', class2: '', class3: '' },
        { code: 'УПД.13', name: 'Обеспечение защищенного удаленного доступа', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.14', name: 'Регламентация беспроводных технологий', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.15', name: 'Регламентация мобильных устройств', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.16', name: 'Управление взаимодействием с внешними системами', class1: '+', class2: '+', class3: '+' },
        { code: 'УПД.17', name: 'Обеспечение доверенной загрузки', class1: '', class2: '+', class3: '+' },
      ],
      'III. Ограничение программной среды (ОПС)': [
        { code: 'ОПС.1', name: 'Управление запуском компонентов ПО', class1: '+', class2: '+', class3: '+' },
        { code: 'ОПС.2', name: 'Управление установкой компонентов ПО', class1: '+', class2: '+', class3: '+' },
        { code: 'ОПС.3', name: 'Установка только разрешенного ПО', class1: '+', class2: '+', class3: '+' },
        { code: 'ОПС.4', name: 'Управление временными файлами', class1: '', class2: '', class3: '' },
      ],
      'IV. Защита машинных носителей информации (ЗНИ)': [
        { code: 'ЗНИ.1', name: 'Учет машинных носителей информации', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗНИ.2', name: 'Управление доступом к носителям', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗНИ.3', name: 'Контроль перемещения носителей', class1: '', class2: '', class3: '' },
        { code: 'ЗНИ.4', name: 'Исключение несанкционированного ознакомления', class1: '', class2: '', class3: '' },
        { code: 'ЗНИ.5', name: 'Контроль интерфейсов ввода/вывода', class1: '', class2: '+', class3: '+' },
        { code: 'ЗНИ.6', name: 'Контроль ввода/вывода информации', class1: '', class2: '', class3: '' },
        { code: 'ЗНИ.7', name: 'Контроль подключения носителей', class1: '', class2: '', class3: '' },
        { code: 'ЗНИ.8', name: 'Уничтожение информации на носителях', class1: '+', class2: '+', class3: '+' },
      ],
      'V. Регистрация событий безопасности (РСБ)': [
        { code: 'РСБ.1', name: 'Определение событий для регистрации', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.2', name: 'Определение содержания информации о событиях', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.3', name: 'Сбор, запись и хранение событий', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.4', name: 'Реагирование на сбои регистрации', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.5', name: 'Мониторинг и реагирование', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.6', name: 'Генерация временных меток', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.7', name: 'Защита информации о событиях', class1: '+', class2: '+', class3: '+' },
        { code: 'РСБ.8', name: 'Просмотр и анализ действий', class1: '', class2: '', class3: '' },
      ],
      'VI. Антивирусная защита (АВЗ)': [
        { code: 'АВЗ.1', name: 'Реализация антивирусной защиты', class1: '+', class2: '+', class3: '+' },
        { code: 'АВЗ.2', name: 'Обновление базы признаков', class1: '+', class2: '+', class3: '+' },
      ],
      'VII. Обнаружение вторжений (СОВ)': [
        { code: 'СОВ.1', name: 'Обнаружение вторжений', class1: '', class2: '+', class3: '+' },
        { code: 'СОВ.2', name: 'Обновление правил', class1: '', class2: '+', class3: '+' },
      ],
      'VIII. Контроль (анализ) защищенности информации (АНЗ)': [
        { code: 'АНЗ.1', name: 'Выявление уязвимостей', class1: '+', class2: '+', class3: '+' },
        { code: 'АНЗ.2', name: 'Контроль обновлений ПО', class1: '+', class2: '+', class3: '+' },
        { code: 'АНЗ.3', name: 'Контроль работоспособности средств защиты', class1: '+', class2: '+', class3: '+' },
        { code: 'АНЗ.4', name: 'Контроль состава средств защиты', class1: '+', class2: '+', class3: '+' },
        { code: 'АНЗ.5', name: 'Контроль смены паролей', class1: '+', class2: '+', class3: '+' },
      ],
      'IX. Обеспечение целостности информации (ОЦЛ)': [
        { code: 'ОЦЛ.1', name: 'Контроль целостности ПО', class1: '', class2: '+', class3: '+' },
        { code: 'ОЦЛ.2', name: 'Контроль целостности баз данных', class1: '', class2: '', class3: '' },
        { code: 'ОЦЛ.3', name: 'Обеспечение восстановления ПО', class1: '+', class2: '+', class3: '+' },
        { code: 'ОЦЛ.4', name: 'Обнаружение спама', class1: '+', class2: '+', class3: '+' },
        { code: 'ОЦЛ.5', name: 'Контроль содержания информации', class1: '', class2: '', class3: '' },
        { code: 'ОЦЛ.6', name: 'Ограничение прав ввода информации', class1: '', class2: '', class3: '' },
        { code: 'ОЦЛ.7', name: 'Контроль точности данных', class1: '', class2: '', class3: '' },
        { code: 'ОЦЛ.8', name: 'Контроль ошибок', class1: '', class2: '', class3: '' },
      ],
      'X. Обеспечение доступности информации (ОДТ)': [
        { code: 'ОДТ.1', name: 'Отказоустойчивость', class1: '', class2: '', class3: '+' },
        { code: 'ОДТ.2', name: 'Резервирование', class1: '', class2: '', class3: '+' },
        { code: 'ОДТ.3', name: 'Контроль отказов', class1: '', class2: '+', class3: '+' },
        { code: 'ОДТ.4', name: 'Резервное копирование', class1: '', class2: '+', class3: '+' },
        { code: 'ОДТ.5', name: 'Восстановление данных', class1: '', class2: '+', class3: '+' },
        { code: 'ОДТ.6', name: 'Кластеризация', class1: '', class2: '', class3: '' },
        { code: 'ОДТ.7', name: 'Контроль ресурсов', class1: '', class2: '+', class3: '+' },
      ],
      'XI. Защита среды виртуализации (ЗСВ)': [
        { code: 'ЗСВ.1', name: 'Идентификация и аутентификация в виртуальной инфраструктуре', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗСВ.2', name: 'Управление доступом внутри ВМ', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗСВ.3', name: 'Регистрация событий ВМ', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗСВ.4', name: 'Управление потоками внутри ВМ', class1: '', class2: '+', class3: '+' },
        { code: 'ЗСВ.5', name: 'Доверенная загрузка ВМ', class1: '', class2: '', class3: '' },
        { code: 'ЗСВ.6', name: 'Управление перемещением ВМ', class1: '', class2: '+', class3: '+' },
        { code: 'ЗСВ.7', name: 'Контроль целостности ВМ', class1: '', class2: '+', class3: '+' },
        { code: 'ЗСВ.8', name: 'Резервное копирование ВМ', class1: '', class2: '+', class3: '+' },
        { code: 'ЗСВ.9', name: 'Антивирус в виртуальной среде', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗСВ.10', name: 'Разделение сегментов ВМ', class1: '+', class2: '+', class3: '+' },
      ],
      'XII. Защита технических средств (ЗТС)': [
        { code: 'ЗТС.1', name: 'Защита информации от утечки по каналам', class1: '', class2: '', class3: '' },
        { code: 'ЗТС.2', name: 'Организация контролируемой зоны', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗТС.3', name: 'Контроль доступа', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗТС.4', name: 'Размещение устройств вывода', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗТС.5', name: 'Защита от внешних воздействий', class1: '', class2: '', class3: '' },
      ],
      'XIII. Защита информационной системы, систем связи и передачи данных (ЗИС)': [
        { code: 'ЗИС.1', name: 'Разделение функций', class1: '', class2: '+', class3: '+' },
        { code: 'ЗИС.2', name: 'Предотвращение задержек/прерываний', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.3', name: 'Защита при передаче', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.4', name: 'Обеспечение доверенных каналов', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.5', name: 'Запрет несанкционированной активации', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.6', name: 'Передача и контроль целостности', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.7', name: 'Контроль мобильного кода', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.8', name: 'Контроль передачи речи', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.9', name: 'Контроль передачи видео', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.10', name: 'Подтверждение происхождения информации', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.11', name: 'Обеспечение подлинности соединений', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.12', name: 'Отрицание отправки/получения', class1: '+', class2: '+', class3: '' },
        { code: 'ЗИС.13', name: 'Использование устройств терминального доступа', class1: '', class2: '+', class3: '+' },
        { code: 'ЗИС.14', name: 'Защита архивных файлов', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.15', name: 'Обнаружение скрытых каналов', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.16', name: 'Разделение системы на сегменты', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.17', name: 'Обеспечение загрузки ПО только для чтения', class1: '', class2: '+', class3: '+' },
        { code: 'ЗИС.18', name: 'Изоляция процессов', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.19', name: 'Защита беспроводных соединений', class1: '+', class2: '+', class3: '+' },
        { code: 'ЗИС.20', name: 'Запрет доступа по неавторизованным каналам', class1: '', class2: '', class3: '' },
        { code: 'ЗИС.21', name: 'Обеспечение непрерывности работы', class1: '', class2: '+', class3: '+' },
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
      const classNumber = cls.replace('К', '');

      result.value = `<p style="text-align: center;"><strong>КЛАСС ЗАЩИЩЁННОСТИ: <b>${cls}</b></strong></p>`;
      selectedClassNumber.value = classNumber;
      handleResultAndShowMeasures(classNumber);
    };

const handleResultAndShowMeasures = (klass) => {
  // выполнить какую-то логику с klass
  console.log('Класс:', klass);
  measuresVisible.value = true;
};

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
    };
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