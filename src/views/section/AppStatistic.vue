<template>
<div class="jumbotron">
    <!-- Заголовок -->

    <!-- Основной контейнер -->

  
  <div id="statistics" style="margin: 0 auto; background: #fff; padding: 10px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
<p style="text-align: center; color: #008CBA; font-weight: bold;">СТАТИСТИКА</p>  

    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-primary" style="max-width: auto;">
          <div class="card-header">ИНФОРМАЦИОННЫЕ СИСТЕМЫ</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card bg-secondary" style="max-width: auto;">
          <div class="card-header">ЦОД</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card text-white bg-info" style="max-width: auto;">
          <div class="card-header">АС</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>


      
      <!-- Повторите для остальных карточек -->
      
      <!-- Например, еще три карточки -->

      <div class="col-md-4 mb-3">
        <div class="card text-white bg-success" style="max-width: auto;">
          <div class="card-header">ГИС</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card text-white bg-warning" style="max-width: auto;">
          <div class="card-header">ИСПДн</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-danger" style="max-width: auto;">
          <div class="card-header">КИИ</div>
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text">-</p>
          </div>
        </div>
      </div>
      


      <!-- Добавьте остальные карточки по аналогии -->
      
    </div>
  </div></div>
</template>

<script>
export default {
  name: "AppStatistic",
  data() {
    return {
    };
  },
  // В реальном приложении можно получать данные через API или Vuex
  // methods: {...}
};
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
</style>