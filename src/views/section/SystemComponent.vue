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
<p style="text-align: center; color: #008CBA; font-weight: bold;">ИНФОРМАЦИОННЫЕ СИСТЕМЫ</p>
        <!-- Таблица объектов информатизации -->
 <div style="overflow-x: auto; width: 100%;">
          <table id="InfoSysTable"  class="table table-hover table-sm" style="border-collapse: collapse; min-width: auto;">
            <thead>
              <tr class="table-primary">
                <th style="text-align: left;">Полное наименование</th>
                <th style="text-align: left;">Краткое наименование</th>
                <th style="text-align: center;">Тип</th>
                <th style="text-align: center;">ПДн</th>
                <th style="text-align: left;">Режим обработки</th>
                <th style="text-align: left;">Структура</th>
                <th style="text-align: left;">Интернет</th>
                <th style="text-align: left;">Размещение</th>
                <th style="text-align: left;">Назначение ИС</th>
                <th style="text-align: center;">ЦОД</th>
                <th style="text-align: left;">Начало эксплуатации</th>
                <th style="text-align: left;">Действия</th>
              </tr>
            </thead>
            <tbody>
        <tr v-if="infoSysList.length === 0">
          <td colspan="12" class="text-center">Нет информационных систем.</td>
        </tr>
              <tr v-for="item in infoSysList" :key="item.id">
                <td>{{ item.i_name }}</td>
                <td>{{ item.i_sname }}</td>
                <td style="text-align: center;">{{ item.i_type }}</td>
                <td style="text-align: center;">{{ item.i_pers }}</td>
                <td>{{ item.i_regim }}</td>
                <td>{{ item.i_struk }}</td>
                <td style="text-align: center;">{{ item.i_inet }}</td>
                <td>{{ item.i_mesto }}</td>
				<td :title="item.i_naznachenie">{{ truncate(item.i_naznachenie, 66) }}</td>
				
                <td style="text-align: center;">{{ item.i_cod }}</td>
                <td>{{ formatDateForDisplay(item.i_datais) }}</td>
        <td style="text-align: center;">
                  <button class="btn btn-danger" @click="deleteInfoSys(item.id)"><i class="fa fa-trash"></i></button>
          <span></span>
                  <button class="btn btn-info" @click="editInfoSys(item.id)"><i class="fa fa-pencil"></i></button>           
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Форма для добавления/редактирования -->
		<div v-if="showForm">
        <form @submit.prevent="saveInfoSys" id="InfoSysForm" style="margin-top: 20px; display: flex; flex-direction: column; gap: 5px;">
          <!-- Поля формы -->
<div style="display: flex; flex-wrap: wrap; gap: 0px;">
  <div style="flex: 1;">
    <label for="i_name" style="display: block; color: #008CBA; margin-bottom: 2px; font-weight: bold;" class="form-label mt-2">Полное наименование</label>
    <input v-model="formData.i_name" type="text" id="i_name" placeholder="Пример: РЕГИОНАЛЬНАЯ ИНФОРМАЦИОННАЯ СИСТЕМА ОБЕСПЕЧЕНИЯ ГРАДОСТРОИТЕЛЬНОЙ ДЕЯТЕЛЬНОСТИ  БЕЛГОРОДСКОЙ ОБЛАСТИ" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;" />
  </div>
</div>
<div style="display: flex; flex-wrap: wrap;">
  <div style="flex: 1;">
    <label for="i_sname" style="display: block; color: #008CBA; margin-bottom: 2px; font-weight: bold;" class="form-label mt-2">Краткое наименование</label>
    <input v-model="formData.i_sname" type="text" id="i_sname" placeholder="Пример: РИСОГД" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;" />
  </div>
</div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 5px;">
          
            <div>
			<label for="i_type" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Тип ИС</label>
<select v-model="formData.i_type" id="i_type" required @change="onTypeChange" class="form-select">
  <option v-for="option in dictionaries.infoSysType" :key="option.value" :value="option.value">{{ option.value }}</option>
</select>
            </div>
            <div>
              <label for="i_cod" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Расположение ИС в ЦОД</label>
              <select v-model="formData.i_cod" id="i_cod" required class="form-select">
                <option v-for="option in dictionaries.cod_answers" :key="option.value" :value="option.value">{{ option.value }}</option>
              </select>
            </div>
            <div>
              <label for="i_pers" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Обработка ПДн</label>
<select v-model="formData.i_pers" id="i_pers" required :disabled="isPersDisabled" class="form-select">
  <option v-for="option in dictionaries.answers" :key="option.value" :value="option.value">{{ option.value }}</option>
