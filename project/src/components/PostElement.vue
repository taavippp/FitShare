<script setup lang="ts">
import { Ref, ref } from 'vue';
import Exercise from '../../classes/model/Exercise';
import PostExercise from '../../classes/model/PostExercise';

const props = defineProps<{
    editable: boolean;
    exercise: Required<Exercise>;
    exerciseList: Array<Exercise>;
    index: number;
    setPostExercise: (index: number, pe: PostExercise) => void;
    setEditable: (index: number) => void;
    removeElement: (index: number) => void;
}>()

const postExercise: Ref<PostExercise> = ref(new PostExercise(
    props.exercise._id,
    3,
    5,
))

function onChange(event: Event) {
    const target = event.target as HTMLInputElement
    const value: number = parseInt(target.value)
    switch (target.name) {
        case "exercise":
            postExercise.value.eID = value
            break;
        case "sets":
            postExercise.value.sets = value
            break;
        case "reps":
            postExercise.value.reps = value
            break;
    }
    console.log(postExercise.value)
    props.setPostExercise(props.index, postExercise.value)
}

</script>
<template>
    <div class="PostExerciseComponent">
        <p>{{ index + 1 }}.</p>
        <div class="Exercise">
            <p v-if="!editable">
                {{ exercise.name }}
            </p>
            <select v-else name="exercise" @change="onChange">
                <option v-for="(exercise) in exerciseList" :value="exercise._id" :selected="postExercise.eID === exercise._id">
                    {{ exercise.name }}
                </option>
            </select>
            <div class="Buttons">
                <button @click="setEditable(index)">
                    <img src="/edit.png" alt="Edit exercise"/>
                </button>
                <button @click="removeElement(index)">
                    <img src="/delete.png" alt="Remove exercise"/>
                </button>
            </div>
        </div>
        <label :for="`sets-${index}`">Sets</label>
        <input type="number"
        name="sets"
        :id="`sets-${index}`"
        @change="onChange"
        :value="postExercise.sets"
        min="1"
        max="25"
        />
        <label :for="`reps-${index}`">Reps</label>
        <input type="number"
        name="reps"
        :id="`reps-${index}`"
        @change="onChange"
        :value="postExercise.reps"
        min="1"
        max="50"
        />
    </div>
</template>
<style scoped>
    div.PostExerciseComponent {
        display: flex;
        flex-direction: column;
        border: 2px solid var(--color_border);

        margin: 0.5rem;
        padding: 0.5rem;
    }

    div.Exercise {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: .5rem;
    }

    p {
        margin: 0;
        font-family: var(--font);
        font-size: 1rem;
        text-align: center;
    }

    button {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        margin: .25rem;
    }

    img {
        width: max-content;
    }

    select {
        font-family: var(--font);
        font-size: 1rem;
        background-color: white;
        border: 2px solid gray;
    }
</style>