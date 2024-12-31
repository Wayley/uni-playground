<template>
  <uv-button @click="init">init</uv-button>
  <uv-button @click="scan">scan</uv-button>
</template>

<script setup lang="ts">
function init() {
  console.log('INIT');
}

function scan() {}
</script>
<style scoped lang="scss"></style>
