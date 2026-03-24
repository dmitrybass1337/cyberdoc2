<template>
<div class="jumbotron">
    <!-- Основной контейнер -->
<div
  id="SziFormContainer"
  style="
    background: #fff;"
>
      <p style="text-align: center; color: #008CBA; font-weight: bold;">МОДЕЛЬ УГРОЗ</p>
      <label for="selectInfoSysForArm" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Выберите информационную систему:</label>
    <select v-model="selectedSystemId" id="selectInfoSysForCommission" @change="handleSystemChange" class="form-select" style="margin-bottom: 15px;">
        <option v-for="system in systems" :key="system.id" :value="system.id" :data-i-type="system.i_type">
          {{ system.i_name }}
        </option>
      </select>

      <h4 style="text-align: center; color: #E8E8E8;">В РАЗРАБОТКЕ</h4>
      <h3 style="text-align: center; color: #59BBD8;">Модуль формирования модели угроз.</h3>
      <button @click="openModal" class="btn btn-primary mb-3">Моделировать</button>

      <!-- Модальное окно -->
<div v-if="isModalVisible" class="modal-overlay">
  <div class="modal-content">
      <!-- Заголовок -->
      <div class="modal-header">
        <h5 class="modal-title">Модель угроз - {{ selectedSystem?.i_name || 'не выбрана' }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть">&times;</button>
      </div>
      <!-- Основное содержимое -->
<div class="modal-body-wrapper">
  <!-- Боковое меню -->
  <div class="modal-sidebar">
    <div 
      v-for="(item, index) in menuItems" 
      :key="index" 
      @click="selectMenuItem(item.name)"
      :class="['list-group-item', 'list-group-item-action', { active: selectedMenuItem === item.name }]"
    >
      {{ item.label }}
    </div>
  </div>
  
  <!-- Контент справа -->
  <div class="modal-content-area">

    
<!-- Раздел "Владелец" -->
<div v-if="selectedMenuItem === 'owner'" style="max-height: 800px; overflow-y: auto; padding-right: 10px;">
  <div class="mb-3">
    <label for="customerInput" class="form-label">Заказчик</label>
    <input type="text" id="customerInput" class="form-control" v-model="ownerFields.customer" placeholder="Введите заказчика" />
  </div>
  <div class="mb-3">
    <label for="ownerInfoInput" class="form-label">Обладатель информации</label>
    <input type="text" id="ownerInfoInput" class="form-control" v-model="ownerFields.ownerInfo" placeholder="Введите обладателя информации" />
  </div>
  <div class="mb-3">
    <label for="operatorInput" class="form-label">Оператор</label>
    <input type="text" id="operatorInput" class="form-control" v-model="ownerFields.operator" placeholder="Введите оператора" />
  </div>
  <h5>Правовые основания обработки защищаемой информации</h5>
  <div class="mb-3">
    <label for="legalBasisSelect" class="form-label">Правовые основания</label>
    <multiselect
      v-model="legalBasis"
      :options="availableLegalOptions"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      track-by="value"
      label="label"
      placeholder="Добавьте внутренние нормативно правовые акты на информационную систему"
      :showNoOptions="null"
      tagPlaceholder="Добавить"
      selectLabel="Добавить"
    ></multiselect>
  </div>
  
 <h5>Разработка Модели Угроз</h5>
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      id="ownStrengths"
      value="own"
      v-model="developmentFields.developmentType"
    >
    <label class="form-check-label" for="ownStrengths">
      Собственными силами
    </label>
  </div>
  <div class="form-check" style="margin-top: 10px;">
    <input
      class="form-check-input"
      type="radio"
      id="licensee"
      value="licensee"
      v-model="developmentFields.developmentType"
    >
    <label class="form-check-label" for="licensee">
      Лицензиатом
    </label>
  </div>
  <!-- Поле для данных по лицензиату -->
<div v-if="developmentFields.developmentType === 'licensee'" style="margin-top: 10px;">
  <label for="licenseeData" class="form-label">Данные по лицензиату</label>
<input
  type="text"
  id="licenseeData"
  class="form-control"
  :class="licenseeDataValidationClass"
  v-model="developmentFields.licenseeData"
  placeholder="Введите данные по лицензиату, пример: ООО 'Контроль'"
  required
/>
<div v-if="this.developmentFields.licenseeData.trim() !== ''" class="valid-feedback">
  Данные по лицензиату указаны.
</div>
<div v-if="this.developmentFields.licenseeData.trim() === '' && this.developmentFields.developmentType === 'licensee'" class="invalid-feedback">
 Меню заблокировано! Пожалуйста, заполните данные по лицензиату.
</div>
</div>

</div>

    
<div v-if="selectedMenuItem === 'classification'" style="max-height: 800px; overflow-y: auto; padding-right: 10px;">

<div v-if="selectedSystem && selectedSystem.i_type === 'ГИС' && selectedSystem.i_pers === 'Да'">
  <label>Масштаб информационной системы</label>
  <select class="form-select" v-model="scale" @change="updateScaleDescription(); updateClassificationFields();">
    <option disabled value="">Выберите масштаб</option>
    <option>Федеральный</option>
    <option>Региональный</option>
    <option>Объектовый</option>
  </select>
<div v-if="scaleDescription" class="description alert alert-dismissible alert-info" style="padding: 8px;" v-html="scaleDescription"></div>
<label>Конфиденциальность</label>
<select class="form-select" v-model="confidentiality" @change="updateClassificationFields">
  <option disabled value="">Выберите степень ущерба</option>
  <option>Низкий ущерб</option>
  <option>Средний ущерб</option>
  <option>Высокий ущерб</option>
</select>
<div class="alert alert-dismissible alert-success" style="padding: 8px;">
  <span><strong>Конфиденциальность: </strong>Защита информации от несанкционированного доступа и её раскрытия. Обеспечивает, чтобы важные данные были доступны только авторизованным лицам.</span>
</div>
  <label>Целостность</label>
  <select class="form-select" v-model="integrity" @change="updateClassificationFields">
    <option disabled value="">Выберите степень ущерба</option>
    <option>Низкий ущерб</option>
    <option>Средний ущерб</option>
    <option>Высокий ущерб</option>
  </select>
		<div class="alert alert-dismissible alert-primary" style="padding: 8px;">
		<span><strong>Целостность: </strong>Обеспечение неизменности и достоверности информации. Гарантирует, что данные не были случайно или специально изменены без разрешения.</span>
		</div>
  <label>Доступность</label>
  <select class="form-select" v-model="availability" @change="updateClassificationFields">
    <option disabled value="">Выберите степень ущерба</option>
    <option>Низкий ущерб</option>
    <option>Средний ущерб</option>
    <option>Высокий ущерб</option>
  </select>
		<div class="alert alert-dismissible alert-warning" style="padding: 8px;">
		<span><strong>Доступность: </strong>Обеспечение наличия информации и систем в нужное время для авторизованных пользователей. Предотвращает простои системы и обеспечивает непрерывную работу.</span>
		</div>
  <label>Тип угроз</label>
<select class="form-select" v-model.number="ugroza" @change="calculateUgroza">
  <option disabled :value="null">Выберите тип угроз</option>
  <option :value="1">Тип угроз 1</option>
  <option :value="2">Тип угроз 2</option>
  <option :value="3">Тип угроз 3</option>
</select>

  <label>Тип ИСПДн</label>
  <select class="form-select" v-model="type_ispdn" @change="updateClassificationFields">
    <option disabled :value="null">Выберите тип ИСПДн</option>
    <option>Специальная ИСПДн</option>
    <option>Биометрическая ИСПДн</option>
    <option>Общедоступна ИСПДн</option>
    <option>Иная ИСПДн</option>
  </select>

  <label>Субъекты персональных данных</label>
  <select class="form-select" v-model="subjects" @change="updateClassificationFields">
    <option disabled value="">Выберите субъектов ПДн</option>
    <option>Сотрудники организации</option>
    <option>Иные лица</option>
  </select>

  <label>Количество субъектов ПДн</label>
  <select class="form-select" v-model="quantity" @change="updateClassificationFields">
    <option disabled value="">Выберите количество ПДн</option>
    <option>Менее 100 000 субъектов</option>
    <option>Более 100 000 субъектов</option>
  </select>

</div>

  <!-- Проверка для system.i_type == 'ИСПДн' и system.i_pers == 'Да' -->
<div v-else-if="selectedSystem && selectedSystem.i_type === 'ИСПДн' && selectedSystem.i_pers === 'Да'">
  <label>Тип угроз</label>
  <select class="form-select" v-model="threatType" @change="updateClassificationFields">
    <option disabled value="">Выберите тип угроз</option>
    <option>Тип угроз 1</option>
    <option>Тип угроз 2</option>
    <option>Тип угроз 3</option>
  </select>

  <label>Тип ИСПДн</label>
  <select class="form-select" v-model="ispType" @change="updateClassificationFields">
    <option disabled value="">Выберите тип ИСПДн</option>
    <option>Специальная ИСПДн</option>
    <option>Биометрическая ИСПДн</option>
    <option>Общедоступна ИСПДн</option>
    <option>Иная ИСПДн</option>
  </select>

  <label>Субъекты персональных данных</label>
  <select class="form-select" v-model="subjects" @change="updateClassificationFields">
    <option disabled value="">Выберите субъектов ПДн</option>
    <option>Сотрудники организации</option>
    <option>Иные лица</option>
  </select>

  <label>Количество субъектов ПДн</label>
  <select class="form-select" v-model="quantity" @change="updateClassificationFields">
    <option disabled value="">Выберите количество ПДн</option>
    <option>Менее 100 000 субъектов</option>
    <option>Более 100 000 субъектов</option>
  </select>

</div>  

  <!-- Проверка для system.i_type == 'ГИС' и system.i_pers == 'Нет' -->
<div v-else-if="selectedSystem && selectedSystem.i_type === 'ГИС' && selectedSystem.i_pers === 'Нет'">
  <label>Масштаб информационной системы</label>
  <select class="form-select" v-model="currentMashtab" @change="updateClassificationFields">
    <option disabled value="">Выберите масштаб</option>
    <option>Федеральный</option>
    <option>Региональный</option>
    <option>Объектовый</option>
  </select>
<div v-if="scaleDescription" class="description alert alert-dismissible alert-info" v-html="scaleDescription"></div>
  <label>Конфиденциальность</label>
  <select class="form-select" v-model="confidentiality" @change="updateClassificationFields">
    <option disabled value="">Выберите степень ущерба</option>
    <option>Низкий ущерб</option>
    <option>Средний ущерб</option>
    <option>Высокий ущерб</option>
  </select>
		<div class="alert alert-dismissible alert-success" style="padding: 8px;">
		<span><strong>Конфиденциальность: </strong>Защита информации от несанкционированного доступа и её раскрытия. Обеспечивает, чтобы важные данные были доступны только авторизованным лицам.</span>
		</div>
  <label>Целостность</label>
  <select class="form-select" v-model="integrity" @change="updateClassificationFields">
    <option disabled value="">Выберите степень ущерба</option>
    <option>Низкий ущерб</option>
    <option>Средний ущерб</option>
    <option>Высокий ущерб</option>
  </select>
		<div class="alert alert-dismissible alert-primary">
		<span><strong>Целостность: </strong>Обеспечение неизменности и достоверности информации. Гарантирует, что данные не были случайно или специально изменены без разрешения.</span>
		</div>
  <label>Доступность</label>
  <select class="form-select" v-model="availability" @change="updateClassificationFields">
    <option disabled value="">Выберите степень ущерба</option>
    <option>Низкий ущерб</option>
    <option>Средний ущерб</option>
    <option>Высокий ущерб</option>
  </select>
		<div class="alert alert-dismissible alert-warning" style="padding: 8px;">
		<span><strong>Доступность: </strong>Обеспечение наличия информации и систем в нужное время для авторизованных пользователей. Предотвращает простои системы и обеспечивает непрерывную работу.</span>
		</div>
</div>


</div>
<div v-if="selectedMenuItem === 'reldamage'" style="max-height: 180vh; overflow-y: auto;">
  <h5>Категории нарушителей и реализации угроз</h5>
<div v-for="offender in offendersWithGoals" :key="offender.id">
  <strong>{{ offender.name }} [Тип: {{ offender.type }}]</strong>
      <ul>
<li v-for="goal in this.offenderImpactGoalsOptions2(offender)" :key="goal.value">
  {{ goal.label }}
</li>
      </ul>
  <!-- Интерфейсы -->
  <div style="margin-top: 10px;">
    <label>Интерфейсы воздействия нарушителя</label>
    <multiselect
      v-model="offendersImpactDetails[offender.id].interfaces"
      :options="interfaceOptions"
      :multiple="true"
      track-by="value"
      label="label"
      placeholder="Выберите интерфейсы"
    ></multiselect>
  </div>
  
  <!-- Объекты воздействия -->
  <div style="margin-top: 10px;">
    <label>Объекты воздействия нарушителем</label>
    <multiselect
      v-model="offendersImpactDetails[offender.id].objects"
      :options="impactObjectsOptions"
      :multiple="true"
      track-by="value"
      label="label"
      placeholder="Выберите объекты воздействия"
    ></multiselect>
  </div>
  
  <!-- Способы реализации -->
  <div style="margin-top: 10px;">
    <label>Способы реализации угрозы</label>
    <multiselect
      v-model="offendersImpactDetails[offender.id].methods"
      :options="impactMethodsOptions"
      :multiple="true"
      track-by="value"
      label="label"
      placeholder="Выберите способы реализации"
    ></multiselect>
  </div>
</div>
</div>

<div v-if="selectedMenuItem === 'segment'" style="max-height: 800px; overflow-y: auto; padding-right: 10px;">
  <h5>Структура системы</h5>
  
<!-- Выбор типа сегмента -->
<div class="mb-3">
<label for="segmentTypeSelect" class="form-label">Сегментация ИС</label>
<select v-model="segmentFields.segmentType" id="segmentTypeSelect" class="form-select" @change="handleSegmentTypeChange">
  <option value="распределённая">Распределённая</option>
  <option value="локальная">Локальная</option>
</select>
</div>


<!-- Мультиселект показывать только если выбран "распределённая" -->
<div class="mb-3" v-if="segmentFields.segmentType === 'распределённая'">
  <label for="SysSegmentTypeSelect" class="form-label">Выберите Сегменты</label>
  <multiselect
    v-model="segmentFields.segmentSystem"
    :options="availablecurrentSegmentOptions"
    :multiple="true"
    track-by="value"
    label="label"
    placeholder="Выберите сегменты"
    :showNoOptions="null"
    tagPlaceholder="Добавить"
    selectLabel="Добавить"
  ></multiselect>
</div>
  <div class="mb-3">
    <label for="controlZoneLimitSelect" class="form-label">Предел контролируемой зоны</label>
    <select v-model="segmentFields.controlZoneLimit" id="controlZoneLimitSelect" class="form-select">
      <option value="одна">Одна контролируемая зона</option>
      <option value="несколько">Несколько контролируемых зон</option>
    </select>
  </div>
  
  <div class="mb-3">
    <label for="processingModeSelect" class="form-label">Режим обработки данных</label>
    <select v-model="segmentFields.processingMode" id="processingModeSelect" class="form-select">
      <option value="многопользовательский">Многопользовательский</option>
      <option value="однопользовательский">Однопользовательский</option>
    </select>
  </div>
  
  <div class="mb-3">
    <label for="controlSystemSelect" class="form-label">Управление ИС</label>
    <select v-model="segmentFields.controlSystem" id="controlSystemSelect" class="form-select">
      <option value="различных сетевых адресов">Осуществляется с различных сетевых адресов</option>
      <option value="одного сетевого адреса">Осуществляется с одного сетевого адреса</option>
    </select>
  </div> 
</div>
<div v-if="selectedMenuItem === 'isostav'" style="max-height: 1000px; overflow-y: auto; padding-right: 10px;">
  <h5>Состав информации</h5>
<br />
  <div class="form-check">
    <input
      class="form-check-input"
      type="checkbox"
      id="confidentialInfo"
      v-model="isostavFields.confidentialInfo"
    >
    <label class="form-check-label" for="confidentialInfo">
      КОНФИДЕНЦИАЛЬНАЯ (СЛУЖЕБНАЯ) ИНФОРМАЦИЯ ОГРАНИЧЕННОГО ДОСТУПА
    </label>
  </div>
  <div class="form-check">
    <input
      class="form-check-input"
      type="checkbox"
      id="personalData"
      v-model="isostavFields.personalData"
    >
    <label class="form-check-label" for="personalData">
      ПЕРСОНАЛЬНЫЕ ДАННЫЕ
    </label>
  </div>
  <div class="form-check">
    <input
      class="form-check-input"
      type="checkbox"
      id="technologicalInfo"
      v-model="isostavFields.technologicalInfo"
    >
    <label class="form-check-label" for="technologicalInfo">
      СЛУЖЕБНАЯ ТЕХНОЛОГИЧЕСКАЯ ИНФОРМАЦИЯ ОГРАНИЧЕННОГО ДОСТУПА
    </label>
  </div>
<br />
  <h5>Основные процессы</h5>

<div class="mb-3">
  <label for="classProcessSelect" class="form-label">Класс процесса</label>
  <select v-model="mainProcessFields.processClass" id="classProcessSelect" class="form-select">
    <option value="управленческие">Управленческие</option>
    <option value="организационные">Организационные</option>
    <option value="технологические">Технологические</option>
    <option value="производственные">Производственные</option>
    <option value="финансы">Финансово-экономические</option>
    <option value="иные">Иные</option>
  </select>
</div>

<!-- Далее, для выбора конкретных процессов, например -->
<div class="mb-3" v-if="mainProcessFields.processClass">
  <label for="processOptions" class="form-label">Выберите процессы</label>
  <multiselect
    v-model="selectedProcessOptionsByClass[mainProcessFields.processClass]"
    :options="availablecurrentProcessOptions"
    :multiple="true"
    placeholder="Выберите процессы и введите свой"
    track-by="value"
    label="label"
    :showNoOptions="null"
    tagPlaceholder="Добавить"
    selectLabel="Добавить"
    :showNoResults="null"
    :noResult="null"
    :taggable="true"
    @tag="addCustomProcess"
  ></multiselect>
</div>
  
  
  
</div>

<div v-if="selectedMenuItem === 'tehnology'">
  <h5>Технологии</h5>
  <div class="row">
    <div 
      class="col-md-8 mb-3" 
      v-for="(tehnolg, index) in TehnologyOptions" 
      :key="index"
    >
      <div class="card border-primary" style="width: auto;">
        <div class="card-body align-items-center">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'tehnolgSwitch' + index"
              :value="tehnolg.value"
              v-model="selectedTehnology"
            >
<label class="form-check-label" :for="'tehnolgSwitch' + index" v-html="tehnolg.label"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-if="selectedMenuItem === 'offenders'" style="max-height: 800px; overflow-y: auto; padding-right: 10px;">
  <h5>Категория нарушителей и цели реализации угроз</h5>
  <div>
    <div v-for="offender in offenders" :key="offender.id" style="margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
      <div style="background-color: #f7f7f7; padding: 3px; cursor: pointer;" @click="offender.isOpen = !offender.isOpen">
<h6 style="display: flex; justify-content: space-between; align-items: center;">
  <span>
    {{ offender.name }} [Вид нарушителя - {{ offender.type }}]
  </span>
  <span v-html="getIcon(offender)" style="color: #008CBA;"></span>
</h6>
      </div>
      <div v-if="offender.isOpen" style="padding: 10px;">
        <multiselect
          v-model="offender.selectedGoals"
          :options="offenderImpactGoalsOptions(offender)"
          :multiple="true"
          track-by="value"
          label="label"
          placeholder="Возможные цели реализации угроз"
          :showNoOptions="null"
          tagPlaceholder="Добавить"
          selectLabel=""
          :showNoResults="null"
          :noResult="null"
        ></multiselect>
      </div>
    </div>
  </div>
</div>

<div v-if="selectedMenuItem === 'consequences'">
<div v-for="damage in damageTypes" :key="damage.id" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
  <div class="form-check">
    <input
      class="form-check-input"
      type="checkbox"
      v-model="damage.chosen"
      :id="damage.id"
    >
    <label :for="damage.id" class="form-check-label">{{ damage.description }}</label>
  </div>
  <div v-if="damage.chosen" style="margin-top: 10px;">
<multiselect
  v-model="damage.selectedConsequences"
  :options="availableConsequences[damage.id]"
  :multiple="true"
  placeholder="Выберите негативные последствия"
  :showNoOptions="null"
  tagPlaceholder="Добавить"
  selectLabel=""
  :showNoResults="null"
  :noResult="null"
  :multipleLabel="'multiselect-multiple-label'"
></multiselect>
  </div>
</div>
</div>



<div v-if="selectedMenuItem === 'vozdeistvie'">
  <h5>Воздействия на категории объектов</h5>

  <!-- Перечень видов воздействия -->
  <div style="margin-bottom: 15px;">
  </div>

  <!-- Выводим название ущерба и выбранные последствия -->
  <div v-for="damage in damageTypes" :key="damage.id" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
    <h6>{{ damage.description }}</h6>
    <div>
      <strong>Выбранные последствия:</strong>
      <ul>
        <li v-for="consequence in getSelectedConsequences(damage.id)" :key="consequence">{{ consequence }}</li>
      </ul>
      
      <!-- Мультиселект объектов воздействия -->
      <label>Категории объектов воздействия:</label>
<multiselect
  v-model="damageImpactObjects[damage.id]"
  :options="impactObjectsOptions"
  :multiple="true"
  placeholder="Выберите объекты воздействия"
  tag-placeholder="Добавить"
  label="label"
  track-by="value"
  @change="() => saveImpactObjects(damage.id)"
></multiselect>
    </div>
  </div>
</div>



<div v-if="selectedMenuItem === 'objects'">
  <h5>Обьекты воздействия (категиории и состав)</h5>

<table class="table table-bordered">
  <thead>
    <tr class="table-success">
      <th>Объект воздействия</th>
      <th>Просмотр</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>информация (данные), содержащаяся в системах и сетях</td>
      <td>
        <button class="btn btn-primary" @click="showObjectsImpact">
          <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td>программно-аппаратные средства обработки и хранения информации</td>
      <td>
        <button class="btn btn-primary" @click="OpenArmModal">
          <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td>телекоммуникационное оборудование</td>
      <td>
        <button class="btn btn-primary" @click="OpenNetEquipmentModal">
          <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td>программные средства</td>
      <td>
        <button class="btn btn-primary" @click="openSoftwareModal">
          <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td>средства защиты информации</td>
      <td>
        <button class="btn btn-primary" @click="OpenSecurityToolsModal">
          <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>


<!-- Модальное окно для отображения выбранных данных -->
<div v-if="showObjectsImpactModal" class="nested-modal-backdrop">
  <div class="nested-modal-content" style="max-width: 500px;">
    <h5>Объекты воздействия</h5>
    
    <!-- Если impactObjects пусты, показываем сообщение и кнопку -->
    <div v-if="impactObjects.length === 0" style="text-align: center;">
      <p>Выберите Состав обробатываемой информации на вкладке Состав и процессы (Состав информации)</p>
      <button class="btn btn-primary" @click="navigateToIsostav" style="margin-top: 10px;">Перейти к разделу "Состав информации"</button>
    </div>
    
    <!-- Иначе, показываем список -->
    <ul v-else>
      <li v-for="(item, index) in impactObjects" :key="index">{{ item }}</li>
    </ul>
    
    <!-- Кнопка закрытия -->
    <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
      <button class="btn btn-primary" @click="closeObjectsImpact">
        Закрыть
      </button>
    </div>
  </div>
</div>
  




<!-- Модальное окно с техническими средствами -->
<div v-if="showArmModal" class="nested-modal-backdrop">
  <div class="nested-modal-content" style="max-width: 600px;">
    <h5>Технические средства системы</h5>
    <ul>
      <li v-for="arm in allArmData" :key="arm.id">
        {{ arm.a_type }} - Инв.№ {{ arm.a_invert}}<br>
        <!-- Можно добавить другие поля -->
      </li>
    </ul>
    <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
      <button class="btn btn-primary" @click="closeArmModal">
        Закрыть
      </button>
    </div>
  </div>
</div>



<!-- Модальное окно для сетевого оборудования -->
<div v-if="showNetEquipmentModal" class="nested-modal-backdrop">
  <div class="nested-modal-content" style="max-width: 600px;">
    <h5>Сетевое оборудование</h5>
    <ul>
      <li v-for="item in netEquipment" :key="item.id">
        {{ item.net_type }} {{ item.net_model }}<br>
        <!-- Можно добавить другие поля по необходимости -->
      </li>
    </ul>
    <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
      <button class="btn btn-primary" @click="closeNetEquipmentModal">
        Закрыть
      </button>
    </div>
  </div>
</div>



<!-- Модальное окно для системного и прикладного ПО -->
<div v-if="showSoftwareModal" class="nested-modal-backdrop">
  <div class="nested-modal-content" style="max-width: 700px;">
    <h5>Системное программное обеспечение</h5>
    <ul>
      <li v-for="sys in systemSoftware" :key="sys.id">
        {{ sys.os_name }} - Версия: {{ sys.supplier }}<br>
      </li>
    </ul>
<h5 style="margin-top:20px;">Прикладное программное обеспечение</h5>
<ul>
  <li v-for="(app) in displayApplicationSoftware" :key="app.id">
    {{ app.app_name }} - Версия: {{ app.app_version }}<br>
  </li>
</ul>
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
  <button class="btn btn-secondary" @click="showAllApps = !showAllApps">
    {{ showAllApps ? 'Свернуть' : 'Показать все' }}
  </button>
  <button class="btn btn-primary" @click="closeSoftwareModal" style="margin-top: 0;">
    Закрыть
  </button>
</div>
  </div>
</div>


  <!-- Модальное окно для отображения программно-аппаратных -->
  <div v-if="showSecurityToolsModal" class="nested-modal-backdrop">
    <div class="nested-modal-content" style="max-width: 600px;">
      <h5>Средства защиты информации</h5>
      <ul>
        <li v-for="tool in securityTools" :key="tool.id">
          {{ tool.st_name }}<br>
        </li>
      </ul>
    <!-- Контейнер для кнопки с выравниванием по правому краю -->
    <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
      <button class="btn btn-primary" @click="closeSecurityToolsModal">
        Закрыть
      </button>
    </div>
    </div>
  </div>



<!-- Объекты воздействия: Машинные носители информации -->

<div style="margin-bottom: 15px;">
  <p>машинные носители информации</p>
</div>

<!-- Название и селект -->
<multiselect
  v-model="mediaStorageType"
  :options="availablemediaStorageOptions"
  :multiple="true"
  track-by="value"
  label="label"
  placeholder="Выберите тип носителя"
  :showNoOptions="null"
  tagPlaceholder="Добавить"
  selectLabel="Добавить"
  :showNoResults="null"
  :noResult="null"
  @change="savedMediaStorage"
></multiselect>


<!-- Новый объект воздействия пользователи -->
<div style="margin-bottom: 15px;">
  <p>привилегированные и непривилегированные пользователи систем и сетей, а также интерфейсы взаимодействия с ними;</p>
</div>
<!-- Название и мультиселект -->
<multiselect
  v-model="impactObjectsUsers"
  :options="availableimpactObjectsUserOptions"
  :multiple="true"
  track-by="value"
  label="label"
  placeholder="Выберите пользователей"
  :showNoOptions="null"
  tagPlaceholder="Добавить"
  selectLabel="Добавить"
  :showNoResults="null"
  :noResult="null"
></multiselect>


<!-- Новый объект воздействия -->
<div style="margin-bottom: 15px;">
  <p>обеспечивающие системы предназначенные для оказания услуг предоставляемых сторонними организациями, от которых зависит функционирование системы и сети</p>
</div>
<!-- Название и мультиселект -->
  <multiselect
    v-model="impactObjectsSupportingSystems"
    :options="availableSupportingSystemsOptions"
    :multiple="true"
    track-by="value"
    label="label"
    placeholder="Выберите системы"
    :showNoOptions="null"
    tagPlaceholder="Добавить"
    selectLabel="Добавить"
    :showNoResults="null"
    :noResult="null"
    :close-on-select="true"
  ></multiselect>

</div>

<div v-if="selectedMenuItem === 'vidobjects'" style="max-height: 800px; overflow-y: auto; padding-right: 10px;">
  <h6>Виды воздействия</h6>
  <div v-for="damage in damageTypes" :key="damage.id" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
    <h6><strong>{{ damage.description }}</strong></h6>
    
    <!-- существующие последствия -->
    <!-- ... ваш контент ... -->

    <!-- Категории объектов воздействия -->
    <div>
      <h6>Категории объектов воздействия:</h6>
      <ul>
        <li v-for="category in getSavedImpactObjects(damage.id)" :key="category.value">
          <strong>{{ category.label }}</strong>
          <ul>
            <li v-for="obj in getImpactObjectDetails(category.value)" :key="typeof obj === 'object' ? obj.id : obj">
              {{ typeof obj === 'object' ? obj.name : obj }}
              <multiselect
                v-model="damageImpactEffectsByDamage[damage.id][getImpactEffectKey(category.label || category, typeof obj === 'object' ? obj.name : obj)]"
                :options="impactEffectOptions"
                track-by="value"
                label="label"
                :multiple="true"
                placeholder="Выберите виды воздействия"
                tag-placeholder="Добавить"
                selectLabel="Добавить"
                :showNoOptions="null"
                :showNoResults="null"
                @change="() => updateImpactEffects(damage.id, getImpactEffectKey(category.label || category, typeof obj === 'object' ? obj.name : obj))"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</div>


    <!-- Здесь можно добавить другие разделы по необходимости -->

</div>


      </div>
      <!-- Кнопки -->
<div class="modal-footer">
  <button type="button" class="btn btn-info" @click="closeModal">Закрыть</button>
  <button type="button" class="btn btn-primary" @click="saveModel">Сохранить</button>
</div>
  </div>
</div>

    </div>
</div>
</template>

<script>
import { reactive } from 'vue';
import Multiselect from 'vue-multiselect'
export default {
  setup() {
    const damageImpactEffectsByDamage = reactive({});

    // Инициализация структуры при создании компонента
    function initializeDamageEffects() {
      this.damageTypes.forEach(damage => {
        if (!damageImpactEffectsByDamage[damage.id]) {
          damageImpactEffectsByDamage[damage.id] = {};
        }
        // Инициализация для каждого ключа
        const keys = this.getImpactObjectDetails(damage.category);
        keys.forEach(key => {
          if (!damageImpactEffectsByDamage[damage.id][key]) {
            damageImpactEffectsByDamage[damage.id][key] = [];
          }
        });
      });
    }

    return {
      damageImpactEffectsByDamage,
      initializeDamageEffects,
    };
  },
  components: { Multiselect },
  name: "ModelUComponent",
  data() {
    return {
    offendersImpactDetails: {}, // сюда будем сохранять выбранные значения
    interfaceOptions: [
      { value: 'external_network', label: 'внешние сетевые интерфейсы, обеспечивающие взаимодействие с сетью «Интернет», смежными (взаимодействующими) системами или сетями (проводные, беспроводные, веб-интерфейсы, интерфейсы удаленного доступа и др.)'},
      { value: 'internal_network', label: 'внутренние сетевые интерфейсы, обеспечивающие взаимодействие (в том числе через промежуточные компоненты) с компонентами систем и сетей, имеющими внешние сетевые интерфейсы (проводные, беспроводные)'},
      { value: 'user_interfaces', label: 'интерфейсы для пользователей (проводные, беспроводные, веб-интерфейсы, интерфейсы удаленного доступа и др.)'},
      { value: 'removable_media', label: 'интерфейсы для использования съемных машинных носителей информации и периферийного оборудования'},
      { value: 'administration_interfaces', label: 'интерфейсы для установки, настройки, испытаний, пусконаладочных работ (в том числе администрирования, управления, обслуживания) обеспечения функционирования компонентов систем и сетей'}
    ],
    impactMethodsOptions: [
      { value: 'vulnerabilities', label: 'использование уязвимостей (уязвимостей кода (программного обеспечения), уязвимостей архитектуры и конфигурации систем и сетей, а также организационных и многофакторных уязвимостей)' },
      { value: 'malware', label: 'внедрение вредоносного программного обеспечения' },
      { value: 'exploits', label: 'использование недекларированных возможностей программного обеспечения и (или) программно-аппаратных средств' },
      { value: 'backdoors', label: 'установка программных и (или) программно-аппаратных закладок в программное обеспечение и (или) программно-аппаратные средства' },
      { value: 'hidden_channels', label: 'формирование и использование скрытых каналов (по времени, по памяти) для передачи конфиденциальных данных' },
      { value: 'physical_attacks', label: 'перехват (измерение) побочных электромагнитных излучений и наводок (других физических полей) для доступа к конфиденциальной информации, содержащейся в аппаратных средствах аутентификации' },
      { value: 'invaziv', label: 'инвазивные способы доступа к конфиденциальной информации, содержащейся в аппаратных средствах аутентификации' },
      { value: 'postavka_soft', label: 'нарушение безопасности при поставках программных, программноаппаратных средств и (или) услуг по установке, настройке, испытаниям, пусконаладочным работам (в том числе администрированию, обслуживанию)' },
      { value: 'poor_make', label: 'ошибочные действия в ходе создания и эксплуатации систем и сетей, в том числе при установке, настройке программных и программно-аппаратных средств' },
    ],
    offenders: [
      {
        id: 1,
        name: 'Специальные службы иностранных государств',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'damage_defense',
            label: 'Нанесение ущерба государству в области обеспечения обороны, безопасности и правопорядка, а также в иных отдельных областях его деятельности или секторах экономики, в том числе дискредитация или дестабилизация деятельности отдельных органов государственной власти, организаций, получение конкурентных преимуществ на уровне государства, срыв заключения международных договоров, создание внутриполитического кризиса'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 2,
        name: 'Террористические, экстремистские группировки',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'terrorist_attacks',
            label: 'Совершение террористических актов, угроза жизни граждан.'
          },
          {
            value: 'damage_sferagov',
            label: 'Нанесение ущерба отдельным сферам деятельности или секторам экономики государства.'
          },
          {
            value: 'society_destabilization',
            label: 'Дестабилизация общества.'
          },
          {
            value: 'gov_destabilization',
            label: 'Дестабилизация деятельности органов государственной власти, организаций.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией.'
          }
        ],
        selectedGoals: []
      },
      {
        id: 3,
        name: 'Преступные группы (криминальные структуры)',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'self_realization',
            label: 'Желание самореализации (подтверждение статуса)'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией.'
          }
        ],
        selectedGoals: []
      },
      {
        id: 4,
        name: 'Отдельные физические лица (хакеры)',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'curiosity_self_realization',
            label: 'Любопытство или желание самореализации (подтверждение статуса).'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 5,
        name: 'Конкурирующие организации',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'competitive_advantages',
            label: 'Получение конкурентных преимуществ.'
          },
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 6,
        name: 'Разработчики программных, программноаппаратных средств',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'additional_functionality',
            label: 'Внедрение дополнительных функциональных возможностей в программные или программноаппаратные средства на этапе разработки.'
          },
          {
            value: 'competitive_advantages',
            label: 'Получение конкурентных преимуществ.'
          },
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 7,
        name: 'Лица, обеспечивающие поставку программных, программноаппаратных средств, обеспечивающих систем',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'competitive_advantages',
            label: 'Получение конкурентных преимуществ.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 8,
        name: 'Поставщики вычислительных услуг, услуг связи',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'competitive_advantages',
            label: 'Получение конкурентных преимуществ.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 9,
        name: 'Лица, привлекаемые для установки, настройки, испытаний, пусконаладочных и иных видов работ',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'competitive_advantages',
            label: 'Получение конкурентных преимуществ.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 10,
        name: 'Лица, обеспечивающие функционирование систем и сетей или обеспечивающие системы оператора(администрация, охрана, уборщики и т.д.)',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 11,
        name: 'Авторизованные пользователи систем и сетей',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'curiosity_self_realization',
            label: 'Любопытство или желание самореализации (подтверждение статуса).'
          },
          {
            value: 'revenge',
            label: 'Месть за ранее совершенные действия.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 12,
        name: 'Системные администраторы и администраторы безопасности',
        type: 'Внутренний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'curiosity_self_realization',
            label: 'Любопытство или желание самореализации (подтверждение статуса).'
          },
          {
            value: 'revenge',
            label: 'Месть за ранее совершенные действия.'
          },
          {
            value: 'unintentional_actions',
            label: 'Непреднамеренные, неосторожные или неквалифицированные действия.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      },
      {
        id: 13,
        name: 'Бывшие работники (пользователи)',
        type: 'Внешний',
        impactGoals: [
          {
            value: 'financial_benefit',
            label: 'Получение финансовой или иной материальной выгоды.'
          },
          {
            value: 'revenge',
            label: 'Месть за ранее совершенные действия.'
          },
          {
            value: 'not_motiv',
            label: 'Не обладает мотивацией'
          }
        ],
        selectedGoals: []
      }
    ],
