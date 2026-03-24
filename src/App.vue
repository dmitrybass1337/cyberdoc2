<template>
<div class="jumbotron">
  <div>
    <AppNavbar />
    <router-view />
  </div>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'

export default {
  components: {
    AppNavbar
  }
}
</script>