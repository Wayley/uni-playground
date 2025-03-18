<template>
  <Mask class="flex">
    <div class="toast">
      <template v-if="type">
        <icon :type="type == 'error' ? 'cancel' : type" :size="22" />
      </template>
      <div>{{ content }}</div>
    </div>
  </Mask>
</template>

<script setup lang="ts">
import Mask from './Mask.vue';

export type ToastProps = {
  /**提示内容 */
  content?: string;

  /**提示自动关闭延迟时间, 单位: ms, 默认值: 1500 */
  duration?: number;

  /**提示图标类型: 默认: 不显示 */
  type?: 'success' | 'info' | 'warn' | 'error';
};

defineProps<ToastProps>();
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.toast {
  max-width: 65%;
  border-radius: 6px;
  background: #f4f7f8;
  text-align: center;
  padding: 4px;
  font-size: 12px;
}
</style>