segmentOptions: [
  { value: 'server_segment', label: 'Серверный сегмент' },
  { value: 'user_segment', label: 'Пользовательский сегмент' },
  { value: 'attached_users_segment', label: 'Сегмент привилегированных пользователей' },
  { value: 'integrator_segment', label: 'Сегмент интегратора (разработчика)' },
  { value: 'mobile_devices_segment', label: 'Сегмент мобильных устройств' }
],
fieldNames: {
  personalData: 'Персональные данные',
  confidentialInfo: 'Конфиденциальная (служебная) информация',
  technologicalInfo: 'Служебная технологическая информация'
},
    showAllApps: false,
ugrozaLevel: 'не определен', // сюда будем сохранять результат
ugroza: null, // или начальное значение
type_ispdn: null,
type_sotrud: null,
kolvo: null,
	klass: '',
	currentClassGis: '',
	key: '',
	classNumber: '',
    scale: '', // или начальное значение
    scaleDescription: '', // или начальное значение
    uz: '',
    currentMashtab: '',
    confidentiality: '',
    integrity: '',
    availability: '',
    threatType: '',
    ispType: '',
    subjects: '',
    quantity: '',
    selectedProcessOptionsByClass: {
      управленческие: [],
      организационные: [],
      технологические: [],
      производственные: [],
      финансы: [], // добавьте остальные классы по необходимости
      иные: []
    },
