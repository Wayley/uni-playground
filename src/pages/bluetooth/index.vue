<template>
  <uv-button>Available: {{ state.available }}</uv-button>
  <uv-button>Discovering: {{ state.discovering }}</uv-button>
  <uv-button>----------------------</uv-button>

  <view class="cell" v-for="d in state.discoveredDevices">
    <view v-for="(v, k) in d">
      <text style="font-weight: 600">{{ k }} </text>
      :{{ v }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { useBluetoothAdapter } from '@/hooks/useBluetoothAdaper';
import { onLoad } from '@dcloudio/uni-app';
import { onUnmounted, watch } from 'vue';
const { state, startScan, stopScan } = useBluetoothAdapter();

onLoad(() => {
  startScan()
    .then((e) => console.log('开始扫描'))
    .catch((e) => console.error(e));
});
onUnmounted(() => {
  console.log('Unmounted');
  stopScan()
    .then((e) => console.log('停止扫描'))
    .catch((e) => console.error(e));
});

watch(
  () => state.discoveredDevices.length,
  (v, _v) => {
    console.log(`${_v} ==> ${v}`);
  }
);
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
