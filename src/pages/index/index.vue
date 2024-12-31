<template>
  <uv-cell-group>
    <uv-cell v-for="{ title, url } in menus" :title="title" isLink :url="url" />
  </uv-cell-group>
</template>

<script setup lang="ts">
const menus = [
  { title: 'multi-env', url: '/pages/env/index' },
  { title: 'uni-logger', url: '/pages/logger/index' },
  { title: 'uni-bluetooth', url: '/pages/bluetooth/index' },
  { title: 'uni-bluetooth-double', url: '/pages/bluetooth-double/index' },
];
</script>
<style scoped lang="scss"></style>
