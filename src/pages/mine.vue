<template>
  <FeedbackProvider>
    Mine

    <button @click="test">Test</button>
  </FeedbackProvider>
</template>

<script setup lang="ts">
import { useFeedback } from '@/components/feedback';
import { onPullDownRefresh } from '@dcloudio/uni-app';
import { onMounted } from 'vue';

onPullDownRefresh(() => {
  console.warn('Mine pull down');

  uni.stopPullDownRefresh();
  uni.showLoading({ title: '加载中', mask: true });
  setTimeout(() => {
    uni.hideLoading();
  }, 2000);
});

const { showToast, showModal } = useFeedback();
function test() {
  showToast({ content: 'mine-toast-1' });
  // showToast({ content: 'mine-toast-2' });
  // setTimeout(() => {
  //   showModal({ title: '提示2', content: 'mine-modal-2' });
  // }, 2000);
  // showModal({ title: '提示1', content: 'mine-modal-1' });
}
onMounted(() => {
  console.log('Mine Mounted');
});
</script>

<style scoped lang="scss"></style>
