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

    <view style="flex: 1; margin-left: 10px">
      <uv-divider :text="`(普通)增强后的扫描设备${s1.discoveredDevices.value.length}`" textSize="12" />
      <view class="cell" v-for="d in s1.discoveredDevices.value">
        <view style="word-break: break-all" v-for="(v, k) in d">{{ k }}: {{ v }}</view>
      </view>
    </view>

    <view style="flex: 1.2; margin-left: 10px">
      <uv-divider :text="`增强后的扫描设备${s2.discoveredDevices.value.length}`" textSize="12" />
      <view class="cell" v-for="d in s2.discoveredDevices.value" @click="createGatt(d.deviceId)">
        <view style="word-break: break-all" v-for="(v, k) in d">{{ k }}: {{ v }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { BLEConnect, discoveredDevices, discovering, startScan, stopScan, useWingUniBluetooth, type WingUniBluetooth } from '@wing-uni/bluetooth';

/**(普通)增强型 */
const s1 = useWingUniBluetooth();

/**增强型 */
interface EnhancedDeviceInfo extends WingUniBluetooth.DeviceInfo {
  advertisHex: string;
  macAddr: string;
  moduleType?: string;
  soc?: string;
  productType?: string;
}
function ab2hexArr(ab: ArrayBuffer): string[] {
  return Array.prototype.map.call(new Uint8Array(ab), (bit: number) => `00${bit.toString(16).toUpperCase()}`.slice(-2)) as string[];
}
function enhancer(v: WingUniBluetooth.DeviceInfo): EnhancedDeviceInfo | null {
  if (!v?.advertisData) return null;
  if (!v?.name?.includes('JBD48100') && !v?.localName?.includes('JBD48100')) return null;
  const hexArr = ab2hexArr(v.advertisData);
  const advertisHex = hexArr.join('');
  const macAddr = hexArr.slice(0, 6).join(':');
  const moduleType = hexArr.slice(6, 8).join('');
  const soc = hexArr.slice(8, 9).join('');
  const productType = hexArr.slice(9, 10).join('');
  return { ...v, advertisHex, macAddr, moduleType, soc, productType };
}
const s2 = useWingUniBluetooth<EnhancedDeviceInfo>(enhancer);

function createGatt(deviceId: string) {
  uni.showLoading({ title: '连接中' });
  BLEConnect({ deviceId })
    .then((e) => {
      uni.showToast({ title: '连接成功' });
      uni.navigateTo({ url: `/pages/device-detail/index?deviceId=${deviceId}` });
    })
    .catch((e) => {
      uni.showToast({ title: '连接失败' });
    })
    .finally(() => {
      uni.hideLoading();
    });
}
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