savedLegalBasis: [],
savedIsostavFields: [],
savedOptionsByClass: [],
savedClassificationFields: {},
// Сохраняемые переменные
developmentFields: {
  developmentType: 'own', // или 'licensee'
  licenseeData: ''
},
organizationData: null,

damageImpactEffects: {
  damage1: [],
  damage2: [],
  damage3: []
},
damageObjectImpactEffects: {}, // сюда динамически будем добавлять массивы для каждого объекта
impactEffectOptions: [
  { value: 'confidentiality_breach', label: 'Утечка (перехват) конфиденциальной информации или отдельных данных' },
  { value: 'unauthorized_access', label: 'Несанкционированный доступ к компонентам' },
  { value: 'denial_of_service', label: 'Отказ в обслуживании компонентов' },
  { value: 'integrity_modification', label: 'Несанкционированная модификация, подмена, искажение' },
  { value: 'unauthorized_resources', label: 'Несанкционированное использование ресурсов' },
  { value: 'malfunction', label: 'Нарушение функционирования программно-аппаратных средств' }
],
    // Для хранения сохраненных данных
    savedDamageImpactObjects: {
      damage1: [],
      damage2: [],
      damage3: []
    },
    damageImpactObjects: {
      damage1: [], // для ущерба 1
      damage2: [], // для ущерба 2
      damage3: []  // для ущерба 3
    },
    impactObjectsOptions: [
      { value: 'isostav_fields', label: 'Информация (данные)' },
      { value: 'arm_systems', label: 'Технические средства системы' },
      { value: 'telecommunication_equipment', label: 'Телекоммуникационное оборудование' },
      { value: 'software', label: 'Программные средства' },
      { value: 'security_tools', label: 'Средства защиты информации' },
      { value: 'storage_media', label: 'Машинные носители информации' },
      { value: 'user_systems', label: 'Пользователи системы' },
      { value: 'supporting_systems', label: 'Обеспечивающие системы' }
    ],
    damage1ImpactObjects: [], // объекты воздействия для ущерба 1
    damage2ImpactObjects: [], // для ущерба 2
    damage3ImpactObjects: [], // для ущерба 3
    savedDamageConsequences: [], // сюда сохраняем выбранные последствия
    damage1Consequences: [],
    damage2Consequences: [],
    damage3Consequences: [],
    savedSoftwareData: null, // сюда будем сохранять оба набора данных
    // Добавляем переменные для хранения сохраненных данных
    savedImpactObjects: [],
    savedAllArmData: [],
    savedNetEquipment: [],
    savedSystemSoftware: [],
    savedApplicationSoftware: [],
    savedSecurityTools: [],
    savedImpactObjectsUsers: [],
    savedOffendersGoals: [],
    savedImpactObjectsSupportingSystems: [],
    impactObjectsSupportingSystems: [], // выбранные системы
    impactObjectsSupportingSystemsOptions: [
      { value: 'power_supply', label: 'система электроснабжения' },
      { value: 'climate_control', label: 'система кондиционирования' },
      { value: 'security_fire', label: 'система охраны или пожаротушения' },
      { value: 'not_support', label: 'не применяются' }
    ],
    impactObjectsUsers: [], // выбранные пользователи
    impactObjectsUserOptions: [
      { value: 'admins', label: 'Администраторы ИБ' },
      { value: 'sys_admins', label: 'Администраторы ИС' },
      { value: 'users', label: 'Пользователи ИС' }
    ],
    savedMediaStorage: [],
    mediaStorageType: [], // массив выбранных
    mediaStorageOptions: [
      { value: 'removable', label: 'Съемные машинные носители информации' },
      { value: 'non_removable', label: 'Несъемные машинные носители информации' }
    ],
    netEquipment: [], // массив сетевого оборудования
    showNetEquipmentModal: false, // управление окном
    showSoftwareModal: false,
    systemSoftware: [], // для системного ПО
    applicationSoftware: [], // для прикладного ПО
    showArmModal: false,
    allArmData: [],
    currentSelectedSystemId: null,
    securityTools: [], // массив для хранения программно-аппаратных средств
    showSecurityToolsModal: false, // состояние модального окна
    impactObjects: [], // сюда будут загружаться выбранные значения
    showObjectsImpactModal: false, // состояние модального окна
    damageTypes: [
    {
    id: 'damage1',
    description: 'Ущерб физическому лицу',
    chosen: false,
    consequences: [
      'Угроза жизни или здоровью.',
      'Унижение достоинства личности.',
      'Нарушение свободы, личной неприкосновенности.',
      'Нарушение неприкосновенности частной жизни.',
      'Нарушение личной, семейной тайны, утрата чести и доброго имени.',
      'Нарушение тайны переписки, телефонных переговоров, иных сообщений.',
      'Нарушение иных прав и свобод гражданина, закрепленных в Конституции Российской Федерации и федеральных законах.',
      'Финансовый, иной материальный ущерб физическому лицу.',
      'Нарушение конфиденциальности (утечка) персональных данных.',
      '«Травля» гражданина в сети «Интернет».',
      'Разглашение персональных данных граждан.'
    ],
    selectedConsequences: []
    },
    {
    id: 'damage2',
    description: 'Риски юридическому лицу, ИП',
    chosen: false,
    consequences: [
      'Нарушение законодательства Российской Федерации.',
      'Потеря (хищение) денежных средств.',
      'Недополучение ожидаемой (прогнозируемой)прибыли.',
      'Необходимость дополнительных(незапланированных) затрат на выплаты штрафов(неустоек) или компенсаций.',
      'Необходимость дополнительных(незапланированных) затрат на закупку товаров,работ или услуг (в том числе закупка программного обеспечения, технических средств, вышедших из строя, замена, настройка, ремонт указанных средств).',
      'Нарушение штатного режима функционирования автоматизированной системы управления и управляемого объекта и/или процесса.',
      'Срыв запланированной сделки с партнером.',
      'Необходимость дополнительных (незапланированных) затрат на восстановление деятельности.',
      'Потеря клиентов, поставщиков.',
      'Потеря конкурентного преимущества.',
      'Невозможность заключения договоров, соглашений.',
      'Нарушение деловой репутации.',
      'Снижение престижа.',
      'Дискредитация работников.',
      'Утрата доверия.',
      'Причинение имущественного ущерба.',
      'Неспособность выполнения договорных обязательств.',
      'Невозможность решения задач (реализации функций) или снижение эффективности решения задач (реализации функций).',
      'Необходимость изменения (перестроения) внутренних процедур для достижения целей,решения задач (реализации функций).',
      'Принятие неправильных решений.',
      'Простой информационной системы или сети.',
      'Публикация недостоверной информации на веб-ресурсах организации.',
      'Использование веб-ресурсов для распространения и управления вредоносным программным обеспечением.',
      'Рассылка информационных сообщений с использованием вычислительных мощностей оператора и (или) от его имени.',
      'Утечка конфиденциальной информации (коммерческой тайны, секретов производства (ноу-хау) и др.).'
    ],
    selectedConsequences: []
    },
    {
    id: 'damage3',
    description: 'Ущерб государству',
    consequences: [
      'Причинение ущерба жизни и здоровью людей.',
      'Прекращение или нарушение функционирования объектов обеспечения жизнедеятельности населения.',
      'Прекращение или нарушение функционирования объектов транспортной инфраструктуры.',
      'Прекращение или нарушение функционирования государственного органа в части невыполнения возложенной на него функции (полномочия).',
      'Прекращение или нарушение функционирования сети связи.',
      'Отсутствие доступа к государственной услуге.',
      'Нарушение условий международного договора Российской Федерации, срыв переговоров или подписания планируемого к заключению международного договора Российской Федерации.',
      'Снижение уровня дохода государственной корпорации, государственной организации или организации с государственным участием.',
      'Возникновение ущерба бюджетам Российской Федерации.',
      'Прекращение или нарушение проведения клиентами операций по банковским счетам и (или) без открытия банковского счета или операций в системно значимой кредитной организации, оператором услуг платежной инфраструктуры системно и (или) социально значимых платежных систем, системно значимой инфраструктурной организацией финансового рынка.',
      'Вредные воздействия на окружающую среду.',
      'Прекращение или нарушение функционирования пункта управления (ситуационного центра).',
      'Снижение показателей государственного оборонного заказа.',
      'Прекращение или нарушение функционирования информационной системы в области обеспечения обороны страны, безопасности государства и правопорядка.',
      'Нарушение законодательства Российской Федерации.',
      'Публикация недостоверной социально значимой информации на веб-ресурсах, которая может привести к социальной напряженности, панике среди населения и др.',
      'Нарушение штатного режима функционирования автоматизированной системы управления и управляемого объекта и/или процесса, если это ведет к выводу из строя технологических объектов,их компонентов.',
      'Нарушение общественного правопорядка,возможность потери или снижения уровня контроля за общественным правопорядком.',
      'Нарушение выборного процесса.',
      'Отсутствие возможности оперативного оповещения населения о чрезвычайной ситуации.',
      'Организация пикетов, забастовок, митингов и других акций.',
      'Массовые увольнения.',
      'Увеличение количества жалоб в органы государственной власти или органы местного самоуправления.',
      'Появление негативных публикаций в общедоступных источниках.',
      'Создание предпосылок к внутриполитическому кризису.',
      'Доступ к персональным данным сотрудников органов государственной власти, уполномоченных в области обеспечения обороны, безопасности и правопорядка, высших должностных лиц государственных органов и других лиц государственных органов.',
      'Доступ к системам и сетям с целью незаконного использования вычислительных мощностей.',
      'Использование веб-ресурсов государственных органов для распространения и управления вредоносным программным обеспечением.',
      'Утечка информации ограниченного доступа.',
      'Непредоставление государственных услуг.'
    ],
    selectedConsequences: []
    }
    ],
    TehnologyOptions: [
      { value: 'docker', label: 'Docker-контейнер' },
      { value: 'grid', label: 'Грид-системы' },
      { value: 'virtual', label: 'Система виртуализации' },
      { value: 'cloud', label: 'Облачная система' },
      { value: 'mobile', label: 'Мобильные устройства' },
      { value: 'superpc', label: 'Суперкомпьютерная система' },
      { value: 'wireless', label: 'Беспроводные технологии' },
      { value: 'ai', label: 'Система искусственного интеллекта' },
      { value: 'not_tech', label: 'Не одна из указанных технологий не используется' },
    ],
    selectedTehnology: [],
    mainProcessFields: {
      processClass: 'управленческие',
    },
    processOptions: [
      { value: 'Процесс 1', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'управленческие' },
      { value: 'Процесс 2', label: 'выполнение функций органа местного самоуправления;', class: 'управленческие' },
      { value: 'Процесс 3', label: 'выполнение функций органа государственной власти;', class: 'управленческие' },
      { value: 'Процесс 4', label: 'выполнение функций юридических лиц;', class: 'управленческие' },
      { value: 'Процесс 5', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'организационные' },
      { value: 'Процесс 6', label: 'выполнение функций органа местного самоуправления;', class: 'организационные' },
      { value: 'Процесс 7', label: 'выполнение функций органа государственной власти;', class: 'организационные' },
      { value: 'Процесс 8', label: 'выполнение функций юридических лиц;', class: 'организационные' },
      { value: 'Процесс 9', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'технологические' },
      { value: 'Процесс 10', label: 'выполнение функций органа местного самоуправления;', class: 'технологические' },
      { value: 'Процесс 11', label: 'выполнение функций органа государственной власти;', class: 'технологические' },
      { value: 'Процесс 12', label: 'выполнение функций юридических лиц;', class: 'технологические' },
      { value: 'Процесс 13', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'производственные' },
      { value: 'Процесс 14', label: 'выполнение функций органа местного самоуправления;', class: 'производственные' },
      { value: 'Процесс 15', label: 'выполнение функций органа государственной власти;', class: 'производственные' },
      { value: 'Процесс 16', label: 'выполнение функций юридических лиц;', class: 'производственные' },
      { value: 'Процесс 17', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'финансы' },
      { value: 'Процесс 18', label: 'выполнение функций органа местного самоуправления;', class: 'финансы' },
      { value: 'Процесс 19', label: 'выполнение функций органа государственной власти;', class: 'финансы' },
      { value: 'Процесс 20', label: 'выполнение функций юридических лиц;', class: 'финансы' },
      { value: 'Процесс 21', label: 'выполнение функций органов государственной власти, органов местного самоуправления, в интересах физических и юридических лиц', class: 'иные' },
      { value: 'Процесс 22', label: 'выполнение функций органа местного самоуправления;', class: 'иные' },
      { value: 'Процесс 23', label: 'выполнение функций органа государственной власти;', class: 'иные' },
      { value: 'Процесс 24', label: 'выполнение функций юридических лиц;', class: 'иные' }
      ],
    isostavFields: {
      personalData: false,
      confidentialInfo: true,
      technologicalInfo: false
    },