</select>
            </div>
            <div>
              <label for="i_regim" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Режим обработки данных</label>
              <select v-model="formData.i_regim" id="i_regim" required class="form-select">
                <option v-for="option in dictionaries.regimIS" :key="option.value" :value="option.value">{{ option.value }}</option>
              </select>
            </div>
            <div>
              <label for="i_struk" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Структура</label>
              <select v-model="formData.i_struk" id="i_struk" required class="form-select">
                <option v-for="option in dictionaries.strukIS" :key="option.value" :value="option.value">{{ option.value }}</option>
              </select>
            </div>
            <div>
              <label for="i_inet" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Доступ к сети интернет</label>
              <select v-model="formData.i_inet" id="i_inet" required class="form-select">
                <option v-for="option in dictionaries.inet_answers" :key="option.value" :value="option.value">{{ option.value }}</option>
              </select>
            </div>
            <div>
              <label for="i_datais" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Начало эксплуатации ИС</label>
              <input v-model="formData.i_datais" type="date" id="i_datais" required class="form-select">
            </div>
          </div>

          <div>
            <label for="i_mesto" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Адрес размещения основных компонентов ИС</label>
            <input v-model="formData.i_mesto" type="text" id="i_mesto" placeholder="Пример: г. Белгород, пл. Соборная, д. 4" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;" />
          </div>
          <div>
            <label for="i_naznachenie" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label mt-2">Назначение информационной системы</label>
<textarea v-model="formData.i_naznachenie" id="i_naznachenie" placeholder="Пример: Cбор, хранение, обработка и анализ атрибутивной и пространственной информации, обеспечивающей качественное повышение эффективности деятельности органов исполнительной власти и органов местного самоуправления, уполномоченных в сфере градостроительной деятельности." required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; min-height: 120px;"></textarea>
          </div>

          <!-- Кнопки -->
          <div style="display: flex; justify-content: flex-end; margin-top: 20px; gap: 10px;">
            <button class="btn btn-success" type="submit">Сохранить</button>
            <button class="btn btn-danger" @click="resetForm" type="button">Отмена</button>
          </div>
        </form>
</div>
        <!-- Контейнер для кнопки "Добавить" -->
<div v-if="!showForm" style="margin-top: 20px; text-align: right;">
  <button @click="prepareAddNew" class="btn btn-info">Добавить</button>
</div>
      </div>
    </div>

</template>

