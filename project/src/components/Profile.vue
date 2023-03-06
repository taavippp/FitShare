<script setup lang="ts">
import { routes } from '../router';

    defineProps<{
        username: string | null
    }>()

    function signOut() {
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("token")
        window.location.assign(routes.home.path)
    }
</script>
<template>
    <div>
        <h2>Profile</h2>
        <h3>{{ `Signed in as ${username}` ?? "Not logged in" }}</h3>
        <button @click="signOut">Sign out</button>
        <button class="risky">Delete account</button>
    </div>
</template>
<style scoped>
    div {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h2 {
        margin-bottom: 0;
    }

    .risky {
        color: red;
    }

    .risky:hover {
        border: 2px solid red;
    }

    button {
        margin-bottom: 1rem;
        border: 2px solid var(--color_button)
    }
</style>