<script setup lang="ts">
import { AxiosResponse } from 'axios';
import AppRequest from '../../classes/AppRequest';
import { Post } from '../../classes/model/Post';
import { BaseResponseBody } from '../../classes/BaseResponse';
import Loading from './Loading.vue';
import { Ref, ref } from 'vue';

const props = defineProps<{
    post: Post
}>();

const exerciseURL: string = "/api/exercise"
const exerciseReq: AppRequest = new AppRequest(exerciseURL)

const fetched: Ref<boolean> = ref(false)

async function getExercises() {
    fetched.value = false
    const exerciseIDs: Array<number> = props.post.content.map((exercise: Array<number>) => {
        return exercise[0]
    })
    const res: AxiosResponse = await exerciseReq.get({ IDs: exerciseIDs.join("-") })
    const data: BaseResponseBody = res.data
    fetched.value = true
}
</script>
<template>
    <h2>{{ props.post.title }}</h2>
    <h3>{{ new Date(props.post.timestamp!).toUTCString() }}</h3>
    <Loading v-if="!fetched" @vnode-before-mount="getExercises"/>
</template>
<style scoped>
</style>