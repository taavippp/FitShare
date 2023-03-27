<script setup lang="ts">
import { AxiosResponse } from 'axios';
import { ref, Ref } from 'vue';
import AppRequest from '../../classes/AppRequest';
import { BaseResponseBody } from '../../classes/BaseResponse';
import router from '../router';

const postURL: string = "/api/post"

const postID: string = router.currentRoute.value.params.postID as string
const res: AxiosResponse = await AppRequest.get(
    postURL,
    postID ? { id: postID } : {}
)
const data: BaseResponseBody = res.data


</script>
<template>
</template>
<style scoped>
</style>