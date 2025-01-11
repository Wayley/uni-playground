<template>
  <view>DeviceId: {{ deviceId }}</view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const deviceId = ref('');
onLoad((query) => {
  deviceId.value = query?.id;
});
</script>
<style scoped lang="scss"></style>
