<template>
  <Mask class="flex">
    <div class="modal">
      <div class="title">
        <template v-if="!$slots.title">{{ title }}</template>
        <slot name="title" />
      </div>
      <div class="content">
        <template v-if="!$slots.content">{{ content }}</template>
        <slot name="content" />
      </div>
      <div class="btns">
        <div class="btn" v-if="showCancel" @click="emits('cancel')">取消</div>
        <div class="btn" :class="$style['actice-text']" @click="emits('confirm')">确认</div>
      </div>
    </div>
  </Mask>
</template>

<script setup lang="ts">
import Mask from './Mask.vue';

export type ModalProps = {
  /**提示标题, 默认值: `提示` */
  title?: string;

  /**提示内容 */
  content?: string;

  /**是否展示`取消`按钮, 默认值: false */
  showCancel?: boolean;
};

defineProps<ModalProps>();
const emits = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  width: 85%;
  border-radius: 6px;
  color: #606266;
}
.title {
  font-weight: 600;
  text-align: center;
  padding-top: 20px;
}
.content {
  padding: 20px 10px;
}
.btns {
  display: flex;
  border-top: 1px solid #d6d7d9;
}
.btn {
  flex: 1;
  text-align: center;
  padding: 15px 0;
}
.btn + .btn {
  border-left: 1px solid #d6d7d9;
}
</style>
<style module>
.actice-text {
  color: #2979ff;
}
</style>
