<template>
  <view>DeviceId: {{ deviceId }}</view>
  <uv-button @click="write">Write</uv-button>
  <uv-button @click="BLEDisConnect(deviceId)">DisConnect</uv-button>

  <view>RES: {{ res }}</view>

  <view v-for="client in gattClients">{{ client.deviceId }}--{{ client.connected }}</view>
</template>

<script setup lang="ts">
import { test } from '@/services/gatt/module-service';
import { onLoad } from '@dcloudio/uni-app';
import { BLEDisConnect, gattClients } from '@wing-uni/bluetooth';
import { ref } from 'vue';

const deviceId = ref('');
const res = ref('');

onLoad((query) => {
  deviceId.value = query?.deviceId;
});

function write() {
  uni.showLoading({ title: '读取中' });

  test(deviceId.value)
    .then((e) => {
      uni.showToast({ title: '读取成功' });
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
