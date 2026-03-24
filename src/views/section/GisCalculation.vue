<template>
  <div style="border:1px solid #ccc; padding:15px; border-radius:8px; margin-top:20px;">
    <h4 style="text-align:center;">Определение класса защищённости (ГИС)</h4>
    <button class="btn btn-info" @click="calculateClass">Рассчитать класс</button>
    <div v-if="result" style="margin-top:15px;">
      <p><strong>Класс защищённости:</strong> {{ result.class }}</p>
      <p><strong>Уровень защищённости:</strong> {{ result.level }}</p>
      <button class="btn btn-success" @click="save">Записать</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: null
    };
  },
  methods: {
    calculateClass() {
      // тут ваша логика
      this.result = { class: '-', level: '-' };
    },
    save() {
      this.$emit('save', {
        class: this.result.class,
        level: this.result.level
      });
    }
  }
}
</script>