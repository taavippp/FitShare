<script setup lang="ts">
    defineProps<{
        src: string,
        alt: string,
        text: string,
    }>()
</script>
<template>
    <div class="PictureContainer">
        <img :src="src" :alt="alt">
        <p>{{ text }}</p>
    </div>
</template>
<style scoped>
div.PictureContainer {
    display: flex;
    align-items: center;
    border: 2px solid var(--color_border);
    flex-direction: row;
    width: 50vw;
    margin-bottom: 1.5rem;
}

img {
    width: 25vw;
    height: auto;
    border-radius: 5px;
}

p {
    font-size: 2vw;
    text-align: justify;
    font-family: var(--font);
}

div img, div p {
    margin: 1rem;
}
</style>