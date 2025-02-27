<template>
  <view>Mine</view>
</template>

<script setup lang="ts">
import { onPullDownRefresh } from '@dcloudio/uni-app';

onPullDownRefresh(() => {
  console.warn('Mine pull down');

  uni.stopPullDownRefresh();
  uni.showLoading({ title: '加载中', mask: true });
  setTimeout(() => {
    uni.hideLoading();
  }, 2000);
});
</script>

<style scoped lang="scss"></style>
