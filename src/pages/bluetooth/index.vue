<template>
  <uv-button @click="init">init</uv-button>
</template>

<script setup lang="ts">
import { BluetoothManager, type BluetoothManagerError } from '@/packsges/bluetooth-manager';
import { useDiscoveredDevicesStore } from '@/packsges/bluetooth-manager/state';
import WingUniSystem from '@/packsges/system';

const bluetoothManager = BluetoothManager.getInstance();

async function init() {
  console.log('INIT');
  try {
    const r = await bluetoothManager.openAdapter();
    console.log(r);
  } catch (error) {
    console.error(error);
    const { code } = error as BluetoothManagerError;
    if (/*iOS未授权蓝牙权限*/ WingUniSystem.isIOS && code == 10000) {
      await showAuthRequestModal();
    }
    if (/*蓝牙适配器不可用*/ code == 10001) {
      const { confirm, cancel } = await uni.showModal({ title: '蓝牙适配器不可用', content: '是否打开蓝牙适配器开关?' });
      if (/*打开系统蓝牙设置*/ confirm) bluetoothManager.openBluetoothSystemSetting();
      if (cancel) uni.navigateBack();
    }
    return;
  }
  // 蓝牙权限检测
  try {
    const authorized = await bluetoothManager.requestBluetoothPermissions();
    if (authorized) startScan();
    else await showAuthRequestModal();
  } catch (e) {
    console.error(e);
    return;
  }
}

/** 引导用户开启蓝牙权限 */
async function showAuthRequestModal() {
  const { confirm, cancel } = await uni.showModal({ title: '申请蓝牙位置权限权限', content: '是否进行授权?' });
  if (confirm) uni.openAppAuthorizeSetting();
  if (cancel) uni.navigateBack();
}

/**发现设备 */
const discoveredDevices = useDiscoveredDevicesStore();
discoveredDevices.$subscribe((_, { devices }) => {
  console.log(devices.length);
});
async function startScan() {
  try {
    const r = await bluetoothManager.startScan();
    console.log(r);
  } catch (error) {
    console.error(error);
  }
}
</script>
<style scoped lang="scss"></style>
