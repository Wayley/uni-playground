<template>
  <view class="home home2">
    Home
    <button @click="test">show</button>
  </view>
  <view class="mask" v-if="show"></view>
</template>

<script setup lang="ts">
import { onPullDownRefresh } from '@dcloudio/uni-app';
import { ref } from 'vue';

onPullDownRefresh(() => {
  console.log('home pull down');
  uni.stopPullDownRefresh();
  uni.showLoading({ title: '加载中', mask: true });
  setTimeout(() => {
    uni.hideLoading();
  }, 2000);
});
const show = ref(false);
function test() {
  show.value = true;
  uni.hideTabBar();
  setTimeout(() => {
    show.value = false;
    uni.showTabBar();
  }, 2000);
}
</script>

<style scoped lang="scss">
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--window-bottom, 0);
  bottom: 0;
  z-index: 9999;
  background: #999;
  opacity: 0.5;
}
</style>
