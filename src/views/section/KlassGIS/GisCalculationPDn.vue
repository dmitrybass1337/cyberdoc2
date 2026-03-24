<template>
  <div style="margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
    <h4 style="text-align: center;">Финальный результат классификации</h4>
    <!-- Новое: отображение выбранных параметров -->
    <div style="margin-top: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">

<p><strong>Название ИС: </strong><span class="text-success"><strong>{{ systemName }}</strong></span></p>
<p><strong>Тип ИС: </strong><span class="text-success"><strong>{{ systemType }}</strong></span></p>
<p><strong>Обработка персональных данных: </strong><span class="text-success"><strong>{{ systemPers }}</strong></span></p>
<p><strong>Класс защищённости: </strong><span class="text-success"><strong>{{ currentData.class }}</strong></span></p>
<p><strong>Уровень значимости: </strong><span class="text-success"><strong>{{ currentData.levelImportance }}</strong></span></p>
<p><strong>Уровень защищённости: </strong> <span class="text-success"><strong>УЗ {{ level.level }}</strong></span></p>
<p><strong>Ущерб Конфиденциальности: </strong><span class="text-success"><strong> {{ currentData.levels.confidentiality }}</strong></span></p>
<p><strong>Ущерб Целостности: </strong><span class="text-success"><strong> {{ currentData.levels.integrity }}</strong></span></p>
<p><strong>Ущерб Доступности: </strong><span class="text-success"><strong> {{ currentData.levels.availability }}</strong></span></p>
<p><strong>Масштаб ИС: </strong> <span class="text-success"><strong> {{ currentData.currentMashtab }}</strong></span></p>
<p><strong>Тип уроз: </strong> <span class="text-success"><strong>{{ threatType }}</strong></span></p>
<p><strong>Тип персональных данных: </strong> <span class="text-success"><strong>{{ ispType }}</strong></span></p>
<p><strong>Тип субьектов персональных данных: </strong> <span class="text-success"><strong>{{ subjects }}</strong></span></p>
<p><strong>Количество персональных данных: </strong> <span class="text-success"><strong>{{ quantity }}</strong></span></p>
    </div>





  </div>
      <!-- Кнопка назад -->
    <div style="text-align: center; margin-top: 20px;">
      <button @click="goBack" class="btn btn-secondary">Назад</button>

    <!-- Кнопка сохранить -->

    <button class="btn btn-primary" @click="saveToServer">Сохранить</button>
    </div>
</template>

<script>
export default {
  props: {
    level: {
      type: Object,
      required: true
    },
systemId: Number,
systemName: String,
systemType: String,
systemPers: String,
  currentData: {
    type: Object,
    default: () => ({
      class: '',
      levelImportance: '',
      levels: {
        confidentiality: '',
        integrity: '',
        availability: ''
      },
      currentMashtab: '',
      class_ispdn: '',	  
    })
  },
  },
  methods: {
    goBack() {
      // Эмитим событие, чтобы главный компонент понял, что нужно вернуться
      this.$emit('go-back-gis');
    },
	
	
async saveToServer() {
const dataToSave = {
  systemId: this.systemId,
  systemName: this.systemName,
  systemType: this.systemType,
  systemPers: this.systemPers,
  classic: this.currentData.class,
  levelImportance: this.currentData.levelImportance,
  levela: String(this.level.level),
  levels: {
    confidentiality: this.currentData.levels.confidentiality,
    integrity: this.currentData.levels.integrity,
    availability: this.currentData.levels.availability
  },
  currentMashtab: this.currentData.currentMashtab,
  threatType: this.threatType,
  ispType: this.ispType,
  subjects: this.subjects,
  quantity: this.quantity,
};
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
    threatType() {
      // например, преобразуйте значение ugroza в понятный текст
      const map = {
        '1': 'НДВ в системном ПО (Тип Угроз 1)',
        '2': 'НДВ в прикладном ПО (Тип Угроз 2)',
        '3': 'Нерассматариваются НДВ (Тип Угроз 3)',
      };
      return map[this.level.ugroza] || '';
    },
    ispType() {
      const map = {
        's21': 'Специальная ИСПДн',
        's22': 'Биометрическая ИСПДн',
        's23': 'Общедоступная ИСПДн',
        's24': 'Иная ИСПДн',
      };
      return map[this.level.typeIspdn] || '';
    },
    subjects() {
      const map = {
        's31': 'Сотрудники организации',
        's32': 'Иные лица',
      };
      return map[this.level.typeSotrud] || '';
    },
    quantity() {
      const map = {
        's41': 'Менее 100 000 человек',
        's42': 'Более 100 000 человек',
      };
      return map[this.level.kolvo] || '';
    },
  },

mounted() {
console.log('Получен объект:', this.currentData, this.level );
},
watch: {
  currentData(newVal) {
    console.log('currentData изменился:', newVal);
  },
}
}
</script>