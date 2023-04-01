<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import { RouterView } from "vue-router"
</script>
<template>
  <NavBar/>
  <div class="RouterView">
    <RouterView/>
  </div>
</template>
<style src="./App.css">
div.RouterView {
  margin-top: 5rem;
}
</style>