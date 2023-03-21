<script setup lang="ts">
    import PictureContainer from '../components/PictureContainer.vue';
</script>
<template>
    <div>
        <div class="BigText">
            <h2>FitShare</h2>
            <h3>is a website for sharing training knowledge.</h3>
        </div>
        <PictureContainer
        src="/home_apples_shelley-pauls-unsplash.jpg"
        alt="Website"
        >
        Create your own workouts and share your knowledge with the world. Browse and comment on workouts posted by others and find inspiration for your own training.
        </PictureContainer>
        <PictureContainer
        src="/barbell_victor-freitas-unsplash.jpg"
        alt="Barbell"
        >
        Found an interesting workout? Try it out right away with the live training tool which includes a built-in timer and a simple user interface.
        </PictureContainer>
        <div class="Footer">
            Taavi Pahk 2023
            <a href="https://github.com/taavippp/fit-share" target="_blank">GitHub</a>
        </div>
    </div>
</template>
<style scoped>
    div {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    div.BigText {
        display: initial;
        width: fit-content;
        text-align: center;
    }

    @keyframes homeAnimation {
        0%      {color: black}
        40%     {color: var(--color_logo)}
        60%     {color: var(--color_logo)}
        100%    {color: black}
    }

    div.BigText h2 {
        animation: homeAnimation 2s infinite;
    }

    div.Footer {
        width: 100%;
        font-family: var(--font);
        border-top: 2px solid var(--color_border);
        color: white;
        background-color: var(--color_border);
        font-size: 1.5rem;
    }

    div.Footer a {
        color: white;
        text-decoration: underline;
    }
</style>