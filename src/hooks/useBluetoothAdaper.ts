import { readonly, ref, type Ref } from 'vue';

const WING_UNI_BLUETOOTH_FLAGS = {
  ADAPTER_OPENED: false,
  ADAPTER_LISTENERS_REGISTERED: false,
};

export function useBluetoothAdapter<T extends BluetoothDeviceInfo>(enhancer?: (v: BluetoothDeviceInfo) => T | null) {
  const available = ref(true);
  const discovering = ref(false);
  const discoveredDevices: Ref<T[]> = ref([]);

  const registerListeners = () => {
    uni.onBluetoothAdapterStateChange((e) => {
      if (!e.available || (!available.value && !discovering.value && e.available && e.discovering)) e.discovering = false;

      available.value = e.available;
      discovering.value = e.discovering;

      if (!e.available) {
        // TODO: 更新GATT状态
      }
    });
    uni.onBluetoothDeviceFound(({ devices }) => {
      const _device: unknown = devices[0];
      const device = (enhancer ? enhancer(_device as T) : _device) as T | null;
      if (device) {
        const i = discoveredDevices.value.findIndex((o) => o.deviceId == device.deviceId);
        if (i > -1) discoveredDevices.value[i] = device;
        else discoveredDevices.value.push(device);
      }
    });

    uni.onBLEConnectionStateChange(({ deviceId, connected }) => {
      // TODO:更新GATT状态
    });
    uni.onBLECharacteristicValueChange(({ deviceId, ...rest }) => {
      // TODO:更新GATT状态
    });
  };

  if (!WING_UNI_BLUETOOTH_FLAGS.ADAPTER_LISTENERS_REGISTERED) registerListeners();

  const openAdapter = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (WING_UNI_BLUETOOTH_FLAGS.ADAPTER_OPENED) return resolve(true);
      uni.openBluetoothAdapter({
        success: (e) => {
          WING_UNI_BLUETOOTH_FLAGS.ADAPTER_OPENED = true;
          resolve(true);
        },
        fail: (e) => {
          if (e?.code == 10001) WING_UNI_BLUETOOTH_FLAGS.ADAPTER_OPENED = true;
          reject(e);
        },
      });
    });

  const closeApapter = (): Promise<boolean> =>
    new Promise((resolve, fail) => {
      if (!WING_UNI_BLUETOOTH_FLAGS.ADAPTER_OPENED) return resolve(true);
      uni.closeBluetoothAdapter({
        success: (e) => {
          WING_UNI_BLUETOOTH_FLAGS.ADAPTER_OPENED = false;
          resolve(true);
        },
        fail,
      });
    });

  const startScan = (options?: ScanOptions): Promise<boolean> =>
    new Promise(async (resolve, fail) => {
      try {
        await openAdapter();
      } catch (error) {
        return fail(error);
      }
      if (discovering.value) return resolve(true);
      discoveredDevices.value = [];
      uni.startBluetoothDevicesDiscovery({ ...options, success: (e) => resolve(true), fail });
    });

  const stopScan = (): Promise<boolean> =>
    new Promise(async (resolve, fail) => {
      try {
        await openAdapter();
      } catch (error) {
        return fail(error);
      }
      if (!discovering.value) return resolve(true);
      uni.stopBluetoothDevicesDiscovery({ success: (e) => resolve(true), fail });
    });

  return {
    available: readonly(available),
    discovering: readonly(discovering),
    discoveredDevices: readonly(discoveredDevices),
    openAdapter,
    closeApapter,
    startScan,
    stopScan,
  };
}

export interface BluetoothDeviceInfo {
  deviceId: string;
  RSSI?: number;
  name?: string;
  localName?: string;
  advertisData?: ArrayBuffer;
  advertisServiceUUIDs?: string[];
  serviceData?: string[];
}
interface ScanOptions {
  powerLevel?: 'low' | 'medium' | 'high';
  services?: string[];
  allowDuplicatesKey?: boolean;
  interval?: number;
}
