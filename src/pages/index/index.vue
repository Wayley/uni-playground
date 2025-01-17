<template>
  <uv-cell-group>
    <uv-cell v-for="{ title, url } in menus" :title="title" isLink :url="url" />
  </uv-cell-group>
  <uv-divider text="历史连接" textSize="12" />
  <view class="cell" v-for="d in enhancedHistoricalDevices">
    <view><text style="font-weight: 600">DeviceId</text> : {{ d.deviceId }}</view>
    <view><text style="font-weight: 600">Connected</text> : {{ d.connected }}</view>
  </view>
</template>

<script setup lang="ts">
import { enhancedHistoricalDevices } from '@/hooks/useEnhancedDevices';

const menus = [
  { title: 'multi-env', url: '/pages/env/index' },
  { title: 'uni-logger', url: '/pages/logger/index' },
  { title: 'uni-bluetooth', url: '/pages/bluetooth/index' },
  { title: 'uni-bluetooth-double', url: '/pages/bluetooth-double/index' },
];
</script>
<style scoped lang="scss">
.cell {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 12px;
  padding: 5px;
}
</style>
