import { reactive, readonly } from 'vue';

const WING_UNI_BLUETOOTH_FLAGS = {
  ADAPTER_OPENED: false,
  ADAPTER_LISTENERS_REGISTERED: false,
};

export function useBluetoothAdapter<T extends BluetoothDeviceInfo>() {
  const state: BluetoothAdapterState<T> = reactive({
    available: true,
    discovering: false,
    discoveredDevices: [],
  });

  const registerListeners = () => {
    uni.onBluetoothAdapterStateChange(({ discovering, available }) => {
      if (!available || (!state.available && !state.discovering && available && discovering)) discovering = false;

      state.available = available;
      state.discovering = discovering;

      if (!available) {
        // TODO: 更新GATT状态
      }
    });
    uni.onBluetoothDeviceFound(({ devices }) => {
      const _device: unknown = devices[0];
      const device = (enhancerHandler ? enhancerHandler(_device as T) : _device) as T | null;
      if (device) {
        const i = state.discoveredDevices.findIndex((o) => o.deviceId == device.deviceId);
        if (i > -1) state.discoveredDevices[i] = device;
        else state.discoveredDevices.push(device);
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

  let enhancerHandler: EnhancerHandler<BluetoothDeviceInfo> | undefined;
  const startScan = (options?: ScanOptions, enhancer?: EnhancerHandler<T>): Promise<boolean> =>
    new Promise(async (resolve, fail) => {
      enhancerHandler = enhancer;
      try {
        await openAdapter();
      } catch (error) {
        return fail(error);
      }
      if (state.discovering) return resolve(true);
      state.discoveredDevices = [];
      uni.startBluetoothDevicesDiscovery({ ...options, success: (e) => resolve(true), fail });
    });

  const stopScan = (): Promise<boolean> =>
    new Promise(async (resolve, fail) => {
      try {
        await openAdapter();
      } catch (error) {
        return fail(error);
      }
      if (!state.discovering) return resolve(true);
      uni.stopBluetoothDevicesDiscovery({ success: (e) => resolve(true), fail });
    });

  return {
    state: readonly(state),
    openAdapter,
    closeApapter,
    startScan,
    stopScan,
  };
}

interface BluetoothAdapterState<T extends BluetoothDeviceInfo> {
  available: boolean;
  discovering: boolean;
  discoveredDevices: T[];
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
  services?: any[];
  allowDuplicatesKey?: boolean;
  interval?: number;
}

type EnhancerHandler<T extends BluetoothDeviceInfo> = (t: BluetoothDeviceInfo) => T | null;
