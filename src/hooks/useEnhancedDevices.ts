import { discoveredDevice, type WingUniBluetooth } from '@/connectivity-kit';
import { Utils } from '@/utils';
import { readonly, type Ref, ref, watch } from 'vue';

export const enhancedDiscoveredDevices: Ref<EnhancedDeviceInfo[]> = ref([]);

watch(discoveredDevice, (v) => {
  if (v) {
    const device = enhance(v as WingUniBluetooth.BluetoothDeviceInfo);
    if (device) {
      const _device = enhancedDiscoveredDevices.value.find((o) => o.deviceId == device.deviceId);
      if (_device) Object.assign(_device, device);
      else enhancedDiscoveredDevices.value.push(device);
    }
  } else {
    enhancedDiscoveredDevices.value = [];
  }
});
interface EnhancedDeviceInfo extends WingUniBluetooth.BluetoothDeviceInfo {
  advertisHex: string;
  macAddr: string;
  moduleType?: string;
  soc?: string;
  productType?: string;
}

function enhance(v: WingUniBluetooth.BluetoothDeviceInfo): EnhancedDeviceInfo | null {
  if (!v.advertisData) return null;
  const hexArr = Utils.ab2hexArr(v.advertisData);
  const macAddr = hexArr.slice(0, 6).join('');
  const moduleType = hexArr.slice(6, 8).join('');
  const soc = hexArr.slice(8, 9).join('');
  const productType = hexArr.slice(9, 10).join('');
  const advertisHex = hexArr.join('');
  return { ...v, macAddr, moduleType, soc, productType, advertisHex };
}

export const UUID_SERVICE = '0000FF00-0000-1000-8000-00805F9B34FB';
export const UUID_READ = '0000FF01-0000-1000-8000-00805F9B34FB';
export const UUID_WRITE = '0000FF02-0000-1000-8000-00805F9B34FB';

interface HistoricalDeviceInfo extends EnhancedDeviceInfo {
  connected: boolean;
}
const STORED_HISTORICAL_DEVICES_KEY = 'STORED_HISTORICAL_DEVICES_KEY';
const _enhancedHistoricalDevices: Ref<HistoricalDeviceInfo[]> = ref(uni.getStorageSync<HistoricalDeviceInfo[]>(STORED_HISTORICAL_DEVICES_KEY) || []);
export const enhancedHistoricalDevices = readonly(_enhancedHistoricalDevices);

export function updateHistoricalDevice(v: HistoricalDeviceInfo) {
  const device = _enhancedHistoricalDevices.value.find((o) => o.deviceId == v.deviceId);
  if (device) Object.assign(device, v);
  else _enhancedHistoricalDevices.value.push(v);
  uni.setStorageSync(STORED_HISTORICAL_DEVICES_KEY, _enhancedHistoricalDevices.value);
}
