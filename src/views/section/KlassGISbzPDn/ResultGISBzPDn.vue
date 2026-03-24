<template>
  <div style="margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
    <h4 style="text-align: center;">Текущий результат классификации</h4>
    <!-- Новое: отображение выбранных параметров -->

    <div style="margin-top: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
<p><strong>Название ИС: </strong><span class="text-success"><strong>{{ systemName }}</strong></span></p>
<p><strong>Тип ИС: </strong><span class="text-success"><strong>{{ systemType }}</strong></span></p>
<p><strong>Обработка персональных данных: </strong><span class="text-success"><strong>{{ systemPers }}</strong></span></p>
<p><strong>Класс защищённости: </strong><span class="text-success"><strong>{{ currentClass }}</strong></span></p>
<p><strong>Уровень значимости: </strong><span class="text-success"><strong>{{ levelImportance }}</strong></span></p>
<p><strong>Ущерб Конфиденциальности: </strong><span class="text-success"><strong>{{ levels?.confidentiality || '' }}</strong></span></p>
<p><strong>Ущерб Целостности: </strong><span class="text-success"><strong>{{ levels?.integrity || '' }}</strong></span></p>
<p><strong>Ущерб Доступности: </strong><span class="text-success"><strong>{{ levels?.availability || '' }}</strong></span></p>
<p><strong>Масштаб ИС: </strong> <span class="text-success"><strong>{{ currentMashtab }}</strong></span></p>
    </div>
	


<br />
 





  
      <!-- Кнопка назад -->
    <div style="text-align: center; margin-top: 20px;">
      <button @click="goBack" class="btn btn-secondary">Назад</button>

    <!-- Кнопка сохранить -->

    <button class="btn btn-primary" @click="saveToServer">Сохранить</button>
    </div>
</div>
</template>
<script>
import { reactive } from 'vue';
export default {
  emits: ['next-step-gis-bzpdn'],
  setup(props) {
    // Создаем реактивный объект для хранения всех параметров
    const currentData = reactive({
      class: props.currentClass,
      levelImportance: '', // вычислим потом
      levels: { ...props.levels },
      currentMashtab: props.currentMashtab,
    });
// Функция для вычисления уровня важности
    const computeLevelImportance = () => {
      const { confidentiality, integrity, availability } = currentData.levels;
      if (!confidentiality || !integrity || !availability) {
        currentData.levelImportance = 'Не определен';
        return;
      }
      if (
        confidentiality === 'высокий' ||
        integrity === 'высокий' ||
        availability === 'высокий'
      ) {
        currentData.levelImportance = 'УЗн 1';
      } else if (
        confidentiality === 'средний' ||
        integrity === 'средний' ||
        availability === 'средний'
      ) {
        currentData.levelImportance = 'УЗн 2';
      } else {
        currentData.levelImportance = 'УЗн 3';
      }
    };
    // Вызовем сразу после инициализации
    computeLevelImportance();



    // функция для обновления результата при изменениях
    const updateResult = () => {
      // В данном случае ничего не нужно, так как computed автоматически обновляют результат
    };

    return {
      updateResult,
      currentData,
    };





  },
  props: {
    levels: {
      type: Object,
      required: true
    },
systemId: Number,	
systemName: String,
systemType: String,
systemPers: String,
  currentClass: {
    type: String,
    default: ''
  },
  currentMashtab: {
    type: String,
    default: ''
  },
  },
  methods: {
    goBack() {
      // Эмитим событие, чтобы главный компонент понял, что нужно вернуться
      this.$emit('go-back-gis-bzpdn');
    },
async saveToServer() {
const dataToSave = {
  systemId: this.systemId,
  systemName: this.systemName,
  systemType: this.systemType,
  systemPers: this.systemPers,
  classic: this.currentData.class,
  levelImportance: this.currentData.levelImportance,
  levela: 'не актуально',
  levels: {
    confidentiality: this.currentData.levels.confidentiality,
    integrity: this.currentData.levels.integrity,
    availability: this.currentData.levels.availability
  },
  currentMashtab: this.currentData.currentMashtab,
  threatType: '-',
  ispType: '-',
  subjects: '-',
  quantity: '-',
};
console.log(dataToSave);
  try {
    const response = await fetch(`${this.$API_URL}/api/user/save-classification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(dataToSave)
    });

    if (!response.ok) {
      throw new Error('Ошибка при сохранении');
    }

    const result = await response.json();
    console.log('Ответ сервера:', result);
    alert('Данные успешно сохранены');
    // Эмит событие в родительский компонент, чтобы он мог обновить таблицу
	console.log('Вызов $emit');
    this.$emit('update-table');
  } catch (error) {
    console.error(error);
    alert('Ошибка при сохранении данных');
  }
}
  },
  computed: {
    // Вычисляем уровень значимости
    levelImportance() {
      const { confidentiality, integrity, availability } = this.levels;
      // Проверяем наличие уровней
      if (!confidentiality || !integrity || !availability) {
        return 'Не определен'; // или другое значение по умолчанию
      }
      if (
        confidentiality === 'высокий' ||
        integrity === 'высокий' ||
        availability === 'высокий'
      ) {
        return 'УЗн 1'; // высокий уровень
      } else if (
        confidentiality === 'средний' ||
        integrity === 'средний' ||
        availability === 'средний'
      ) {
        return 'УЗн 2'; // средний уровень
      } else {
        return 'УЗн 3'; // низкий уровень
      }
    }
  },
mounted() {
// console.log('Полученные уровни:', this.levels);
// console.log('Получен класс:', this.currentClass);
},
watch: {
  currentClass(newVal) {
    console.log('currentClass изменился:', newVal);
}
}
}
</script>