<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { routes } from '../router';

    console.log(routes.browse.path)
</script>

<template>
    <nav class="mainNav">
        <span class="left">
            <img src="../assets/logo-96.png" alt="FitShare logo">
                <RouterLink :to="routes.home.path">
                    <h1>FitShare</h1>
                </RouterLink>
        </span>
        <span class="right">
            <RouterLink :to="routes.train.path"><button>Train</button></RouterLink>
            <RouterLink :to="routes.browse.path"><button>Browse</button></RouterLink>
            <RouterLink :to="routes.account.path"><button>Account</button></RouterLink>
        </span>
    </nav>
</template>

<style scoped>
    nav.mainNav {
        display: flex;

        position: fixed;
        top: 0;
        width: 100vw;
        height: 5rem;

        overflow: hidden;
        border-bottom: 2px solid var(--color_border);
    }

    .left {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
    }

    .right {
        display: flex;
        align-items: center;
        position: fixed;
        right: 0;
    }

    img {
        image-rendering: initial;
        width: 5rem;
        height: 5rem;

        padding: 0 1rem;
    }

    a {
        text-decoration: none;
    }

    button {
        border: none;
        border-left: 2px solid var(--color_border);

        cursor: pointer;
        
        height: 5rem;
        padding: 0 1rem;
        
        font-size: 2.5rem;
        background-color: var(--color_button);
        font-family: var(--font_large);
        color: var(--color_text_2)
    }

    button:hover {
        background-color: var(--color_button_hover);
    }

    h1 {
        margin: 0;

        font-family: var(--font_logo);
        font-size: 4rem;
        color: var(--color_logo)
    }
</style>