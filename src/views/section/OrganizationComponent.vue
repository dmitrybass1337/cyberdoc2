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
<p style="text-align: center; color: #008CBA; font-weight: bold;">ОРГАНИЗАЦИЯ</p>
      <!-- Форма редактирования/создания организации -->
      <form @submit.prevent="saveOrganization" v-if="showForm" style="display: flex; flex-direction: column; gap: 5px;">
        <!-- Поле "Наименование органицазии полное" -->
        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="full_name_org">Наименование</label>
          <input
            id="full_name_org"
            v-model="organization.full_name_org"
            @input="validateField('full_name_org')"
            :class="inputClass('full_name_org')"
            placeholder="Наименование органицазии полное"
            required
          />
        </div>

        <!-- Поле "Краткое наименование" -->
        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="short_name">Краткое наименование</label>
          <input
            id="short_name"
            v-model="organization.short_name"
            @input="validateField('short_name')"
            :class="inputClass('short_name')"
            placeholder="Краткое наименование органицазии"
            required
          />
        </div>

        <!-- Аналогично для остальных полей -->
		
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="inn">ИНН</label>
<!-- ИНН -->
<input
  id="inn"
  v-model="organization.inn"
  @input="handleInput('inn')"
  :class="inputClass('inn')"
  placeholder="ИНН"
  required
/>
        </div>

        <div class="form-group">
          <label class="form-label" style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" for="ogrn">ОГРН</label>
<input
  id="ogrn"
  v-model="organization.ogrn"
  @input="handleInput('ogrn')"
  :class="inputClass('ogrn')"
  placeholder="ОГРН"
  required
/>		  
        </div>

        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="kpp">КПП</label>
<input
  id="kpp"
  v-model="organization.kpp"
  @input="handleInput('kpp')"
  :class="inputClass('kpp')"
  placeholder="КПП"
  required
/>
        </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="email">Электронная почта</label>
          <input
            id="email"
            type="email"
            v-model="organization.email"
            @input="validateField('email')"
            :class="inputClass('email')"
            placeholder="Электронная почта организации"
            required
          />
        </div>

        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="ib_phone">Телефон ответственного</label>
<input
  id="ib_phone"
  v-model="organization.ib_phone"
  @input="handleInput('ib_phone')"
  :class="inputClass('ib_phone')"
  placeholder="Телефон ответственного"
  required
/>
        </div>

        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="website">Сайт организации</label>
          <input
            id="website"
            v-model="organization.website"
            @input="validateField('website')"
            :class="inputClass('website')"
            placeholder="Сайт организации"
          />
        </div>

        <div class="form-group">
          <label style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;" class="form-label" for="address">Адрес организации</label>
          <input
            id="address"
            v-model="organization.address"
            @input="validateField('address')"
            :class="inputClass('address')"
            placeholder="Адрес организации"
            required
          />
        </div>

        <!-- Кнопка сохранить -->
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
<button class="btn btn-success" type="submit">
  <i class="fas fa-floppy-disk"></i> Сохранить
</button>
        </div>
      </form>
<div v-if="showStatus" class="status-message">
  <p>{{ statusMessage }}</p>
  <button @click="showStatus = false"><i class="fas fa-times" style="color: #008CBA;"></i></button>
</div>
<!-- Блок с данными организации -->
<div v-if="!showForm && organizationData" style="margin-top: 20px; display: flex; justify-content: center;">
  <div style="max-width: 600px; width: 100%; text-align: center;">
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;"><strong>Наименование полное:<br /></strong></p> <p> {{ organizationData.full_name_org }}</p>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;"><strong>Краткое наименование:<br /></strong></p> <p>{{ organizationData.short_name }}</p>
<div style="display: flex; justify-content: center; gap: 20px; align-items: flex-start;">
  <div>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;">
      <strong>ИНН</strong>
    </p>
    <p>{{ organizationData.inn }}</p>
  </div>
  <div>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;">
      <strong>ОГРН</strong>
    </p>
    <p>{{ organizationData.ogrn }}</p>
  </div>
</div>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;"><strong>КПП</strong></p> <p>{{ organizationData.kpp }}</p>
<div style="display: flex; gap: 40px; justify-content: center; align-items: flex-start;">
  <div style="text-align: center;">
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;">
      <strong>Электронная почта</strong>
    </p>
    <p>{{ organizationData.email }}</p>
  </div>
  <div style="text-align: center;">
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;">
      <strong>Телефон</strong>
    </p>
    <p>{{ organizationData.ib_phone }}</p>
  </div>
