<template>
  <view class="splash">
    <view class="logo" />
    <view>V{{ appVersion }}</view>
  </view>
</template>
<script setup lang="ts">
import { useAppVersion } from '@/stores/useAppVersion';
import { onLoad } from '@dcloudio/uni-app';
const { appVersion } = useAppVersion();

onLoad(() => {
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/index/index' });
  }, 1500);
});
</script>
<style scoped lang="scss">
.splash {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  width: 72px;
  height: 72px;
  background: url('/static/images/logo.png') no-repeat 100% 100%;
  margin-top: 100px;
  margin-bottom: 10px;
}
</style>
