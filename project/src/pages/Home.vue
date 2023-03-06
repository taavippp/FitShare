<template>
    <div class="bigText">
        <h2>FitShare</h2>
        <h3>is a website for sharing training knowledge.</h3>
    </div>
</template>
<style scoped>
    h2, h3 {
        font-family: var(--font_large);
    }
    
    h2 {
        font-size: 3.5rem;
    }

    h3 {
        font-size: 2.5rem;
    }

    .bigText {
        width: 100vw;
        text-align: center;
    }

    @keyframes homeAnimation {
        0%      {color: black}
        40%     {color: var(--color_logo)}
        60%     {color: var(--color_logo)}
        100%    {color: black}
    }

    .bigText h2 {
        animation: homeAnimation 2s infinite;
    }
</style>