</div>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;"><strong>Сайт</strong></p> <p>{{ organizationData.website }}</p>
    <p style="display: block; color: #008CBA; margin-bottom: 5px; font-weight: bold;"><strong>Адрес:<br /></strong></p> <p>{{ organizationData.address }}</p>
  </div>
</div>

<!-- Контейнер для кнопки "Редактировать" справа -->
<div v-if="organizationData && !isEditing" style="margin-top: 10px; display: flex; justify-content: flex-end;">
  <button class="btn btn-info" @click="editOrganization">
    <i class="fas fa-pencil-square"></i> Редактировать
  </button>
</div>

    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      statusMessage: '',
      showStatus: false,
      organizationData: null,
      isEditing: false,
      showForm: false,
      currentOrganizationId: null,
      token: localStorage.getItem('token') || '',
      apiUrl: '',
      // Статус валидации каждого поля (true=валидное, false=невалидное, null=ещё не проверено)
      validationStates: {
        full_name_org: null,
        short_name: null,
        inn: null,
        ogrn: null,
        kpp: null,
        email: null,
        ib_phone: null,
        website: null,
        address: null
      },
      organization: {
        full_name_org: '',
        short_name: '',
        inn: '',
        ogrn: '',
        kpp: '',
        email: '',
        ib_phone: '',
        website: '',
        address: ''
      }
    };
  },
  mounted() {
    this.apiUrl = this.$API_URL;
    this.loadOrganizationData();
  },
  methods: {
  handleInput(field) {
    if (field === 'ib_phone') {
      // Для номера телефона оставить только цифры и символы +()-
      this.organization[field] = this.organization[field].replace(/[^0-9()+-]/g, '');
    } else {
      this.filterDigits(field);
    }
    this.validateField(field);
  },
  filterDigits(fieldName) {
    // Удаляем все, кроме цифр
    this.organization[fieldName] = this.organization[fieldName].replace(/\D/g, '');
  },
  validateField(fieldName) {
    const value = this.organization[fieldName];
    if (value && value.trim() !== '') {
      this.validationStates[fieldName] = true;
    } else {
      this.validationStates[fieldName] = false;
    }
  },
async loadOrganizationData() {
  try {
    const res = await fetch(`${this.apiUrl}/api/user/organization`, {
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    if (res.status === 404 || res.status === 204) {
      // Организация не найдена, показываем форму создания
      this.organizationData = null;
      this.showForm = true;
      this.resetForm();
      return;
    }
    if (!res.ok) throw new Error('Ошибка при получении данных организации: ' + res.status);
    const data = await res.json();
    if (data) {
      this.organizationData = data;
console.log(this.organizationData);
      this.currentOrganizationId = data.id;
      this.showForm = false; // показываем данные
    } else {
      // Если data null, показываем форму создания
      this.organizationData = null;
      this.showForm = true;
      this.resetForm();
    }
  } catch (err) {
    console.error('Ошибка:', err);
  }
},
    fillForm() {
      if (this.organizationData) {
        Object.keys(this.organization).forEach(key => {
          this.organization[key] = this.organizationData[key] || '';
          this.validationStates[key] = null; // сбрасываем статус
        });
        this.showForm = true;
        this.isEditing = true;
      }
    },
    editOrganization() {
      this.fillForm();
    },
    resetForm() {
      Object.keys(this.organization).forEach(key => {
        this.organization[key] = '';
        this.validationStates[key] = null;
      });
    },
    inputClass(fieldName) {
      if (this.validationStates[fieldName] === null) {
        return 'form-control'; // по умолчанию
      }
      return this.validationStates[fieldName] ? 'form-control is-valid' : 'form-control is-invalid';
    },
    async saveOrganization() {
      try {
        const body = { ...this.organization };
        delete body.id;
        let res;
        if (this.currentOrganizationId) {
          res = await fetch(`${this.apiUrl}/api/user/organization/${this.currentOrganizationId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(body)
          });
        } else {
          res = await fetch(`${this.apiUrl}/api/user/organization`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(body)
          });
        }
        const data = await res.json();
if (res.ok) {
  if (this.currentOrganizationId) {
    this.statusMessage = 'Данные организации успешно обновлены';
  } else {
    this.statusMessage = 'Данные организации успешно сохранены';
  }
  this.showStatus = true;
  // перезагружаем данные
  this.loadOrganizationData();
  this.isEditing = false;
} else {
          alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
        }
      } catch (err) {
        console.error('Ошибка при сохранении:', err);
        alert('Произошла ошибка при сохранении данных');
      }
    }
  }
}
</script>
<style>
.status-message {
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #008CBA;
  border-radius: 5px;
  background-color: #e0f7fa;
  color: #006064;
  position: relative;
}
.status-message button {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>