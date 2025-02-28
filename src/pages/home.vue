<template>
  <view>
    <view style="height: 200px; border: 1px solid red">12333333</view>
    <button @click="go">Go</button>
  </view>
</template>

<script setup lang="ts">
import { feedback } from '@/common/feedback';

async function go() {
  // uni.showToast({ icon: 'none' });
  // setTimeout(() => {
  //   feedback.showToast({ title: 'timeout' });
  // }, 2000);
  feedback.showToast({ title: '11111' });
  feedback.showToast();
  feedback.showToast({ title: '55555' });
  feedback.showToast({ title: '0' });
}
</script>

<style scoped lang="scss"></style>
