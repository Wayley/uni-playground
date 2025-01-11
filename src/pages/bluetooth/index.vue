<template>
  <uv-button @click="test">Test</uv-button>
  <view style="margin-top: 20px"></view>
  <uv-button @click="connect(deviceId)" v-for="{ deviceId } in arr">{{ deviceId }}</uv-button>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
const UUID_SERVICE = '0000FF00-0000-1000-8000-00805F9B34FB';
const UUID_READ = '0000FF01-0000-1000-8000-00805F9B34FB';
const UUID_WRITE = '0000FF02-0000-1000-8000-00805F9B34FB';
const arr: Ref<UniNamespace.BluetoothDeviceInfo[]> = ref([]);

function getAB(hexArr: number[]) {
  const buffer = new ArrayBuffer(hexArr.length);
  const dataView = new DataView(buffer);
  hexArr.forEach((hex, i) => dataView.setUint8(i, hex));
  return buffer;
}

async function test() {
  try {
    await uni.openBluetoothAdapter();
    uni.startBluetoothDevicesDiscovery({ services: [UUID_SERVICE] });
    uni.onBluetoothDeviceFound(({ devices }) => {
      const [device] = devices;
      if (device.deviceId.includes('-F8541304733D')) arr.value.push(device);
    });
  } catch (error) {
    console.error(error);
  }
}
function sleep(n = 1500) {
  return new Promise((r) => setTimeout(() => r(true), n));
}
async function connect(deviceId: string) {
  try {
    // writeType?: "write" | "writeNoResponse";
    await uni.stopBluetoothDevicesDiscovery();
    await uni.createBLEConnection({ deviceId });
    await sleep();
    await uni.notifyBLECharacteristicValueChange({
      deviceId,
      characteristicId: UUID_READ,
      serviceId: UUID_SERVICE,
      state: true,
    });
    await sleep();
    const value: unknown = getAB([0xff, 0xaa, 0x25, 0x00, 0x25]);
    await uni.writeBLECharacteristicValue({
      deviceId,
      characteristicId: UUID_WRITE,
      serviceId: UUID_SERVICE,
      writeType: 'write',
      value: value as any[],
    });
  } catch (error) {
    console.error(error);
  }
}
</script>
<style scoped lang="scss"></style>
