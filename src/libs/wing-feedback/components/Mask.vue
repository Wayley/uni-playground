<template>
  <div class="mask" :style="{ backgroundColor }" @touchmove.stop.prevent="() => {}">
    <slot />
  </div>
</template>
<script setup lang="ts">
export type MaskProps = {
  /**遮罩层背景颜色, 默认: rgba(0, 0, 0, 0.35) */
  backgroundColor?: string;
};
const { backgroundColor } = defineProps<MaskProps>();
</script>
<style scoped>
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
