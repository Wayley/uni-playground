<template>
  <view>ENV: {{ env }}</view>
</template>

<script setup lang="ts">
const env = import.meta.env.VITE_ENV_VARIABLE;
</script>
<style scoped lang="scss"></style>
