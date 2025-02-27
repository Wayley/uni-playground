<template>
  <view class="splash">
    <view class="logo" />
    <view>V{{ appVersion }}</view>
  </view>
</template>
<script setup lang="ts">
import { useAppVersion } from '@/hooks/useAppVersion';
import { onLoad } from '@dcloudio/uni-app';
const { appVersion } = useAppVersion();

onLoad(() => {
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/home' });
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
  background-image: url('/static/images/logo.png');
  margin-top: 100px;
  margin-bottom: 10px;
}
</style>
