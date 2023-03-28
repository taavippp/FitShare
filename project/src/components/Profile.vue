<script setup lang="ts">
    import { AxiosHeaders, AxiosResponse } from 'axios';
    import { Ref, ref } from 'vue';
    import AppRequest from '../../classes/AppRequest';
    import { BaseResponseBody } from '../../classes/BaseResponse';
    import { User } from '../../classes/model/User';
    import { paths } from '../router';
    import Loading from './Loading.vue';
    import { RouterLink } from 'vue-router';
    
    const props = defineProps<{
        username: string | null
    }>()

    const userURL: string = "/api/user"
    const req: AppRequest = new AppRequest(userURL)

    const showForm: Ref<boolean> = ref(false)
    const password: Ref<string> = ref("")
    const feedback: Ref<string> = ref("")
    const loading: Ref<boolean> = ref(false)

    function signOut() {
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("token")
        window.location.assign(paths.home)
    }

    async function deleteAccount() {
        if (!showForm.value) {
            showForm.value = true
            return
        }
        loading.value = true
        const token = sessionStorage.getItem("token")
        const res: AxiosResponse = await req.setAuthorization(token!).delete(
            {
                username: props.username,
                password: password.value
            }
        )
        const data: BaseResponseBody = res.data
        feedback.value = `${data.message}!`
        loading.value = false
        if (!data.error) {
            signOut()
        }
    }
</script>
<template>
    <Loading v-if="loading"/>
    <div v-else>
        <h2>Profile</h2>
        <h3>{{ `Signed in as ${username}` ?? "Not logged in" }}</h3>
        <button @click="signOut">Sign out</button>
        <h4 v-if="feedback">{{ feedback }}</h4>
        <div v-show="showForm">
            <label for="password">Password</label>
            <input type="password" name="password" v-model="password">
        </div>
        <button class="Risky" @click="deleteAccount">Delete account</button>
        <RouterLink :to="paths.admin"><button>Admin</button></RouterLink>
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

    .Risky {
        color: red;
    }

    .Risky:hover {
        border: 2px solid red;
    }

    button {
        margin-bottom: 1rem;
        border: 2px solid var(--color_button)
    }

    input {
        margin-bottom: 1rem;
    }

    h4 {
        font-family: var(--font);
        font-size: 2rem;
        margin: 0;
    }

    a {
        padding: 0;
    }
</style>