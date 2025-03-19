<template>
  <FeedbackProvider>
    <button @click="goScan">+</button>
    <button @click="test2">showModal</button>
  </FeedbackProvider>
</template>

<script setup lang="ts">
import { useFeedback } from 'wing-feedback';
const { showToast, showModal, showLoading, FeedbackProvider } = useFeedback();

async function goScan() {
  const confirm = await showModal({ title: '提示', content: '确定前往扫描页面吗?', showCancel: true });
  if (confirm) {
    await showToast({ content: '前往中...' });
    uni.navigateTo({ url: '/pages/discovering' });
    await showToast({ content: '已打开页面' });
  }
}
function test2() {
  console.log('showModal');
  const closeLoading = showLoading({ content: 'dddd' });
  setTimeout(() => {
    closeLoading();
  }, 1500);
  showModal({ title: '提示', content: '这是Modal内容' });
  showModal();
  showToast({ content: 'Home Toast' });
}
</script>

<style scoped lang="scss"></style>
