<script setup lang="ts">
import { AxiosResponse } from 'axios';
import AppRequest from '../../classes/AppRequest';
import { BaseResponseBody } from '../../classes/BaseResponse'
import { paths } from '../router';
import ExerciseCategory from "../../classes/ExerciseCategory"
import { ref, Ref, toRaw } from 'vue';
import Loading from '../components/Loading.vue';
import { Exercise } from '../../classes/model/Exercise';

const isAdminURL: string = "/api/is_admin"
const exerciseURL: string = "/api/exercise"
const isAdminReq: AppRequest = new AppRequest(isAdminURL)
const exerciseReq: AppRequest = new AppRequest(exerciseURL)

const verified: Ref<boolean> = ref(false)
const name: Ref<string> = ref("")
const categories: Ref<Array<number>> = ref([])
const loading: Ref<boolean> = ref(false)
const feedback: Ref<string> = ref("")

async function verifyAdmin() {
    if (verified.value) {
        return
    }
    const token: string | null = sessionStorage.getItem("token")
    if (!token) {
        window.location.assign(paths.home)
        return
    }
    const res: AxiosResponse = await isAdminReq.setAuthorization(token).get()
    const data: BaseResponseBody = res.data
    if (data.error) {
        window.location.assign(paths.home)
        return
    }
    verified.value = true
}

function addCategory(event: MouseEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement
    const value: number = Number(target.value)
    if (target.checked) {
        categories.value.push(value)
        return
    }
    const index = categories.value.indexOf(value)
    categories.value.splice(index, 1)
}

async function submitExercise() {
    loading.value = true
    const values: Array<number> = toRaw(categories.value)
    const token: string | null = sessionStorage.getItem("token")
    const exercise: Exercise = {
        name: name.value,
        categories: values
    }
    const res = await exerciseReq.setAuthorization(token!).post(exercise)
    const data: BaseResponseBody = res.data
    feedback.value = data.message
    categories.value = []
    loading.value = false
}
</script>
<template>
    <Loading v-if="!verified || loading" @vnode-before-mount="verifyAdmin"/>
    <div v-else class="Admin">
        <h2>Insert new exercises</h2>
        <h4 v-show="feedback">{{ feedback }}</h4>
        <label for="name">Exercise name</label>
        <input id="name" type="text" v-model="name">
        <label for="category">Categories</label>
        <table>
            <tr class="CategorySelect" v-for="(index, category) in ExerciseCategory">
                    <td>
                        <label :for="`${category}`">{{ category }}</label>
                    </td>
                    <td>
                        <input type="checkbox" :id="`${category}`" :value.number="index" @click="addCategory">
                    </td>
            </tr>
        </table>
        <button @click="submitExercise">Submit</button>
    </div>
</template>
<style scoped>
    div.Admin {
        width: 100vw;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    input[type="checkbox"] {
        width: 25px;
        height: 25px;
        background-color: aqua;
    }

    label {
        font-size: 2rem;
    }

    div.CategorySelect {
        display: flex;
        align-items: center;
    }

    div.CategorySelect label {
        font-size: 1.25rem;
    }
</style>