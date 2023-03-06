<script setup lang="ts">
    import { ref, Ref } from 'vue';
    import User from "@/../../classes/model/User"
    import AppRequest from "@/../../classes/AppRequest"
    import { AppResponseBody } from "@/../../classes/AppResponse"
    import { AxiosHeaders, AxiosResponse } from 'axios';
    import { routes } from '../router';

    const url: string = "/api/user"
    
    const isSigningIn: Ref<boolean> = ref(true)
    const username: Ref<string> = ref("")
    const password: Ref<string> = ref("")

    const loading: Ref<boolean> = ref(false)
    const feedback: Ref<string> = ref("")

    function setIsSigningIn(): void {
        feedback.value = ""
        isSigningIn.value = !isSigningIn.value
    }

    async function handleSubmit(): Promise<void> {
        feedback.value = ""
        loading.value = true
        const user = new User(username.value, password.value)
        if (isSigningIn.value) {
            const res: AxiosResponse = await AppRequest.post(
                url,
                user,
                new AxiosHeaders({ "X-Login": "true" }))
            const data: AppResponseBody = res.data
            if (data.error || data.object === undefined) {
                feedback.value = `${data.message}!`
            } else {
                sessionStorage.setItem(
                        "token",
                        String(data.object.token)
                )
                feedback.value = "Successfully logged in!"
                setTimeout(function() {
                    window.location.assign(routes.home.path)
                }, 2000)
            }
            loading.value = false
            return
        }
        const res: AxiosResponse = await AppRequest.post(
            url,
            user,
            new AxiosHeaders({ "X-Login": "false" }))
        const data: AppResponseBody = res.data
        if (!data.error) {
            setTimeout(setIsSigningIn, 2000);
        }
        feedback.value = `${data.message}!`
        loading.value = false
    }
</script>
<template>
    <h2 v-if="loading" class="loading">Loading...</h2>
    <div v-else class="form">
        <h3 v-if="feedback">{{ feedback }}</h3>
        <h2>Sign {{ isSigningIn ? `in` : `up` }}</h2>
        <button @click="setIsSigningIn">Go to sign {{ isSigningIn ? `up` : `in` }}</button>
        <div class="formBox">
            <label for="username">Username</label>
            <input id="username" type="text" v-model="username">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password">
            <button @click="handleSubmit" class="submit">Submit</button>
        </div>
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
        font-size: 1.5rem;
        padding: 0;
    }

    .form {
        width: 100vw;
        height: fit-content;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .formBox {
        border: 2px solid var(--color_border);
        display: inherit;
        flex-direction: column;
        padding: 1.5rem;
        margin-top: 2rem;
    }

    label, input, button {
        font-size: 1.5rem;
        font-family: var(--font);
    }

    .submit {
        margin-top: 1rem;
    }

    .loading {
        width: 100vw;
        text-align: center;
    }

    button {
        background-color: var(--color_button);
        border: 2px solid var(--color_button);
        border-radius: 5px;
    }

    button:hover {
        border: 2px solid var(--color_border);
    }

    button:active {
        background-color: var(--color_button_hover);
    }
</style>