<template>
  <FeedbackProvider>
    <button @click="test">Test</button>
  </FeedbackProvider>
</template>

<script setup lang="ts">
import { useFeedback } from '@/components/feedback';

const { showToast, showModal, showLoading } = useFeedback();

function sleep(n = 1000) {
  return new Promise((r) => setTimeout(() => r(true), n));
}

function getData(n = 100): Promise<number> {
  return new Promise(async (resolve, reject) => {
    console.log(n);
    await sleep(100);
    n > 50 ? resolve(n) : reject(`error: page as ${n} is invalid`);
  });
}
async function test() {
  const hideLoading1 = showLoading({ content: '查询中...' });
  try {
    const n = await getData(93);
    const m = await getData(n - 10);
    hideLoading1?.();

    const confirm = await showModal({ title: '提示', content: `确认设置为${m}吗?`, showCancel: true });
    if (confirm) {
      const hideLoading1 = showLoading({ content: '设置中...' });
      try {
        hideLoading1?.();
        const q = await getData(m - 10);
        showToast({ content: '设置成功', type: 'success' });
      } catch (error) {
        showModal({ title: '设置失败', content: error as string });
      }
    }
  } catch (error) {
    console.log('error: ', error);
    hideLoading1?.();
    showModal({ title: '查询失败', content: error as string });
  }
}
</script>

<style scoped lang="scss"></style>
