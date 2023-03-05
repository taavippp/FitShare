<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import { RouterView } from "vue-router"
</script>

<template>
  <NavBar/>
  <div class="routerView">
    <RouterView/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fjalla+One&family=Oxygen:wght@700&display=swap');

body {
  background-color: white;
  margin: 0;
  padding: 0;
}

:root {
  --color_logo: #2222bb;
  --color_text_1: #222;
  --color_text_2: #333;
  --color_border: #3333cc;
  --color_button: white;
  --color_button_hover: #eee;
  --font_logo: 'Fjalla One', sans-serif;
  --font_large: 'Oxygen', sans-serif;
}

.routerView {
  margin-top: 5rem;
}
</style>