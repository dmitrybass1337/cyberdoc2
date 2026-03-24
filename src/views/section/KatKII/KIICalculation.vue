<template>
  <div>
    <div id="UzFormContainer" style="margin: 0 auto; background: #fff; padding: 0px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
<p><strong>Название ИС: </strong><span class="text-success"><strong>{{ systemName }}</strong></span></p>
<p><strong>Тип ИС: </strong><span class="text-success"><strong>{{ systemType }}</strong></span></p>
<p><strong>Обработка персональных данных: </strong><span class="text-success"><strong>{{ systemPers }}</strong></span></p>
		<div class="alert alert-dismissible alert-warning">
		<p style="text-align: center;"><strong>Категорирование объектов КИИ недоступно.</strong></p>
		</div>
<p>&nbsp;</p>

</div>
</div>
</template>

<script>
export default {
  props: {
systemName: String,
systemType: String,
systemPers: String,
    },
};
</script>
<style>
/* добавьте стили при необходимости */
</style>