<script>
export default {
  props: {
    text: String
  },
  data() {
    return {
      // список объектов
      infoSysList: [],
      isPersDisabled: false,
      // текущий редактируемый id
      currentInfoSysId: null,
      // форма отображается или нет
      showForm: false,
      apiUrl: '',
      // данные формы
      formData: {
        i_name: '',
        i_sname: '',
        i_type: '',
        i_pers: '',
        i_regim: '',
        i_struk: '',
        i_inet: '',
        i_mesto: '',
        i_naznachenie: '',
        i_cod: '',
        i_datais: ''
      },
      // справочники
      dictionaries: {
        infoSysType: [],
        answers: [],
        inet_answers: [],
        cod_answers: [],
        regimIS: [],
        strukIS: []
      },
      token: localStorage.getItem('token') || ''
    };
  },
  methods: {
    // Загрузка списка систем
async loadInfoSys() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/system`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    const data = await res.json();
    console.log('Обновляем список:', data);
    if (Array.isArray(data)) {
      this.infoSysList = data;
    } else {
      this.infoSysList = [];
    }
  } catch (err) {
    console.error('Ошибка загрузки:', err);
  }
},

    // Подготовка к добавлению нового объекта
async prepareAddNew() {
  await this.loadAllDictionaries(); // загружаем все справочники
  this.resetForm();
  this.currentInfoSysId = null;
  // Устанавливаем значения по умолчанию
  if (this.dictionaries.infoSysType.length > 0) {
    this.formData.i_type = this.dictionaries.infoSysType[0].value;
  }
  if (this.dictionaries.answers.length > 0) {
    this.formData.i_pers = this.dictionaries.answers[0].value;
  }
  if (this.dictionaries.regimIS.length > 0) {
    this.formData.i_regim = this.dictionaries.regimIS[0].value;
  }
  if (this.dictionaries.strukIS.length > 0) {
    this.formData.i_struk = this.dictionaries.strukIS[0].value;
  }
  if (this.dictionaries.inet_answers.length > 0) {
    this.formData.i_inet = this.dictionaries.inet_answers[0].value;
  }
  // Обязательно проверяем, что массив cod_answers загружен и не пуст
  if (this.dictionaries.cod_answers.length > 0) {
    this.formData.i_cod = this.dictionaries.cod_answers[0].value;
  } else {
    this.formData.i_cod = '';
  }
  this.showForm = true;
},
async loadAllDictionaries() {
  await Promise.all([
    this.loadDictionaryValuesForUser('infoSysType'),
    this.loadDictionaryValuesForUser('answers'),
    this.loadDictionaryValuesForUser('inet_answers'),
    this.loadDictionaryValuesForUser('cod_answers'),
    this.loadDictionaryValuesForUser('regimIS'),
    this.loadDictionaryValuesForUser('strukIS')
  ]);
},
    // при изменении типа вызываем handleTypeChange
    onTypeChange() {
      this.handleTypeChange();
    },
    handleTypeChange() {
    if (this.formData.i_type === 'ИСПДн') {
      this.formData.i_pers = 'Да';
      this.isPersDisabled = true;
    } else {
      this.isPersDisabled = false;
      // Можно оставить поле пустым или выбрать первый вариант
      if (this.dictionaries.answers.length > 0) {
        this.formData.i_pers = this.dictionaries.answers[0].value;
      } else {
        this.formData.i_pers = '';
      }
    }
  },
    // Отмена редактирования/добавления
    resetForm() {
      this.formData = {
        i_name: '',
        i_sname: '',
        i_type: '',
        i_pers: '',
        i_regim: '',
        i_struk: '',
        i_inet: '',
        i_mesto: '',
        i_naznachenie: '',
        i_cod: '',
        i_datais: ''
      };
      this.currentInfoSysId = null;
      this.showForm = false; // скрываем форму
    },
    // Заполнение формы для редактирования
    async editInfoSys(id) {
      try {
        const res = await fetch(`${this.apiUrl}/api/user/system/${id}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        const data = await res.json();
        this.formData = {
          i_name: data.i_name || '',
          i_sname: data.i_sname || '',
          i_type: data.i_type || '',
          i_pers: data.i_pers || '',
          i_regim: data.i_regim || '',
          i_struk: data.i_struk || '',
          i_inet: data.i_inet || '',
          i_mesto: data.i_mesto || '',
          i_naznachenie: data.i_naznachenie || '',
          i_cod: data.i_cod || '',
          i_datais: data.i_datais ? this.formatDateForInput(data.i_datais) : ''
        };
        this.currentInfoSysId = data.id;
        this.showForm = true;
        // Можно загрузить справочники, если нужно
        await this.loadDictionaryValuesForUser('infoSysType');
        await this.loadDictionaryValuesForUser('answers');
        await this.loadDictionaryValuesForUser('inet_answers');
        await this.loadDictionaryValuesForUser('cod_answers');
        await this.loadDictionaryValuesForUser('regimIS');
        await this.loadDictionaryValuesForUser('strukIS');
        // установите состояние
        this.handleTypeChange();
      } catch (err) {
        console.error('Ошибка редактирования:', err);
      }
    },

    // Форматировать дату для input date
    formatDateForInput(dateStr) {
      const date = new Date(dateStr);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },

    // Форматировать дату для отображения
    formatDateForDisplay(dateStr) {
      if (!dateStr) return '';
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return '';
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}.${month}.${year}`;
    },

    // Сохранить объект (добавить или обновить)
    async saveInfoSys() {
      // подготовка данных
      const data = { ...this.formData };
      try {
        if (this.currentInfoSysId) {
          // обновление
          const res = await fetch(`${this.apiUrl}/api/user/system/${this.currentInfoSysId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert('Объект информатизации успешно обновлен');
            this.loadInfoSys();
            this.resetForm();
            this.showForm = false; // скрываем форму после сохраненияthis.showForm = false; // скрываем форму после сохранения
          } else {
            alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
          }
        } else {
          // добавление
          const res = await fetch(`${this.apiUrl}/api/user/system`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert('Объект информатизации успешно добавлен');
            this.loadInfoSys();
            this.resetForm();
          } else {
            alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
          }
        }
      } catch (err) {
        alert('Ошибка сети или сервера');
        console.error(err);
      }
    },

    // Удаление
async deleteInfoSys(id) {
  if (confirm('Удалить этот объект информатизации?')) {
    try {
      await fetch(`${this.apiUrl}/api/user/system/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      await this.loadInfoSys(); // Обновляем список
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  }
},

    // Загрузка справочников (пример)
    async loadDictionaryValuesForUser(type) {
      try {
        const response = await fetch(`${this.apiUrl}/api/user/dictionaries/${type}`, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        this.dictionaries[type] = data;
      } catch (err) {
        console.error('Ошибка загрузки справочника:', err);
      }
    },

    // Обновление опций для select (при необходимости)
    truncate(str, maxLength) {
      if (str.length <= maxLength) {
        return str;
      }
      return str.substring(0, maxLength) + '...';
    },
  },
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadInfoSys();
    // Загрузите справочники, если нужно при старте
    this.loadDictionaryValuesForUser('infoSysType');
    this.loadDictionaryValuesForUser('answers');
    this.loadDictionaryValuesForUser('inet_answers');
    this.loadDictionaryValuesForUser('cod_answers');
    this.loadDictionaryValuesForUser('regimIS');
    this.loadDictionaryValuesForUser('strukIS');
  }
};
</script>


<style>
#InfoSysTable td {
  min-width: 84px;
}
#InfoSysTable thead tr {
  height: 30px !important;
}
#InfoSysTable tbody tr {
  height: 50px !important;
}

</style>