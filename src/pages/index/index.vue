<template>
  <uv-cell-group>
    <uv-cell v-for="{ title, url } in menus" :title="title" isLink :url="url" />
  </uv-cell-group>
</template>

<script setup lang="ts">
const menus = [
  { title: 'multi-env', url: '/pages/env/index' },
  { title: 'uni-logger', url: '/pages/logger/index' },
];
</script>
<style scoped lang="scss"></style>
