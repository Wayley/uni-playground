import { onMounted, onUnmounted, readonly, type Ref, ref, watch, type WatchStopHandle } from 'vue';

export declare namespace WingUniBluetooth {
  interface ScanOptions {
    services?: string[];
    allowDuplicatesKey?: boolean;
    interval?: number;
    powerLevel?: 'low' | 'medium' | 'high';
  }
  interface DeviceInfo {
    deviceId: string;
    RSSI?: number;
    name?: string;
    localName?: string;
    advertisData?: ArrayBuffer;
    advertisServiceUUIDs?: string[];
    serviceData?: string[];
  }
}

const _discoveredDevice: Ref<WingUniBluetooth.DeviceInfo | null> = ref(null);
const _discoveredDevices: Ref<WingUniBluetooth.DeviceInfo[]> = ref([]);
export const discoveredDevices = readonly(_discoveredDevices);

const _discovering = ref(false);
export const discovering = readonly(_discovering);
export function startScan(options: WingUniBluetooth.ScanOptions): Promise<boolean> {
  return new Promise(async (resolve, fail) => {
    if (_discovering.value) return resolve(true);
    try {
      await openAdapter();
    } catch (error) {
      return fail(error);
    }

    _discoveredDevice.value = null;
    _discoveredDevices.value = [];
    uni.startBluetoothDevicesDiscovery({
      ...options,
      success: (e) => {
        _discovering.value = true;
        resolve(true);
      },
      fail,
    });
  });
}

const _opened = ref(false);
function openAdapter(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (_opened.value) return resolve(true);
    const onOpened = () => {
      _opened.value = true;
      addListeners();
    };
    uni.openBluetoothAdapter({
      success: (e) => {
        onOpened();
        resolve(true);
      },
      fail: (e) => {
        if (e?.code == 10001) onOpened();
        reject(e);
      },
    });
  });
}

const _listened = ref(false);
const _available = ref(true);
export const available = readonly(_available);
const _bleConnectionState = ref({ deviceId: '', connected: false });
const _bleCharacteristicValue = ref({ deviceId: '', serviceId: '', characteristicId: '', value: new ArrayBuffer() });

function addListeners() {
  if (!_listened.value) {
    _listened.value = true;
    uni.onBluetoothDeviceFound(({ devices }) => {
      const v: unknown = devices[0];
      const device = v as WingUniBluetooth.DeviceInfo;
      if (device) _discoveredDevice.value = { ...device };
      if (device) {
        const _device = _discoveredDevices.value.find((o) => o.deviceId == device.deviceId);
        if (_device) Object.assign(_device, device);
        else _discoveredDevices.value.push(device);
      }
    });
    uni.onBluetoothAdapterStateChange(({ discovering, available }) => {
      _available.value = available;

      if (!available || (!_available.value && !_discovering.value && available && discovering)) discovering = false;
      _discovering.value = discovering;
    });
    uni.onBLEConnectionStateChange((bleConnectionState) => {
      _bleConnectionState.value = bleConnectionState;
    });
    uni.onBLECharacteristicValueChange(({ value, ...rest }) => {
      const _value: unknown = value;
      _bleCharacteristicValue.value = { ...rest, value: _value as ArrayBuffer };
    });
  }
}

export function stopScan(): Promise<boolean> {
  return new Promise(async (resolve, fail) => {
    if (!_discovering.value) return resolve(true);
    try {
      await openAdapter();
    } catch (error) {
      return fail(error);
    }

    uni.stopBluetoothDevicesDiscovery({
      success: (e) => {
        _discovering.value = false;
        resolve(true);
      },
      fail,
    });
  });
}
export function useWingUniBluetooth<T extends WingUniBluetooth.DeviceInfo>(enhancer?: (v: WingUniBluetooth.DeviceInfo) => T | null) {
  const discoveredDevices: Ref<T[]> = ref([]);
  let stop: WatchStopHandle;

  onMounted(() => {
    console.warn('onMounted');
    stop = watch(_discoveredDevice, (v) => {
      if (v) {
        const device = enhancer ? enhancer(v) : v;
        if (device) {
          const _device = discoveredDevices.value.find((o) => o.deviceId == device.deviceId);
          if (_device) Object.assign(_device, device);
          else discoveredDevices.value.push(device as T);
        }
      } else {
        discoveredDevices.value = [];
      }
    });
  });
  onUnmounted(() => {
    console.warn('onUnmounted');
    stop();
  });
  return {
    discoveredDevices: readonly(discoveredDevices),
  };
}
