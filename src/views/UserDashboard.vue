<template>
  <div class="jumbotron">
    <div class="container-fluid mt-2">
    <!-- Горизонтальные вкладки -->
  <!--  <div class="tabs mb-3">
      <button
        class="btn"
        :class="{'btn-success': activeTab === 'attestation', 'btn-outline-success': activeTab !== 'attestation'}"
        @click="activeTab = 'attestation'"
      >
        Аттестация ИС
      </button>
      <button
        class="btn"
        :class="{'btn-success': activeTab === 'fz', 'btn-outline-success': activeTab !== 'fz'}"
        @click="activeTab = 'fz'"
      >
        152ФЗ
      </button>
    </div>-->

      <!-- Контент по вкладкам -->
      <div v-if="activeTab === 'attestation'">
        <div class="d-flex" style="gap: 5px;">
          <!-- Вертикальное меню -->
          <div id="userMenu" style="min-width: auto;">
            <div class="list-group">
<button
  v-for="item in menuItems"
  :key="item.id"
  @click="selectMenuItem(item.id)"
  :class="['list-group-item', 'list-group-item-action', { active: activeItem === item.id }]"
  style="cursor: pointer; margin-bottom: 0px; height: 30px; display: flex; align-items: center;"
>
  <i :class="[item.icon, 'mr-2', { 'text-primary': activeItem !== item.id, 'text-white': activeItem === item.id }]" style="margin-right: 4px;"></i>
  <span class="label-text">{{ item.label }}</span>
</button>
            </div>
          </div>
          <!-- Контент справа -->
          <div id="menuContent" style="flex: 1;">
            <component :is="currentComponent" />
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'fz'">
        <h3>Модуль подготовки общей документации организации по 152ФЗ</h3>
        <p>Описание и компоненты по созданию документов в рамках требований 152ФЗ.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { isTokenExpired } from '../utils/auth.js';
import { logout } from '../auth.js';
const AppStatistic = defineAsyncComponent(() => import('./section/AppStatistic.vue'));
const OrganizationComponent = defineAsyncComponent(() => import('./section/OrganizationComponent.vue'));
const EmployeesComponent = defineAsyncComponent(() => import('./section/EmployeesComponent.vue'));
const SystemComponent = defineAsyncComponent(() => import('./section/SystemComponent.vue'));
const ArmComponent = defineAsyncComponent(() => import('./section/ArmComponent.vue'));
const NetComponent = defineAsyncComponent(() => import('./section/NetComponent.vue'));

const ShemaComponent = defineAsyncComponent(() => import('./section/ShemaComponent.vue'));
const SziComponent = defineAsyncComponent(() => import('./section/SziComponent.vue'));
const SysAppComponent = defineAsyncComponent(() => import('./section/SysAppComponent.vue'));
const AuditComponent = defineAsyncComponent(() => import('./section/Audit.vue'));
const AppComponent = defineAsyncComponent(() => import('./section/AppComponent.vue'));
const DocsComponent = defineAsyncComponent(() => import('./section/DocsComponent.vue'));
const KommComponent = defineAsyncComponent(() => import('./section/KommComponent.vue'));
const SegmComponent = defineAsyncComponent(() => import('./section/SegmComponent.vue'));
const ChtzComponent = defineAsyncComponent(() => import('./section/ChtzComponent.vue'));
const KlassComponent = defineAsyncComponent(() => import('./section/KlassComponent.vue'));
const ModelUComponent = defineAsyncComponent(() => import('./section/ModelUComponent.vue'));
const ModelNComponent = defineAsyncComponent(() => import('./section/ModelNComponent.vue'));

export default {
  name: "UserDashboard",
  data() {
    return {
      menuItems: [
        { id: "section1", label: "Статистика", icon: "fas fa-chart-line" },
        { id: "section2", label: "Организация", icon: "fa fa-university" },
        { id: "section4", label: "Системы", icon: "fa fa-tasks" },
        { id: "section5", label: "Технические средства", icon: "fa fa-desktop" },
        { id: "section6", label: "Сетевые устройства", icon: "fa fa-share-alt-square" },
        { id: "section7", label: "Средства защиты", icon: "fa fa-shield" },
        { id: "section8", label: "Системное ПО", icon: "fa fa-window-maximize" },
        { id: "section9", label: "Прикладное ПО", icon: "fa fa-window-restore" },
        { id: "section22", label: "Модель угроз", icon: "fa fa-bolt" },
        { id: "section15", label: "Документы", icon: "fa fa-book" },
      ],
      activeItem: "section1",
      activeTab: 'attestation',
    };
  },
  created() {
    const saved = localStorage.getItem('activeMenuItem');
    if (saved && this.menuItems.some(item => item.id === saved)) {
      this.activeItem = saved;
    }
  },
  computed: {
    currentComponent() {
      const map = {
        section1: AppStatistic,
        section2: OrganizationComponent,
        section3: EmployeesComponent,
        section4: SystemComponent,
        section16: AuditComponent,
        section5: ArmComponent,
        section6: NetComponent,
        section10: ShemaComponent,
        section11: KommComponent,
        section12: ChtzComponent,
        section13: SegmComponent,
        section14: KlassComponent,
        section21: ModelNComponent,
        section22: ModelUComponent,
        section15: DocsComponent,
        section7: SziComponent,
        section8: SysAppComponent,
        section9: AppComponent,
        // остальные
      };
      return map[this.activeItem] || null;
    },
  },
  methods: {
    checkToken() {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        alert('Ваша сессия истекла. Пожалуйста, войдите заново.');
        logout();
        return false;
      }
      return true;
    },
    selectMenuItem(id) {
      if (!this.checkToken()) return;
      this.activeItem = id;
      localStorage.setItem('activeMenuItem', id);
    },
  },
};
</script>
<style scoped>
/* Для улучшения внешнего вида активных элементов */
.list-group-item {
  transition: background-color 0.2s, color 0.2s;
}

.list-group-item.active {
  background-color: #008CBA; /* синий цвет Bootstrap */
  color: white;
}

.list-group-item:hover {
  background-color: #008CBA; /* светлый фон при наведении */
}
@media (max-width: 768px) {
  /* Уменьшаем ширину меню */
  #userMenu {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }

  /* Обнуляем паддинги и делаем flex для элементов */
  .list-group {
    width: 60px;
  }

  .list-group-item {
    padding: 8px;
    display: flex; /* добавляем flex */
    align-items: center; /* вертикальное центрирование по вертикали */
    justify-content: center; /* горизонтальное центрирование по горизонтали */
  }

  /* скрываем текст метки */
  .label-text {
    display: none;
  }
  /* иконки без отступа */
  .list-group-item i {
    margin: 0;
  }
}
</style>