<script setup lang="ts">
import { AxiosHeaders, AxiosResponse } from 'axios';
import { ref, Ref, watch, toRaw } from 'vue';
import AppRequest from '../../classes/AppRequest';
import { BaseResponseBody } from '../../classes/BaseResponse';
import ExerciseCategory from '../../classes/ExerciseCategory';
import Exercise from '../../classes/model/Exercise';
import Loading from '../components/Loading.vue';
import PostExercise from "../../classes/model/PostExercise"
import PostElement from '../components/PostElement.vue';
import Post from "../../classes/model/Post"
import { paths } from '../router';
import PostExerciseDTO from "../../classes/dto/PostExerciseDTO"

const exerciseURL: string = "/api/exercise"
const postURL: string = "/api/post"

const fetched: Ref<boolean> = ref(false)
const title: Ref<string> = ref("")
const nameFilter: Ref<string> = ref("")
const categoryFilter: Ref<number> = ref(0)
const feedback: Ref<string> = ref("")
const loading: Ref<boolean> = ref(false)

const allExercises: Ref<Array<Required<Exercise>>> = ref([])
const filtered: Ref<Array<Required<Exercise>>> = ref([])

type PostElement = {
    editable: boolean;
    exercise: PostExercise;
}

const postElements: Ref<Array<PostElement>> = ref([])

watch([allExercises, nameFilter, categoryFilter], () => {
    filtered.value = allExercises.value.filter((exercise) => {
        if (categoryFilter.value === 0) {
            if (!nameFilter.value) {
                return true
            }
            return exercise.name
                .toLowerCase()
                .includes(
                    nameFilter.value.toLowerCase()
                )
        }
        return (
            exercise.name.includes(nameFilter.value) &&
            exercise.categories.includes(categoryFilter.value)
        )
    })
})

async function getExercises() {
    if (fetched.value) {
        return
    }

    const loggedIn: boolean = "token" in sessionStorage
    if (!loggedIn) {
        window.location.assign(paths.home)
        return
    }

    const res: AxiosResponse = await AppRequest.get(
        exerciseURL,
        {
            categories: Object.keys(
                ExerciseCategory
            ).map((key) => key.toLowerCase()).join("-")
        }
    )
    const data: BaseResponseBody = res.data
    if (data.error) {
        feedback.value = data.message
        return
    }
    if (data.object) {
        allExercises.value = data.object.exercises as Array<Required<Exercise>>
        fetched.value = true
    }
}

function addPostElement() {
    if (postElements.value.length === 25) {
        return
    }
    postElements.value.push(
        {
            editable: true,
            exercise: new PostExercise(
                filtered.value[0]._id,
                3,
                5,
            )
        }
    )
}

function setEditable(index: number) {
    postElements.value[index].editable = !postElements.value[index].editable
}

function setPostExercise(index: number, pe: PostExercise) {
    postElements.value[index].exercise = pe
}

function removeElement(index: number) {
    postElements.value.splice(index, 1)
}

function scrollToTop() {
    window.scroll({ top: 0 })
}

async function post() {
    const postExercises: Array<PostExercise> = toRaw(postElements.value).map(
        (element: PostElement) => {
            return element.exercise
        }
    )

    if (postExercises.length < 1 || postExercises.length > 25) {
        feedback.value = "A workout can have 1-25 different exercises."
        scrollToTop()
        return
    }

    let hasInvalidData: boolean = false
    const serialized: Array<Array<number | null>> = postExercises.map((postExercise: PostExercise) => {
        const data: Array<number | null> = PostExerciseDTO.serialize(postExercise)
        if (data.includes(null)) {
            hasInvalidData = true
        }
        return data
    })
    if (hasInvalidData) {
            feedback.value = "Exercises must have 1-25 sets and 1-50 reps."
            scrollToTop()
            return
    }

    if (title.value.length < 5 || title.value.length > 30) {
        feedback.value = "Title must be 5-30 symbols long."
        scrollToTop()
        return
    }

    loading.value = true

    const post: Post = new Post(
        title.value,
        serialized as Array<Array<number>>
    )

    const token: string | null = sessionStorage.getItem("token")

    if (!token) {
        window.location.assign(paths.home)
        return
    }

    const res: AxiosResponse = await AppRequest.post(
        postURL,
        post,
        new AxiosHeaders().setAuthorization(token)
    )
    const data: BaseResponseBody = res.data

    loading.value = false

    if (data.error) {
        feedback.value = data.message
        return
    }
    if (data.object) {
        feedback.value = `Post ID: ${data.object.id}`
    }
}
</script>
<template>
    <Loading v-if="!fetched || loading" @vnode-mounted="getExercises"/>
    <h2 v-else-if="!fetched && feedback">{{ feedback }}</h2>
    <div class="CreatePage" v-else>
        <h3 v-if="feedback">{{ feedback }}</h3>
        <h2>Create a workout</h2>
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title">
        <div class="FilterSelection">
            <h4>Filter</h4>
            <label for="nameFilter">Name</label>
            <input type="text" id="nameFilter" v-model="nameFilter">
            <label for="categoryFilter">Category</label>
            <select id="categoryFilter" v-model="categoryFilter">
                <option value="0" selected>all</option>
                <option v-for="(value, key) in ExerciseCategory" :value="value">{{ (key as string).toLowerCase() }}</option>
            </select>
        </div>
        <div class="PostElements">
            <PostElement
            v-for="(element, index) in postElements"
            :exercise="
                allExercises.find((exercise) => {
                    return element.exercise.eID === exercise._id
                })!
            "
            :setPostExercise="setPostExercise"
            :removeElement="removeElement"
            :editable="element.editable"
            :setEditable="setEditable"
            :exerciseList="filtered"
            :index="index"
            />
        </div>
        <div class="Buttons">
            <button @click="addPostElement">Add exercise</button>
            <button class="PostButton" @click="post">Post</button>
            <button class="ToTop" title="Scroll to top" @click="scrollToTop">
                <img src="/up.png" alt="To Top">
            </button>
        </div>
    </div>
</template>
<style scoped>
    div.CreatePage {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    button.PostButton {
        background-color: var(--color_post);
        border-color: var(--color_post);
        cursor: pointer;
    }

    button.ToTop {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 2rem;
        cursor: pointer;
    }

    button.PostButton:hover {
        border-color: var(--color_post_active);
    }

    button.PostButton:active {
        background-color: var(--color_post_active);
    }

    div.Buttons {
        position: fixed;
        bottom: 0;

        display: flex;
        width: 100%;
        justify-content: center;

        padding-top: .5rem;
        padding-bottom: .5rem;
        border-top: 2px solid var(--color_border);
        background-color: white;
    }

    div.Buttons button {
        margin-inline: .5rem;
    }

    div.FilterSelection {
        display: flex;
        flex-direction: column;
        width: fit-content;
        align-items: center;
        padding: .5rem;
        border: 2px solid var(--color_border);
        margin-top: 1rem;
    }

    div.FilterSelection h4 {
        font-size: 1.75rem;
        margin: 0;
    }

    div.FilterSelection label {
        margin-inline: 1rem;
    }

    select {
        background-color: white;
        border: 1px solid #aaa;
        width: 100%;
        font-size: 1rem;
    }

    input[type="number"] {
        width: 3em;
    }

    div.PostElements {
        display: flex;
        flex-direction: column;
        margin-bottom: 5rem;
    }

    div.PostElements select {
        width: max-content;
        height: max-content;
    }

    div.PostElements div.PostElement {
        margin-block: .25rem;
    }
</style>