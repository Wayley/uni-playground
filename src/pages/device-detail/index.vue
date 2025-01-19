<template>
  <view>DeviceId: {{ deviceId }}</view>
  <uv-button @click="write">Write</uv-button>

  <view>RES: {{ res }}</view>
</template>

<script setup lang="ts">
import { getModuleVersion2 } from '@/services/gatt/module-service';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const deviceId = ref('');
const res = ref('');

onLoad((query) => {
  deviceId.value = query?.deviceId;
});

function write() {
  uni.showLoading({ title: '读取中' });

  getModuleVersion2(deviceId.value)
    .then((e) => {
      uni.showToast({ title: '读取成功' });
      const arr: unknown = e.map((o) => `0x${o}`).slice(4, -1);
      if (e.length > 0) res.value = String.fromCharCode(...(arr as number[]));

      console.log(res.value);
    })
    .catch((e) => {
      console.error(e);
      uni.showToast({ title: '读取失败' });
    })
    .finally(() => {
      uni.hideLoading();
    });
}
</script>
<style scoped lang="scss"></style>
