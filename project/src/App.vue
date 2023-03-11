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
@import url('https://fonts.googleapis.com/css2?family=Fjalla+One&family=Oxygen:wght@700&family=Tajawal&display=swap');

body {
  background-color: white;
  margin: 0;
  padding: 0;
}

:root {
  --color_logo: #2222bb;
  --color_border: #3333cc;
  --color_nav_button: white;
  --color_nav_button_hover: #eee;
  --color_button: #eee;
  --color_button_hover: #ddd;
  --color_logged_in: #33aa33;
  --font_logo: 'Fjalla One', sans-serif;
  --font_large: 'Oxygen', sans-serif;
  --font: 'Tajawal', sans-serif;
}

.routerView {
  margin-top: 5rem;
}

h2, h3, h4 {
  font-family: var(--font_large);
}

h2 {
  font-size: 3.5rem;
}

h3 {
  font-size: 2.5rem;
}

label, input, button {
  font-size: 1.5rem;
  font-family: var(--font);
}

button {
  background-color: var(--color_button);
  border: 2px solid var(--color_button);
  border-radius: 5px;
}

button:hover {
  border: 2px solid var(--color_border);
}

button:active {
  background-color: var(--color_button_hover);
}
</style>