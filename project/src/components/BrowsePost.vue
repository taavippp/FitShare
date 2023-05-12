<script setup lang="ts">
import { AxiosResponse } from 'axios';
import AppRequest from '../../classes/AppRequest';
import { Post } from '../../classes/model/Post';
import { BaseResponseBody } from '../../classes/BaseResponse';
import Loading from './Loading.vue';
import { Ref, ref, toRaw } from 'vue';
import { Exercise } from '../../classes/model/Exercise';
import { paths } from '../router';
import { ClientComment, ClientCommentSchema } from "../../classes/model/Comment"
import CommentForm from './CommentForm.vue';

const props = defineProps<{
    post: Post,
    author: string,
}>();

const exerciseURL: string = "/api/exercise"
const exerciseReq: AppRequest = new AppRequest(exerciseURL)
const commentURL: string = "/api/comment"
const commentReq: AppRequest = new AppRequest(commentURL)

const postFetched: Ref<boolean> = ref(false)
const loadingComments: Ref<boolean> = ref(false)
const feedback: Ref<string> = ref("")
const exercises: Ref<Array<Exercise>> = ref([])
const comments: Ref<Array<ClientComment> | null> = ref(null)

async function getExercises() {
    postFetched.value = false
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
    postFetched.value = true
}

// TODO
async function getComments() {
    loadingComments.value = true
    const res: AxiosResponse = await commentReq.get({ id: toRaw(props.post).id! })
    const data: BaseResponseBody = res.data
    loadingComments.value = false
    if (data.error) {
        feedback.value = data.message
        return
    }
    comments.value = data.object!.comments as Array<ClientComment>
}

// TODO
async function postComment(text: string) {
    ClientCommentSchema
    const res: AxiosResponse = await commentReq.post()
}

</script>
<template>
    <h2>{{ props.post.title }}</h2>
    <h4>Posted by
        <div class="Author">
            <RouterLink
            :to="`${paths.account}/${author}`"
            v-if="author !== 'DELETED USER'"
            >
                {{ author }}
            </RouterLink>
            <div v-else>{{ author }}</div>
        </div>
        {{ new Date(props.post.timestamp!).toLocaleString() }}
    </h4>
    <Loading v-if="!postFetched && !feedback" @vnode-before-mount="getExercises"/>
    <h3 v-else-if="!postFetched">{{ feedback }}</h3>
    <div v-else class="Exercises">
        <table class="ExercisesTable"> 
            <thead>
                <th>Name</th>
                <th>Sets</th>
                <th>Reps</th>
            </thead>
            <tbody>
                <tr v-for="(postExercise) in props.post.content">
                    <td class="ExerciseName">{{
                    exercises.find((exercise) => {
                        return exercise.id === postExercise[0]
                    })!.name
                    }}</td>
                    <td>{{ postExercise[1] }}</td>
                    <td>{{ postExercise[2] }}</td>
                </tr>
            </tbody>
        </table>
        <button class="CommentsButton" v-if="!loadingComments && !comments" @click="getComments">Load comments</button>
        <div v-else class="CommentsSection">
            <h3 v-if="!comments">{{ feedback }}</h3>
            <h3 v-else>Comments</h3>
            <table class="CommentsTable">
                <CommentForm :submitComment="postComment"/>
                <hr>
                <p>{{ comments!.length }} comments</p>
                <tbody>
                    <tr v-for="(comment) in comments">
                        <td>{{ comment.username }}</td>
                        <td>{{ comment.text }}</td>
                        <td>{{ new Date(comment.timestamp!).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped>
h4, a {
    font-size: 1.25rem;
}

div.Author, div.Author * {
    display: inline;
}


table {
    font-size: 1.25rem;
    border: 2px solid var(--color_border);
}

div.CommentsSection button.CommentsButton {
    margin-top: 1rem;
}

table.ExercisesTable {
    width: max-content;
}

table.CommentsTable {
    padding: 1rem;
}

div.CommentForm {
    display: flex;
    flex-direction: column;
    align-items: center;
}

textarea {
    resize: none;
}

td, th {
    padding-inline: .5rem;
    border: 1px solid black;
    text-align: center;
}

th {
    border: none;
}

td.ExerciseName {
    text-align: initial;
}

div.Exercises {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
}
</style>