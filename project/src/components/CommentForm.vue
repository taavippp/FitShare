<script setup lang="ts">
import { Ref, ref } from 'vue';

const props = defineProps<{
    submitComment: (text: string) => void,
}>();

const commentText: Ref<string> = ref("")

</script>
<template>
    <div class="CommentForm">
        <label for="CommentText">Write a comment</label>
        <textarea
            id="CommentText"
            cols="30"
            rows="3"
            v-model="commentText"
            maxlength="128"
            :class="commentText.length >= 128 ? 'Red': ''"
            spellcheck="false"
        ></textarea>
        <button @click="props.submitComment(commentText)">Submit</button>
    </div>
</template>
<style>
.Red {
    color: red;
}
</style>