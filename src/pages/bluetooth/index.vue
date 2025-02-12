<template>
  <uv-button @click="startScan({ services: ['0000FF00-0000-1000-8000-00805F9B34FB'] })" v-if="!discovering">startScan</uv-button>
  <uv-button @click="stopScan">stopScan</uv-button>
  <view style="display: flex">
    <view style="flex: 1">
      <uv-divider :text="`原始的扫描设备${discoveredDevices.length}`" textSize="12" />
      <view class="cell" v-for="d in discoveredDevices">
        <view style="word-break: break-all" v-for="(v, k) in d">{{ k }}: {{ v }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { discoveredDevices, discovering, startScan, stopScan } from '@wing-uni/bluetooth';
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
