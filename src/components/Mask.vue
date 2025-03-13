<template>
  <view class="mask" :style="{ backgroundColor }" @touchmove.stop.prevent="() => {}">
    <slot />
  </view>
</template>
<script setup lang="ts">
const { backgroundColor } = defineProps<{
  backgroundColor?: string;
}>();
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.35);
}
</style>
