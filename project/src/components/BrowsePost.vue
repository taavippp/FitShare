<script setup lang="ts">
import { AxiosResponse } from 'axios';
import AppRequest from '../../classes/AppRequest';
import { Post } from '../../classes/model/Post';
import { BaseResponseBody } from '../../classes/BaseResponse';
import Loading from './Loading.vue';
import { Ref, ref, toRaw } from 'vue';
import { Exercise } from '../../classes/model/Exercise';

const props = defineProps<{
    post: Post
}>();

const exerciseURL: string = "/api/exercise"
const exerciseReq: AppRequest = new AppRequest(exerciseURL)

const fetched: Ref<boolean> = ref(false)
const feedback: Ref<string> = ref("")
const exercises: Ref<Array<Exercise>> = ref([])

async function getExercises() {
    fetched.value = false
    const exerciseIDs: Set<number> = new Set()
    for (const exercise of props.post.content) {
        exerciseIDs.add(exercise[0])
    }
    const res: AxiosResponse = await exerciseReq.get({ IDs: Array.from(exerciseIDs).join("-") })
    const data: BaseResponseBody = res.data
    if (data.error) {
        feedback.value = `${data.message}!`
        return
    }
    exercises.value = data.object!.exercises as Array<Exercise>
    fetched.value = true
}
</script>
<template>
    <h2>{{ props.post.title }}</h2>
    <h4>Uploaded {{ new Date(props.post.timestamp!).toLocaleString() }}</h4>
    <Loading v-if="!fetched && !feedback" @vnode-before-mount="getExercises"/>
    <h3 v-else-if="!fetched">{{ feedback }}</h3>
    <table v-else>
        <thead>
            <th>Name</th>
            <th>Sets</th>
            <th>Reps</th>
        </thead>
        <tbody>
            <tr v-for="(postExercise) in props.post.content">
                <td>{{
                exercises.find((exercise) => {
                    return exercise.id === postExercise[0]
                })!.name
                }}</td>
                <td>{{ postExercise[1] }}</td>
                <td>{{ postExercise[2] }}</td>
            </tr>
        </tbody>
    </table>
</template>
<style scoped>
</style>