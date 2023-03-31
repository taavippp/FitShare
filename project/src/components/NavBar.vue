<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { paths } from '../router';
    
    const username: string | null = sessionStorage.getItem("username")
    const loggedIn: boolean = username !== null
</script>
<template>
    <nav class="mainNav">
        <span class="left">
            <RouterLink :to="paths.home">
                <img src="/logo-96.png" alt="FitShare logo">
            </RouterLink>
            <h1>FitShare</h1>
        </span>
        <span class="right">
            <RouterLink :to="paths.create" v-if="loggedIn"><button>+</button></RouterLink>
            <RouterLink :to="paths.train"><button>Train</button></RouterLink>
            <RouterLink :to="`${paths.browse}/page/1`"><button>Browse</button></RouterLink>
            <RouterLink :to="paths.account"><button class="Account" :class="loggedIn ? `LoggedIn` : ``">{{ username ?? "Account" }}</button></RouterLink>
        </span>
    </nav>
</template>
<style scoped>
    @media only screen and (max-width: 940px) {
        h1 {
            display: none;
        }
    }

    nav.mainNav {
        display: flex;

        position: fixed;
        top: 0;
        width: 100vw;
        height: 5rem;

        overflow: hidden;
        border-bottom: 2px solid var(--color_border);
        background-color: white;
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

    nav span button {
        border: none;
        border-left: 2px solid var(--color_border);
        border-radius: 0;

        cursor: pointer;
        
        height: 5rem;
        padding: 0 1rem;
        
        font-size: 2.5rem;
        background-color: var(--color_nav_button);
        font-family: var(--font_large);
    }

    nav span button:hover {
        background-color: var(--color_nav_button_hover);
    }

    .Account.LoggedIn {
        font-size: 2.5vw;
    }

    h1 {
        margin: 0;

        font-family: var(--font_logo);
        font-size: 4rem;
        color: var(--color_logo)
    }
</style>