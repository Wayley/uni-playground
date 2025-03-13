<template>
  <view>
    <Toast v-if="feedback && feedback?.feedbackType == 1" v-bind="feedback" />
    <Modal v-if="feedback && feedback?.feedbackType == 2" v-bind="feedback" @confirm="closeFeedback(true)" @cancel="closeFeedback(false)" />
    <Loading v-if="feedback && feedback?.feedbackType == 3" v-bind="feedback" />
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useFeedback } from '.';
import Loading from '../Loading.vue';
import Modal from '../Modal.vue';
import Toast from '../Toast.vue';
const { feedback, closeFeedback } = useFeedback();
</script>
