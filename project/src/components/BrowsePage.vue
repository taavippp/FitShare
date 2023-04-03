<script setup lang="ts">
import { Post } from '../../classes/model/Post';
import router, { paths } from '../router';

const props = defineProps<{
    posts: Array<Omit<Post, "userID" | "content">>;
}>();

const page: number = parseInt(router.currentRoute.value.params.page as string)
</script>
<template>
    <div>
        <h2>Posts, page {{ page }}</h2>
        <table>
            <thead>
                <th>Title</th>
                <th>Date posted</th>
            </thead>
            <tbody>
                <tr v-for="(post) in props.posts">
                    <td>
                        <RouterLink :to="`${paths.browse}/${post.id}`">
                            {{ post.title }}
                        </RouterLink>
                    </td>
                    <td class="Date">{{ new Date(post.timestamp!).toLocaleString() }}</td>
                </tr>
            </tbody>
        </table>
        <div class="PageButtons">
            <RouterLink
            v-if="page > 1"
            :to="`${paths.browse}/page/${page - 1}`"
            >
                <button>
                    Page {{ page - 1 }}
                </button>
            </RouterLink>
            <RouterLink
            v-if="props.posts.length === 10"
            :to="`${paths.browse}/page/${page + 1}`"
            >
                <button>
                    Page {{ page + 1 }}
                </button>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>
div {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

table {
    border: 2px solid var(--color_border);
}

td, th {
    border: 1px solid black;
    padding-inline: .5rem;
    font-size: 1.25rem;
}

td.Date {
    text-align: end;
}

div.PageButtons {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    width: max-content;
}

button {
    margin-inline: 1rem;
}
</style>