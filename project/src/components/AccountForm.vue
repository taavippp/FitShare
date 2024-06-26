<script setup lang="ts">
    import { BaseResponseBody } from "../../classes/BaseResponse"
    import { User, UserSchema } from "@/../../classes/model/User"
    import AppRequest from "@/../../classes/AppRequest"
    import Loading from '../components/Loading.vue';
    import { AxiosResponse } from 'axios';
    import { paths } from '../router';
    import { ref, Ref } from 'vue';

    const URL: string = "/api/user"
    const req: AppRequest = new AppRequest(URL)
    
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
        const user: User = {
            username: username.value,
            password: password.value,
        }
        const { success } = UserSchema.safeParse(user);
        if (!success) {
            feedback.value = "Username must be 3-15 symbols (A-Z, a-z) and password must be at least 8 symbols!"
            return
        }

        loading.value = true

        if (isSigningIn.value) {
            const res: AxiosResponse = await req.setHeader("X-Login", "true").post(
                user
            )
            const data: BaseResponseBody = res.data
            if (data.error) {
                feedback.value = `${data.message}!`
            } else {
                sessionStorage.setItem(
                    "token",
                    data.object!.token as string
                )
                sessionStorage.setItem(
                    "username",
                    user.username
                )
                feedback.value = "Successfully logged in!"
                setTimeout(function() {
                    window.location.assign(paths.home)
                }, 2000)
            }
            loading.value = false
            return
        }
        const res: AxiosResponse = await req.setHeader("X-Login", "false").post(
            user)
        const data: BaseResponseBody = res.data
        if (!data.error) {
            setTimeout(setIsSigningIn, 1500);
        }
        feedback.value = `${data.message}!`
        loading.value = false
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleSubmit()
        }
    }
</script>
<template>
    <Loading v-if="loading"/>
    <div v-else class="Form">
        <h3 v-if="feedback">{{ feedback }}</h3>
        <h2>Sign {{ isSigningIn ? `in` : `up` }}</h2>
        <button @click="setIsSigningIn">Go to sign {{ isSigningIn ? `up` : `in` }}</button>
        <div class="FormBox">
            <label for="username">Username</label>
            <input id="username" type="text" v-model="username">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password">
            <button @click="handleSubmit" @keypress="handleKeyPress" class="submit">Submit</button>
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

    .Form {
        width: 100vw;
        height: fit-content;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .FormBox {
        border: 2px solid var(--color_border);
        display: inherit;
        flex-direction: column;
        padding: 1.5rem;
        margin-top: 2rem;
    }

    .submit {
        margin-top: 1rem;
    }

    .loading {
        width: 100vw;
        text-align: center;
    }
</style>