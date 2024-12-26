<template>
  <view class="content">
    <text class="title">{{ title }}</text>
    <view>ENV: {{ env }}</view>
    <LoggerPage />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoggerPage from './logger.vue';
const env = import.meta.env.VITE_ENV_VARIABLE;

const title = ref('Hello');
</script>
<style scoped lang="scss">
.content {
  color: red;
  .title {
    font-size: 26px;
    color: green;
  }
}
</style>