segmentFields: {
  segmentType: 'распределённая',
  segmentSystem: [  { value: 'server_segment', label: 'Серверный сегмент' },
  { value: 'user_segment', label: 'Пользовательский сегмент' }], // теперь массив
  controlZoneLimit: 'несколько',
  processingMode: 'многопользовательский',
  controlSystem: 'различных сетевых адресов'
},
      legalBasis: [], // массив выбранных оснований
      legalOptions: [
        { value: 'основание1', label: 'Постановление о создании информационной системы' },
        { value: 'основание2', label: 'Регламент информационной системы' },
        { value: 'основание3', label: 'Приказ о создании информационной системы' },
      ],
// все данные по модели угроз
    classificationFields: {
      scale: '', // по умолчанию первое значение
      confidentiality: '',
      integrity: '',
      availability: '',
      threatType: '',
      dataType: '',
      dataSubjects: '',
      dataSubjectsCount: '',
      klassGis: '',
      OptionsByClass: {
      управленческие: [],
      организационные: [],
      технологические: [],
      производственные: [],
      финансы: [], // добавьте остальные классы по необходимости
      иные: []
      },
      sostavInfo: {
      personalData: false,
      confidentialInfo: false,
      technologicalInfo: false
      },
      mediaStorageSys: [],
      urovenZnachim: '',
      urovenZahenosti: '',
      sysNPA: [],
      devModel: {
      developmentType: 'own', // или 'licensee'
      licenseeData: ''
      },
      savedImpactObjectsUsers: [],
      MainSys: {
      SegmentSys: {
      segmentType: '',
      controlZoneLimit: '',
      processingMode: '',
      controlSystem: ''
      },
      TehnologySys: [],
      customer: '',
      ownerInfo: '',
      operator: ''
      },
      DamImpObj: {
      damage1: [],
      damage2: [],
      damage3: []
      },
      DamConsequences: {},
      DamImpactEffects: {},
      AttackerTarget: {},
      OffenderImpactDetails: {},
    },


    ownerFields: {
      customer: '',
      ownerInfo: '',
      operator: ''
    },
      isModalVisible: false,
      modalInstance: null,
      token: localStorage.getItem('token') || '',
      systems: [],
      selectedSystemId: null,
      apiUrl: '',

      // Меню внутри модального окна
      menuItems: [
        { name: 'owner', label: 'Основная' },
        { name: 'isostav', label: 'Состав и процессы' },
        { name: 'segment', label: 'Структура' },
        { name: 'classification', label: 'Классификация' },
        { name: 'tehnology', label: 'Технологии' },
        { name: 'objects', label: 'Обьекты воздействия' },
        { name: 'consequences', label: 'Ущерб и последствия' },
        { name: 'vozdeistvie', label: 'Категории воздействия' },
        { name: 'vidobjects', label: 'Вид воздействия' },
        { name: 'offenders', label: 'Нарушители и цели' },
        { name: 'reldamage', label: 'Реализация угроз' },
        { name: 'taktikscena', label: 'Тактики (сценарии)' },
        { name: 'result', label: 'Итог' },
      ],
      selectedMenuItem: 'owner', // текущий выбранный пункт меню
    };
  },
