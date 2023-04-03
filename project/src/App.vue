<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import { RouterView } from "vue-router"
</script>
<template>
  <NavBar/>
  <div class="RouterView">
    <!-- This would be problematic if URL updated many times per second. -->
    <RouterView :key="$route.fullPath"/>
  </div>
</template>
<!-- Global stylesheet. -->
<style src="./App.css"/>
<style>
div.RouterView {
  margin-top: 5rem;
}
</style>