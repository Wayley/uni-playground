<template>
  <FeedbackProvider>
    <button @click="test1">showToast</button>
    <button @click="test2">showModal</button>
  </FeedbackProvider>
</template>

<script setup lang="ts">
import { useFeedback } from '../libs/wing-feedback';
const { showToast, showModal, FeedbackProvider } = useFeedback();
function test1() {
  console.log('showToast');
  showToast({ content: 'Toast1', duration: 1000 });
  showToast({ content: 'Toast2' });
  showModal({ title: '提示', content: '内容啊1' });
}
function test2() {
  console.log('showModal');
  showModal({ title: '提示', content: '内容2啊' });
  showToast({ content: 'Toast233' });
}
</script>

<style scoped lang="scss"></style>
