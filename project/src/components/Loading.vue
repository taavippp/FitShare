<script setup lang="ts">
    console.log("Loading instance!")
</script>
<template>
    <div>
        <img src="/loading.gif" alt="Loading animation">
    </div>
</template>
<style scoped>
    div {
        width: 100vw;
        display: flex;
        justify-content: center;
    }

    img {
        width: 5rem;
        height: 5rem;
        padding-top: 5rem;
        image-rendering: pixelated;
    }
</style>