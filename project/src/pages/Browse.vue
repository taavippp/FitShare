<script setup lang="ts">
import { AxiosResponse } from 'axios';
import { ref, Ref } from 'vue';
import AppRequest from '../../classes/AppRequest';
import { BaseResponseBody } from '../../classes/BaseResponse';
import { PostIDSchema } from '../../classes/model/PostID';
import Loading from '../components/Loading.vue';
import router from '../router';
import { RouteParams } from 'vue-router';
import BrowsePost from '../components/BrowsePost.vue';
import { Post } from '../../classes/model/Post';

const params: Ref<RouteParams> = ref(router.currentRoute.value.params)

const postURL: string = "/api/post"
const commentURL: string = "/api/comment"
const postReq: AppRequest = new AppRequest(postURL)
const commentReq: AppRequest = new AppRequest(commentURL)

const fetched: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(true);
const feedback: Ref<string> = ref("");
const isOnePost: Ref<boolean> = ref(false);

const content: Ref<Post | Array<Post> | undefined> = ref()

async function getContent() {
    loading.value = true;
    const postID: string = params.value.postID as string
    const { success } = PostIDSchema.safeParse(postID)
    if (success) {
        isOnePost.value = true
        const res: AxiosResponse = await postReq.get({ id: postID })
        const data: BaseResponseBody = res.data
        loading.value = false;
        if (data.error) {
            feedback.value = `${data.message}!`
            return
        }
        fetched.value = true
        return
    }
    const page: number = parseInt(params.value.page as string)
    if (isNaN(page) || page < 1) {
        feedback.value = "Missing route params!"
        loading.value = false;
    }
    isOnePost.value = false
    const res: AxiosResponse = await postReq.get({ page })
    const data: BaseResponseBody = res.data
    loading.value = false;
    if (data.error) {
        feedback.value = `${data.message}!`
        return
    }
    fetched.value = true
}
</script>
<template>
    <Loading v-if="loading" @vnode-before-mount="getContent"/>
    <h3 v-else-if="!loading && !fetched">{{ feedback }}</h3>
    <BrowsePost
        v-else
        v-if="isOnePost"
        :post="content as Post"
    />
</template>
<style scoped>
</style>