methods: {
offenderImpactGoalsOptions2(offender) {
  const offenderDetails = this.offendersImpactDetails[offender.id];
  if (!offenderDetails || !offenderDetails.selectedGoals) {
    return [];
  }
  return offenderDetails.selectedGoals.filter(goal => goal.value != null && goal.value !== 'not_motiv');
},
  getIcon(offender) {
    return offender.isOpen
      ? '<i class="fa fa-bars"></i>'
      : '<i class="fa fa-user-secret"></i>';
  },
  handleSegmentTypeChange() {
    if (this.segmentFields.segmentType === 'локальная') {
      this.segmentFields.segmentSystem = [];
    }
    // Можно добавить другие действия при смене типа
  },
  addCustomProcess(newTag) {
    const newOption = {
      value: newTag,
      label: newTag,
      class: this.mainProcessFields.processClass // сохраняем текущий класс
    };
    // Добавляем в список опций
    this.processOptions.push(newOption);
    // Также добавляем к выбранным
    this.selectedProcessOptionsByClass[this.mainProcessFields.processClass].push(newOption);
  },
  addImpactEffect(damageId, key, newImpactEffect) {
    this.damageImpactEffectsByDamage[damageId][key] = [
      ...this.damageImpactEffectsByDamage[damageId][key],
      newImpactEffect
    ];
  },
  removeImpactEffect(damageId, key, impactEffectToRemove) {
    this.damageImpactEffectsByDamage[damageId][key] = this.damageImpactEffectsByDamage[damageId][key].filter(v => v !== impactEffectToRemove);
  },
  updateImpactEffects(damageId, key) {
    this.damageImpactEffectsByDamage[damageId][key] = [
      ...this.damageImpactEffectsByDamage[damageId][key]
    ];
  },
  handleImpactEffectsChange(damageId, key) {
    this.updateImpactEffects(damageId, key);
  },
  navigateToIsostav() {
    this.closeObjectsImpact();
    this.selectedMenuItem = 'isostav';
    // Можно дополнительно прокрутить страницу или выполнить другие действия
  },
  calculateUgroza() {
    const ugrozaVal = Number(this.ugroza);
    const typeIspdnVal = this.type_ispdn;
    const typeSotrudVal = this.subjects;
    const kolvoVal = this.quantity;
    let resultLevel = 'не определен';

    if (isNaN(ugrozaVal)) {
      this.ugrozaLevel = 'не определен';
      return;
    }

    if (typeIspdnVal === 'Биометрическая ИСПДн') {
      resultLevel = ugrozaVal;
    } else {
      if (typeIspdnVal === 'Специальная ИСПДн') {
        if (ugrozaVal === 1) {
          resultLevel = ugrozaVal;
        } else {
          if (typeSotrudVal === 'Сотрудники организации') {
            resultLevel = ugrozaVal;
          } else {
            if (kolvoVal === 'Менее 100 000 субъектов') {
              resultLevel = ugrozaVal;
            } else {
              resultLevel = ugrozaVal - 1;
            }
          }
        }
      } else if (typeIspdnVal === 'Общедоступна ИСПДн') {
        if (ugrozaVal === 1 || ugrozaVal === 3 || typeSotrudVal === 'Сотрудники организации') {
          resultLevel = ugrozaVal + 1;
        } else {
          if (kolvoVal === 'Менее 100 000 субъектов') {
            resultLevel = ugrozaVal + 1;
          } else {
            resultLevel = ugrozaVal;
          }
        }
      } else if (typeIspdnVal === 'Иная ИСПДн') {
        if (ugrozaVal === 1 || (kolvoVal === 'Более 100 000 субъектов' && typeSotrudVal === 'Иные лица')) {
          resultLevel = ugrozaVal;
        } else {
          resultLevel = ugrozaVal + 1;
        }
      } else {
        resultLevel = ugrozaVal;
      }
    }
    this.ugrozaLevel = resultLevel;
  },
updateScaleDescription() {
  const descriptionsMap = {
    '': `<strong>Выбор масштаба информационной системы</strong>:<br>Информационная система может имееть федеральный масштаб, региональный масштаб и объектовый масштаб`, 
    'Выберите масштаб': `<strong>Выбор масштаба информационной системы</strong>:<br>Информационная система может имееть федеральный масштаб, региональный масштаб и объектовый масштаб`,  
    'Федеральный': `<strong>Федеральный масштаб</strong>:<br>Информационная система имеет федеральный масштаб, если она функционирует на территории Российской Федерации (в пределах федерального округа) и включает сегменты в субъектах РФ, муниципальных образованиях и/или организациях. Такая система охватывает всю страну или значительную её часть, требует высоких стандартов защиты.`,
    'Региональный': `<strong>Региональный масштаб</strong>:<br>Информационная система имеет региональный масштаб, если она функционирует на территории одного субъекта РФ и включает сегменты в нескольких муниципальных образованиях или подведомственных организациях. Это системы, обслуживающие конкретный регион, требуют защиты, соответствующей региональной ответственности.`,
    'Объектовый': `<strong>Объектовый масштаб</strong>:<br>Информационная система имеет объектовый масштаб, если она функционирует на отдельных объектах одного федерального органа, органа власти субъекта РФ, муниципального образования или организации, без сегментов в территориальных органах или филиалах. Это локальные системы, например, системы конкретного предприятия или учреждения, с меньшими требованиями к защите, но всё равно соблюдающими базовые стандарты.`,
  };
  this.scaleDescription = descriptionsMap[this.scale] || '';
},
  tryCalculateUgroza() {
    if (
      this.threatType &&
      this.type_ispdn &&
      this.subjects &&
      this.quantity
    ) {
      this.calculateUgroza();
    }
  },
  tryCalculateClass() {
    if (
      this.currentMashtab &&
      this.confidentiality &&
      this.integrity &&
      this.availability
    ) {
      this.calculateClass();
    }
  },
calculateClass() {
  const levels = {
    confidentiality: this.confidentiality,
    integrity: this.integrity,
    availability: this.availability
  };
  const damagesMap = {
    'Низкий ущерб': 1,
    'Средний ущерб': 2,
    'Высокий ущерб': 3
  };
  const confScore = damagesMap[levels.confidentiality];
  const integScore = damagesMap[levels.integrity];
  const availScore = damagesMap[levels.availability];

  if (confScore === 3 || integScore === 3 || availScore === 3) {
    this.uz = '1';
  } else if (confScore === 2 || integScore === 2 || availScore === 2) {
    this.uz = '2';
  } else {
    this.uz = '3';
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

  this.key = `${this.uz}_${this.scale}`; // исправлено
  const cls = table[this.key];
  if (cls) {
    this.classNumber = cls.replace('К', '');
    this.selectedClassNumber = this.classNumber;
    this.currentClassGis = cls;
    this.result = `<p style="text-align: center;"><strong>КЛАСС ЗАЩИЩЁННОСТИ: <b>${cls}</b></strong></p>`;
	this.klass = this.classNumber;
  } else {
    this.currentClassGis = null;
    this.result = `<p style="text-align: center;"><strong>Класс защиты не определен</strong></p>`;
  }
},
  updateClassificationFields() {
console.log('Обновление данных модели угроз');
    this.classificationFields.scale = this.scale;
    this.classificationFields.confidentiality = this.confidentiality;
    this.classificationFields.integrity = this.integrity;
    this.classificationFields.availability = this.availability;
    this.classificationFields.threatType = this.ugroza;
    this.classificationFields.dataType = this.type_ispdn;
    this.classificationFields.dataSubjects = this.subjects;
    this.classificationFields.dataSubjectsCount = this.quantity;
    this.classificationFields.klassGis = this.currentClassGis;	
    this.classificationFields.urovenZnachim = this.uz;	
    this.classificationFields.urovenZahenosti = this.ugrozaLevel;
	this.classificationFields.OptionsByClass = this.selectedProcessOptionsByClass;
	this.classificationFields.sostavInfo = this.isostavFields;
	this.classificationFields.sysNPA = this.legalBasis;
	this.classificationFields.devModel = this.developmentFields;
	this.classificationFields.MainSys = this.ownerFields;
	this.classificationFields.SegmentSys = this.segmentFields;
	this.classificationFields.TehnologySys = this.selectedTehnology;
	this.classificationFields.mediaStorageSys = this.mediaStorageType;	
	this.classificationFields.savedImpactObjectsUsers = this.impactObjectsUsers;
	this.classificationFields.savedImpactObjectsSupportingSystems = this.impactObjectsSupportingSystems;
	this.classificationFields.savedAllArm = this.allArmData;
	this.classificationFields.DamImpObj = this.savedDamageImpactObjects;
	this.classificationFields.DamConsequences= this.savedDamageConsequences;
	this.classificationFields.DamImpactEffects= this.damageImpactEffectsByDamage;
	// Добавляем сохранение целей нарушителей
	this.classificationFields.AttackerTarget = this.savedOffendersGoals;
	this.classificationFields.OffenderImpactDetails = this.offendersImpactDetails;
  },
async loadOrganizationData() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/organization`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (res.status === 404 || res.status === 204) {
      this.organizationData = null;
      return;
    }
    if (!res.ok) throw new Error('Ошибка при получении данных организации: ' + res.status);
    const data = await res.json();
    if (data) {
      this.organizationData = data;
      this.ownerFields.customer = data.full_name_org || '';
      this.ownerFields.ownerInfo = data.full_name_org || '';
      this.ownerFields.operator = data.full_name_org || '';
      this.savedOwnerFields = { ...this.ownerFields };
    } else {
      this.organizationData = null;
    }
  } catch (err) {
    console.error('Ошибка:', err);
  }
},
getImpactEffectKey(categoryLabel, objName) {
  return categoryLabel + '|' + objName;
},
initializeImpactEffects() {
  this.damageTypes.forEach(damage => {
    if (!this.damageImpactEffectsByDamage[damage.id]) {
      this.$set(this.damageImpactEffectsByDamage, damage.id, {});
    }
    this.getImpactObjectDetails(damage.category).forEach(obj => {
      const key = this.getImpactEffectKey(damage.category, typeof obj === 'object' ? obj.name : obj);
      if (!this.damageImpactEffectsByDamage[damage.id][key]) {
        this.$set(this.damageImpactEffectsByDamage[damage.id], key, []);
      }
    });
  });
},
getImpactObjectDetails(category) {
  switch (category) {
case 'isostav_fields': {
  const activeKeys = Object.keys(this.savedIsostavFields).filter(
    key => this.savedIsostavFields[key]
  );
  const activeNames = activeKeys.map(key => this.fieldNames[key] || key);
  //console.log('ДАННЫЕ ДЛЯ ВОЗДЕЙСТВИЯ', activeNames);
  //console.log('ДАННЫЕ ДЛЯ ВОЗДЕЙСТВИЯ 2', this.damageImpactEffectsByDamage);
  return activeNames;
}
	case 'arm_systems': {
      // ваш код
      let hasServer = false;
      let hasStation = false;
      let hasMobile = false;
      let hasVirtual = false;

      this.savedAllArmData.forEach(item => {
		const type = item.a_type.toLowerCase();
		const vid = item.a_vid; // предполагаю, что это свойство есть и содержит строку

		if (type.includes('сервер')) {
        hasServer = true;
		}
		if (type === 'стационарный пк' || type === 'моноблок') {
        hasStation = true;
		}
		if (type === 'ноутбук' || type === 'планшет') {
        hasMobile = true;
		}
		// проверка для виртуального сервера
		if (type === 'сервер' && vid === 'Виртуальный') {
        hasVirtual = true;
		}
      });
      const result = [];
      if (hasServer) result.push('Серверное оборудование(найдено в составе ТС)');
      if (hasStation) result.push('Рабочие станции(найдено в составе ТС)');
      if (hasMobile) result.push('Мобильные устройства(найдено в составе ТС)');
      if (hasVirtual) result.push('Среда виртуализации(найдено в составе ТС)');
      return result;
	}
    case 'telecommunication_equipment':
      return this.savedNetEquipment.map(item => ({
        id: item.id,
        type: 'Телекоммуникационное оборудование',
        name: `${item.net_type} (Модель: ${item.net_model})`,
        details: item
      }));
    case 'storage_media':
      // возвращаем массив label
      return this.mediaStorageType.map(item => item.label);
    case 'user_systems':
      return this.impactObjectsUsers.map(item => item.label);
    case 'supporting_systems':
      return this.impactObjectsSupportingSystems
      .map(item => item.label)
      .filter(label => label.toLowerCase() !== 'не применяются');
    case 'software':
      return ['Системное программное обеспечение(найдено в составе ПО)', 'Прикладное программное обеспечение(найдено в составе ПО)'];
    case 'security_tools':
      return ['Средства защиты информации(найдено в составе СЗИ)'];
    default:
      return [];
  }
},
  saveMediaStorage() {
    this.savedMediaStorage = [...this.mediaStorageType];
//console.log(this.savedMediaStorage);
  },
  getSelectedConsequences(damageId) {
    const damage = this.damageTypes.find(d => d.id === damageId);
    return damage ? damage.selectedConsequences : [];
  },
getSavedImpactObjects(damageId) {
  if (damageId === 'damage1') {
    return this.savedDamageImpactObjects.damage1 || [];
  } else if (damageId === 'damage2') {
    return this.savedDamageImpactObjects.damage2 || [];
  } else if (damageId === 'damage3') {
    return this.savedDamageImpactObjects.damage3 || [];
  }
  return [];
},
  getDamageImpactObjects(damageId) {
    return this.damageImpactObjects[damageId] || [];
  },
saveDamageConsequences(damageId) {
  const damage = this.damageTypes.find(d => d.id === damageId);
  if (damage) {
    const consequencesArray = [...damage.selectedConsequences];
    // Обновляем отдельные переменные
    if (damageId === 'damage1') {
      this.damage1Consequences = consequencesArray;
    } else if (damageId === 'damage2') {
      this.damage2Consequences = consequencesArray;
    } else if (damageId === 'damage3') {
      this.damage3Consequences = consequencesArray;
    }
    // Обновляем общий объект
    this.savedDamageConsequences[damageId] = consequencesArray;
  }
},

// Тут будут сохраняться и обновляться все данные
selectMenuItem(itemName) {
this.updateClassificationFields();
this.calculateUgroza();
this.calculateClass();
  // Проверка для раздела "Разработка" и типа "licensee"
  if (this.selectedMenuItem === 'owner') {
    if (
      this.developmentFields.developmentType === 'licensee' &&
      !this.developmentFields.licenseeData.trim()
    ) {
      // Не переключать меню, если licenseeData пустое
      return; // выход из метода, переключение не произойдет
    }
  }
  // Остальной код переключения меню
  // Перед сменой раздела — сохраняем
  this.savedOffendersGoals = this.offenders.map(offender => ({
    id: offender.id,
    name: offender.name,
    goals: offender.selectedGoals
  }));
  this.savedselectedTehnology = { ...this.selectedTehnology };
  this.savedOwnerFields = { ...this.ownerFields };
  this.savedevelopmentFields = { ...this.developmentFields };
  this.savedLegalBasis = [...this.legalBasis];
  this.savedIsostavFields = { ...this.isostavFields };
  this.savedmediaStorageType = [ ...this.mediaStorageType ];
  this.savedImpactObjectsUsers = [...this.impactObjectsUsers];
  this.savedAllArm = [...this.allArmData];
  this.classificationFields.savedImpactObjectsSupportingSystems = [...this.impactObjectsSupportingSystems];
  if (this.mainProcessFields.processClass) {
    this.selectedProcessOptionsByClass[this.mainProcessFields.processClass] = [...this.selectedProcessOptionsByClass[this.mainProcessFields.processClass]];
  }
  this.savedOptionsByClass = { ...this.selectedProcessOptionsByClass };
  this.savedSegmentFields = { ...this.segmentFields };
  this.saveddamageImpactEffectsByDamag = { ...this.DamImpactEffects };
  this.savedClassificationFields = { ...this.classificationFields };
  console.log('Модель угроз:', this.savedClassificationFields);
  this.selectedMenuItem = itemName;
  localStorage.setItem('selectedMenuItem', itemName);
  if (itemName === 'isostav') {
    this.selectedProcessOptionsByClass = { ...this.savedOptionsByClass };
    this.isostavFields = { ...this.savedIsostavFields };
  }
  if (itemName === 'vidobjects') {
    this.DamImpactEffects = { ...this.saveddamageImpactEffectsByDamag};
  }
  // Восстановление при переходе в раздел "offenders"
if (itemName === 'offenders') {
  // Восстановление целей нарушителей
  this.AttackerTarget = { ...this.savedOffendersGoals };
  this.offenders.forEach(offender => {
    const savedGoalsObj = this.savedOffendersGoals.find(g => g.id === offender.id);
    if (savedGoalsObj && savedGoalsObj.goals) {
      this.offendersImpactDetails[offender.id].goals = [...savedGoalsObj.goals];
    } else {
      this.offendersImpactDetails[offender.id].goals = [];
    }
  });
}
  if (itemName === 'segment') {
    this.segmentFields = { ...this.savedSegmentFields };
  }
  if (itemName === 'objects') {
    // Восстановление из сохраненных данных
    this.impactObjects = [...this.savedImpactObjects];
    this.allArmData = [...this.savedAllArm];
    this.netEquipment = [...this.savedNetEquipment];
    this.systemSoftware = [...this.savedSystemSoftware];
    this.applicationSoftware = [...this.savedApplicationSoftware];
    this.securityTools = [...this.savedSecurityTools];
    this.impactObjectsUsers = [...this.savedImpactObjectsUsers];
    this.impactObjectsSupportingSystems = [...this.savedImpactObjectsSupportingSystems];
    this.mediaStorageType = [ ...this.savedmediaStorageType ];
    this.impactObjectsSupportingSystems = [ ...this.classificationFields.savedImpactObjectsSupportingSystems ];
  }
  // Восстановление: если перешли на раздел восстанавливаем

  if (itemName === 'classification') {
    this.classificationFields = { ...this.savedClassificationFields };
  }
  if (itemName === 'owner') {
    // Восстановление данных владельца
    this.ownerFields = { ...this.savedOwnerFields };
    this.developmentFields = { ...this.savedevelopmentFields };
    this.legalBasis = [...this.savedLegalBasis];
  }
},
showObjectsImpact() {
  // Сохраняем выбранные категории как имена
  this.savedImpactObjects = [];

  if (this.isostavFields.personalData) {
    this.savedImpactObjects.push('Персональные данные');
  }
  if (this.isostavFields.confidentialInfo) {
    this.savedImpactObjects.push('Конфиденциальная (служебная) информация');
  }
  if (this.isostavFields.technologicalInfo) {
    this.savedImpactObjects.push('Служебная технологическая информация');
  }

  // Обновляем impactObjects (для отображения)
  this.impactObjects = [...this.savedImpactObjects];

  this.showObjectsImpactModal = true;
},
    async loadNetEquipment() {
      if (!this.selectedSystemId) return;
      try {
        const res = await fetch(`${this.apiUrl}/api/user/network-equipment?systemId=${this.selectedSystemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
        this.netEquipment = data;
        this.savedNetEquipment = [...this.netEquipment];
        //console.log(this.savedNetEquipment);
      } catch (e) {
        console.error('Ошибка загрузки сетевого оборудования:', e);
      }
    },
  // открытыие модального окна
  async OpenNetEquipmentModal() { 
    this.showNetEquipmentModal = true;
  },
  closeNetEquipmentModal() {
    this.showNetEquipmentModal = false;
  },
    async loadSystemSoftwareForSystem(systemId) {
      // Перед загрузкой сохраняем текущие данные

      
      try {
        const res = await fetch(`${this.apiUrl}/api/user/systemSoftware?systemId=${systemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token },
        });
        const data = await res.json();
        this.systemSoftware = data;
        this.savedSystemSoftware = [...this.systemSoftware];
      } catch (e) {
        console.error('Ошибка загрузки системного ПО:', e);
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
          this.savedApplicationSoftware = [...this.applicationSoftware];
        }
      } catch (e) {
        console.error('Ошибка загрузки прикладного ПО:', e);
      }
    },
  // Объединённый метод для показа всех
  async loadSystemAndApplicationSoftware() {
    if (!this.selectedSystemId) return;
    await this.loadSystemSoftwareForSystem(this.selectedSystemId);
    await this.loadApplicationSoftware(this.selectedSystemId);
    // Перед загрузкой сохраняем оба массива в один объект
    this.savedSoftwareData = {
      systemSoftware: [...this.systemSoftware],
      applicationSoftware: [...this.applicationSoftware]
    };
//console.log('системное и прикладное ПО', this.savedSoftwareData);
  },
  // открытыие модального окна
   async openSoftwareModal() { 
    this.showSoftwareModal = true;
  },
  // Закрытие модального окна
  closeSoftwareModal() {
    this.showSoftwareModal = false;
  },
    async loadArmForSystem(systemId) {
      // Перед загрузкой сохраняем текущие данные
      // Загрузка данных
      this.currentSelectedSystemId = systemId;
      try {
        const res = await fetch(`${this.apiUrl}/api/user/arm?systemId=${systemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
        this.allArmData = data;
        this.savedAllArmData = [...this.allArmData];
      } catch (e) {
        console.error('Ошибка загрузки ТС для системы:', e);
      }
    },
  // открытыие модального окна
  async OpenArmModal() { 
    this.showArmModal = true;
  },
  closeArmModal() {
    this.showArmModal = false;
  },
    async loadSecurityTools() {
      // Перед загрузкой сохраняем текущие данные

      if (!this.selectedSystemId) return;
      try {
        const res = await fetch(`${this.apiUrl}/api/user/security-tools?systemId=${this.selectedSystemId}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
        this.securityTools = data;
        this.savedSecurityTools = [...this.securityTools];
        //console.log(this.savedSecurityTools);
      } catch (e) {
        console.error(e);
      }
    },
  // открытыие модального окна
  async OpenSecurityToolsModal() { 
    this.showSecurityToolsModal = true;
  },
  closeSecurityToolsModal() {
    this.showSecurityToolsModal = false;
  },
  closeObjectsImpact() {
    this.showObjectsImpactModal = false;
  },
    addTag(newTag) {
      // Добавляем пользовательское значение
      const newOption = {
        value: newTag,
        label: newTag
      };
      this.legalOptions.push(newOption);
      this.legalBasis.push(newOption);
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
  async openModal() {


  // Загружаем из API
  await this.loadOrganizationData();
//console.log('selectedSystemId');
//console.log('вызов openModal', this.selectedSystemId);

localStorage.setItem('selectedSystemId', this.selectedSystemId);
// загрузка данных которые уже есть
await this.loadArmForSystem(this.selectedSystemId);
await this.loadSystemAndApplicationSoftware();
await this.loadSecurityTools();
await this.loadNetEquipment();
    this.isModalVisible = true;
    localStorage.setItem('modalOpen', 'true');
  },
  closeModal() {
    this.saveMediaStorage();
    this.isModalVisible = false;
	localStorage.setItem('selectedSystemId', this.selectedSystemId);
    localStorage.setItem('modalOpen', 'false');
  },
    saveModel() {
      alert('Модель сохранена!');
      this.closeModal();
    },
    getMenuContent(itemName) {
      const contentMap = {
        owner: { title: 'Владелец', content: 'Содержимое для Владелец...' },
        classification: { title: 'Классификация', content: 'Содержимое для Классификация...' },
        isostav: { title: 'Состав информации', content: 'Содержимое для Состава информации...' },
        segment: { title: 'Структура', content: 'Содержимое для Сегмент...' },
        tehnology: { title: 'Технологии', content: 'Содержимое для Технологии...' },
        objects: { title: 'Обьекты воздействия', content: 'Содержимое для Обьекты воздействия...' },
        consequences: { title: 'Ущерб и последствия', content: 'Содержимое для Ущерб и последствия...' },
        vozdeistvie: { title: 'Категории воздействия', content: 'Содержимое для Категории воздействия...' },
        vidobjects: { title: 'Вид воздействия', content: 'Содержимое для Виды воздействия...' },
        offenders: { title: 'Нарушители', content: 'Содержимое для Нарушители...' },
        UBI: { title: 'УБИ', content: 'Содержимое для УБИ...' },
        result: { title: 'Итог', content: 'Содержимое для Итог...' },
      };
      return contentMap[itemName] || { title: '', content: '' };
    },
async handleSystemChange() {
//console.log(localStorage.getItem('selectedSystemId'));
//console.log('вызов handleSystemChange', this.selectedSystemId);
  localStorage.setItem('selectedSystemId', this.selectedSystemId);
},
async loadSystems() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const systems = await res.json();
    this.systems = systems;
	
const savedSystemId = localStorage.getItem('selectedSystemId');

    if (savedSystemId && systems.some(s => String(s.id) === savedSystemId)) {
      this.selectedSystemId = savedSystemId;
    } else if (systems.length > 0) {
      this.selectedSystemId = String(systems[0].id);
    } else {
      this.selectedSystemId = null;
    }

    // Восстановление видимости модального окна
    const modalState = localStorage.getItem('modalOpen');
    if (modalState === 'true') {
      this.isModalVisible = true;
    }
  } catch (e) {
    console.error('Ошибка загрузки систем:', e);
  }
},
  },
computed: {
offendersWithGoals() {
  return this.offenders.filter(offender => {
    const offenderGoalsObj = this.savedOffendersGoals.find(goalObj => goalObj.id === offender.id);
    if (!offenderGoalsObj || !offenderGoalsObj.goals) {
      return false;
    }
    const relevantGoals = offenderGoalsObj.goals.filter(goal => goal.value != null && goal.value !== 'not_motiv');
    return relevantGoals.length > 0;
  });
},
offenderImpactGoalsOptions() {
  return (offender) => {
    // Проверяем наличие "not_motiv" среди выбранных целей
    const hasMotiv = offender.selectedGoals.some(goal => goal.value === 'not_motiv');
    if (hasMotiv) {
      // Если есть, возвращаем пустой список
      return [];
    }
    // Иначе фильтруем по выбранным и доступным целям
    const selectedValues = offender.selectedGoals.map(goal => goal.value);
    return offender.impactGoals.filter(goal => !selectedValues.includes(goal.value));
  };
},
  displayApplicationSoftware() {
    if (this.showAllApps) {
      return this.applicationSoftware;
    } else {
      return this.applicationSoftware.slice(0, 10);
    }
  },
availablecurrentProcessOptions() {
  const currentClass = this.mainProcessFields.processClass;
  const selectedOptions = this.selectedProcessOptionsByClass[currentClass] || [];
  return Array.isArray(this.processOptions)
    ? this.processOptions.filter(
        option => 
          option.class === currentClass && // только процессы текущего класса
          !selectedOptions.some(selected => selected.value === option.value) // исключить выбранные
      )
    : [];
},
  availablecurrentSegmentOptions() {
    return this.segmentOptions.filter(
      option => !this.segmentFields.segmentSystem.some(
        selected => selected.value === option.value
      )
    );
  },
  licenseeDataValidationClass() {
    if (this.developmentFields.developmentType !== 'licensee') {
      // если не выбран тип "лицензиат", не добавляем классы
      return '';
    }
    if (this.developmentFields.licenseeData.trim() === '') {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  },
    availableSupportingSystemsOptions() {
      // Исключаем выбранные из общего списка, кроме "не применяются"
      if (
        this.impactObjectsSupportingSystems.some(
          sel => sel.value === 'not_support'
        )
      ) {
        // Если выбрано "не применяются", то нельзя добавлять другие
        return [];
      }
      // Иначе показываем все, кроме уже выбранных
      return this.impactObjectsSupportingSystemsOptions.filter(
        option => !this.impactObjectsSupportingSystems.some(selected => selected.value === option.value)
      );
  },
    availableimpactObjectsUserOptions() {
      // Исключаем выбранные из общего списка
      return this.impactObjectsUserOptions.filter(
        option => !this.impactObjectsUsers.some(selected => selected.value === option.value)
      );
    },
    availablemediaStorageOptions() {
      // Исключаем выбранные из общего списка
      return this.mediaStorageOptions.filter(
        option => !this.mediaStorageType.some(selected => selected.value === option.value)
      );
    },
    availableLegalOptions() {
      // Исключаем выбранные из общего списка
      return this.legalOptions.filter(
        option => !this.legalBasis.some(selected => selected.value === option.value)
      );
    },
    availableConsequences() {
    // возвращает объект, где ключ — id damage, значение — список доступных последствий
    const result = {};

    this.damageTypes.forEach(damage => {
      result[damage.id] = damage.consequences.filter(
        consequence => !damage.selectedConsequences.includes(consequence)
      );
    });
    return result;
    },
	
  selectedSystem() {
  return this.systems.find(s => s.id === Number(this.selectedSystemId));
  },
  selectedSystemName() {
    return this.getSystemName(this.selectedSystemId);
  }
},
watch: {
  offenders: {
    handler() {
      this.offenders.forEach(offender => {
        const hasMotiv = offender.selectedGoals.some(goal => goal.value === 'not_motiv');
        if (hasMotiv && offender.selectedGoals.length > 1) {
          // Если есть 'not_motiv' и есть еще опции, убираем все, кроме него
          offender.selectedGoals = offender.impactGoals.filter(goal => goal.value === 'not_motiv');
        }
      });
    },
    deep: true
  },
  selectedTehnology(newVal) {
    const notTechIndex = newVal.indexOf('not_tech');
    if (notTechIndex !== -1 && newVal.length > 1) {
      // Если выбрана "не используется" и есть другие опции, сбрасываем их
      this.selectedTehnology = ['not_tech'];
    }
  },
impactObjectsSupportingSystems(newVal) {
const hasNotSupport = newVal.some(item => item.value === 'not_support');
if (hasNotSupport && newVal.length > 1) {
// Если выбрано "не применяются" вместе с другими, сбросить остальные
this.impactObjectsSupportingSystems = [
{ value: 'not_support', label: 'не применяются' }
];
}
},
  ugroza() { this.calculateUgroza(); },
  type_ispdn() { this.calculateUgroza(); },
  subjects() { this.calculateUgroza(); },
  quantity() { this.calculateUgroza(); },
currentMashtab() {
  this.tryCalculateClass();
},
confidentiality() {
  this.tryCalculateClass();
},
integrity() {
  this.tryCalculateClass();
},
availability() {
  this.tryCalculateClass();
},
    'damageImpactObjects.damage1'(newVal) {
      this.savedDamageImpactObjects.damage1 = [...newVal]; // сохраняем копию
    },
    'damageImpactObjects.damage2'(newVal) {
      this.savedDamageImpactObjects.damage2 = [...newVal];
    },
    'damageImpactObjects.damage3'(newVal) {
      this.savedDamageImpactObjects.damage3 = [...newVal];
    },
  damageTypes: {
    handler() {
      this.damageTypes.forEach(damage => {
        this.saveDamageConsequences(damage.id);
      });
    },
    deep: true
  },
  selectedSystemId(newVal) {
    if (newVal) {
      const selectedSystem = this.systems.find(s => String(s.id) === newVal);
      if (selectedSystem) {
        this.selectedSystemIType = selectedSystem.i_type;
        this.selectedSystemIPers = selectedSystem.i_pers;
        this.selectedSystemIName = selectedSystem.i_sname;
        localStorage.setItem('selectedSystemId', newVal);
      }
    }
  }
},
async mounted() {
this.offenders.forEach(offender => {
  if (!this.offendersImpactDetails[offender.id]) {
    this.offendersImpactDetails[offender.id] = {
      name: offender.name,
      interfaces: [],
      objects: [],
      methods: [],
      goals: [] // добавляем сюда
    };
  } else {
    // Обновляем имя
    this.offendersImpactDetails[offender.id].name = offender.name;
  }
});
this.apiUrl = this.$API_URL;
await this.initializeDamageEffects();
await this.updateScaleDescription();
await this.loadOrganizationData();
this.damage1ImpactObjects = [...this.savedAllArmData]; // или другой источник данных
this.damage2ImpactObjects = [...this.savedImpactObjects]; // например, так
this.damage3ImpactObjects = [...this.savedImpactObjects]; // и так далее
this.ownerFields = { ...this.savedOwnerFields };
    // Восстановление данных при монтировании
    if (this.selectedMenuItem === 'objects') {
      this.impactObjects = [...this.savedImpactObjects];
      this.allArmData = [...this.savedAllArmData];
      this.netEquipment = [...this.savedNetEquipment];
      this.systemSoftware = [...this.savedSystemSoftware];
      this.applicationSoftware = [...this.savedApplicationSoftware];
      this.securityTools = [...this.savedSecurityTools];
      this.impactObjectsUsers = [...this.savedImpactObjectsUsers];
      this.impactObjectsSupportingSystems = [...this.savedImpactObjectsSupportingSystems];
      this.AttackerTarget = { ...this.savedOffendersGoals };
    }
  // Восстановление состояния модального окна, если есть
  const modalState = localStorage.getItem('modalOpen');
  if (modalState === 'true') {
    this.isModalVisible = true;
  }
  this.loadSystems();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.jumbotron {
  background: #fff;
  padding: 20px;
  border-radius: 0;
}

h3 {
  margin-bottom: 20px;
}

#SziFormContainer {
  background: #fff;
  padding: 0px;
  border-radius: 0px;
  height: auto;
  position: relative;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;
}

.modal-content {
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  border: none;
  background-color: #fff;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  max-width: 1700px;
  position: relative;
}

.modal-header {
  background-color: #008CBA;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ecf0f1;
  border-radius: 0;
  flex-shrink: 0;
}

.modal-title {
  font-weight: bold;
  font-size: 1.25rem;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: #ecf0f1;
  opacity: 0.8;
  transition: opacity 0.2s;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body-wrapper {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: visible;
}

.modal-sidebar {
  width: 230px;
  min-width: 230px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  flex-shrink: 0;
}

.modal-content-area {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  isolation: isolate;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
}

.modal-footer button {
  margin-top: 0 !important;
}

.list-group-item {
  cursor: pointer;
  padding: 12px 15px;
  margin-bottom: 2px;
  border-radius: 0;
  transition: all 0.2s;
  font-size: 0.95rem;
  border: 1px solid transparent;
}

.list-group-item:hover {
  background-color: #3b5998;
  color: #fff;
}

.list-group-item.active {
  background-color: #2980b9;
  color: #fff;
  font-weight: bold;
}

.section-content {
  padding: 10px;
}

.form-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.multiselect-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.multiselect {
  position: relative;
}

.multiselect__content-wrapper {
  position: fixed !important;
  z-index: 9999 !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}

.multiselect--active .multiselect__content-wrapper {
  display: block !important;
}

.multiselect__option {
  display: block;
  padding: 10px 12px;
  min-height: 40px;
  line-height: 1.4;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  cursor: pointer;
}

.multiselect__option--highlight {
  background: #008CBA;
  color: #fff;
}

.multiselect__option--selected {
  background: #f0f0f0;
  font-weight: bold;
}

.multiselect__tag {
  display: inline-flex;
  align-items: center;
  margin: 2px;
  padding: 4px 8px;
  background: #008CBA;
  color: #fff;
  border-radius: 3px;
  font-size: 0.85rem;
  max-width: 100%;
}

.multiselect__tag-icon {
  margin-left: 5px;
  cursor: pointer;
}

.multiselect__tag-icon:hover {
  background: #006699;
}

.multiselect__tags {
  min-height: 44px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: visible;
}

.multiselect__input {
  border: none !important;
  background: transparent;
  outline: none;
  padding: 5px;
  flex: 1;
  min-width: 80px;
}

.multiselect__single {
  padding: 5px;
  margin: 0;
}

.multiselect__placeholder {
  padding: 5px;
  color: #999;
  margin: 0;
}

.backdrop-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.backdrop-modal > div {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 1061;
}

.nested-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.nested-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  z-index: 1061;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.scroll-container {
  max-height: 90vh;
  overflow-y: auto;
  padding-right: 10px;
}

.form-control, .form-select {
  margin-bottom: 10px;
}

.alert {
  margin: 10px 0;
}

.table {
  margin-bottom: 15px;
}

.table th, .table td {
  padding: 10px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .modal-body-wrapper {
    flex-direction: column;
  }
  
  .modal-sidebar {
    width: 100%;
    min-width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>