<script setup lang="ts">
import { AxiosResponse } from 'axios';
import { ref, Ref } from 'vue';
import AppRequest from '../../classes/AppRequest';
import { BaseResponseBody } from '../../classes/BaseResponse';
import router from '../router';

const postURL: string = "/api/post"
const route = router.currentRoute.value.query

</script>
<template>
</template>
<style scoped>
</style>