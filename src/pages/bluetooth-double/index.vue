<template>
  <uv-button>Available: {{ available }}</uv-button>
  <uv-button>Discovering: {{ discovering }}</uv-button>
  <uv-button>----------------------</uv-button>

  <view class="cell" v-for="d in discoveredDevices">
    <view v-for="(v, k) in d">
      <text style="font-weight: 600">{{ k }} </text>
      :{{ v }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { useBluetoothAdapter, type BluetoothDeviceInfo } from '@/hooks/useBluetoothAdaper';
import { onLoad } from '@dcloudio/uni-app';
import { onUnmounted, watch } from 'vue';
const { available, discovering, discoveredDevices, startScan, stopScan } = useBluetoothAdapter<EnhancedBluetoothDeviceInfo>(enhance);

function ab2hexArr(ab: ArrayBuffer): string[] {
  return Array.prototype.map.call(new Uint8Array(ab), (bit: number) => `00${bit.toString(16)}`.toUpperCase().slice(-2)) as string[];
}
function enhance(info: BluetoothDeviceInfo): EnhancedBluetoothDeviceInfo | null {
  const { advertisData } = info;
  if (advertisData) {
    const hexArr = ab2hexArr(advertisData);
    const macAddr = hexArr.slice(0, 6).join(':');
    const moduleType = hexArr.slice(6, 8).join('');
    const soc = hexArr.slice(8, 9).join('');
    const productType = hexArr.slice(9, 10).join('');

    return { ...info, macAddr, moduleType, soc, productType, hex: hexArr.join('') };
  }
  return null;
}
interface EnhancedBluetoothDeviceInfo extends BluetoothDeviceInfo {
  hex: string;
  macAddr: string;
  moduleType?: string;
  soc?: string;
  productType?: string;
}
onLoad(() => {
  startScan({ services: ['0000FF00-0000-1000-8000-00805F9B34FB'] })
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
  () => discoveredDevices.value.length,
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
