<script setup lang="ts">
    import AccountForm from '../components/AccountForm.vue';
    import Profile from '../components/Profile.vue';

    const username: string | null = sessionStorage.getItem("username")
    const loggedIn: boolean = username !== null
</script>
<template>
    <Profile v-if="loggedIn" :username="username"/>
    <AccountForm v-else/>
</template>
<style scoped>
</style>