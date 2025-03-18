<template>
  <view>
    <Toast v-if="feedback && feedback?.feedbackType == 1" v-bind="feedback" />
    <Modal v-if="feedback && feedback?.feedbackType == 2" v-bind="feedback" @confirm="closeFeedback(true)" @cancel="closeFeedback(false)" />
    <Loading v-if="feedback && feedback?.feedbackType == 3" v-bind="feedback" />
    <slot />
  </view>
</template>
<script lang="ts">
export const feedback: Ref<FeedbackOptions | null> = ref(null);
</script>
<script setup lang="ts">
import { type Ref, ref } from 'vue';
import useFeedback from '../index';
import Loading, { type LoadingProps } from './Loading.vue';
import Modal, { type ModalProps } from './Modal.vue';
import Toast, { type ToastProps } from './Toast.vue';

export type FeedbackOptions = ToastProps &
  ModalProps &
  LoadingProps & {
    /**
     * - 1: Toast
     *
     * - 2: Modal
     *
     * - 3: Loading
     */
    feedbackType: 1 | 2 | 3;
  };
const { closeFeedback } = useFeedback();
</script>

<style module>
.red {
  color: red;
}
</style>

<style scoped>
.green {
  color: green;
}
</style>
