<template>
  <div>
    <Vue3VirtualScroller
      :items="filteredOptions"
      :item-height="30"
      style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px;"
    >
      <!-- Используем v-slot с деструктуризацией -->
      <template #default="{ item }">
        <div v-if="item" @click="selectItem(item)">
          {{ item.label }}
        </div>
      </template>
    </Vue3VirtualScroller>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VirtualSelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number, Object],
      required: false,
      default: null
    }
  },
  computed: {
    filteredOptions() {
      return this.options;
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('update:modelValue', item.value);
    }
  }
});
</script>