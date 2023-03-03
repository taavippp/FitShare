<script setup lang="ts"></script>

<template>
    <nav class="mainNav">
        <span class="left">
            <img src="../assets/logo-96.png" alt="FitShare logo">
            <a href="/">
                <h1>FitShare</h1>
            </a>
        </span>
        <span class="right">
            <a href="/train"><button>Train</button></a>
            <a href="/browse"><button>Browse</button></a>
            <a href="/account"><button>Account</button></a>
        </span>
    </nav>
</template>

<style scoped>
    nav.mainNav {
        display: flex;

        position: fixed;
        top: 0;
        width: 100vw;
        height: 6rem;

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
        object-fit: contain;

        height: min-content;
        padding: 0 1em;
    }

    a {
        text-decoration: none;
    }

    button {
        border: none;
        border-left: 2px solid var(--color_border);

        cursor: pointer;
        
        height: 6rem;
        padding: 0 1rem;
        
        font-size: 3rem;
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
        font-size: 4em;
        color: var(--color_logo)
    }
</style>