<template>
  <FeedbackProvider>
    <uv-button @click="starScan">开始扫描</uv-button>
  </FeedbackProvider>
</template>

<script setup lang="ts">
import useFeedback from 'wing-feedback';

const { showLoading, showToast, showModal, FeedbackProvider } = useFeedback();
function starScan() {
  const closeLoading = showLoading({ content: '扫描中...' });

  setTimeout(() => {
    closeLoading();
    showToast({ content: '扫描结束,发现30个设备' });
  }, 2000);
}
</script>
