import { onMounted, onUnmounted, readonly, type Ref, ref, watch, type WatchStopHandle } from 'vue';
import { runWithLimitedTimeout, runWithLimitedTimes } from 'wing-async-retry';

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

  interface NotifyOptions {
    deviceId: string;
    serviceId: string;
    characteristicId: string;
    state: boolean;
  }

  interface WriteOptions {
    deviceId: string;
    serviceId: string;
    characteristicId: string;
    value: ArrayBuffer;
  }

  interface GattClient {
    deviceId: string;
    connected: boolean;
    notifyMap: Map<string, boolean>;
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
export const bleConnectionState = readonly(_bleConnectionState);

const _bleCharacteristicValue: Ref<{
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  value?: ArrayBuffer;
}> = ref({ deviceId: '', serviceId: '', characteristicId: '', value: undefined });
export const bleCharacteristicValue = readonly(_bleCharacteristicValue);

const _gattClients: Ref<WingUniBluetooth.GattClient[]> = ref([]);
export const gattClients = readonly(_gattClients);

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
      if (!available) {
        _opened.value = false;
        _gattClients.value.forEach((o) => {
          o.connected = false;
          o.notifyMap.clear();
        });
      }
    });
    uni.onBLEConnectionStateChange((bleConnectionState) => {
      _bleConnectionState.value = bleConnectionState;
      const client = _gattClients.value.find((o) => o.deviceId == bleConnectionState.deviceId);
      if (client) client.connected = bleConnectionState.connected;
    });
    uni.onBLECharacteristicValueChange(({ value, ...rest }) => {
      const _value: unknown = value;
      const ab = _value as ArrayBuffer;
      if (ab.byteLength > 0) {
        _bleCharacteristicValue.value = { ...rest, value: ab };
      }
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
    stop();
  });
  return {
    discoveredDevices: readonly(discoveredDevices),
  };
}

export function BLEConnect(options: { deviceId: string; timeout?: number }): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      await openAdapter();
    } catch (error) {
      return reject(error);
    }

    const client = _gattClients.value.find((o) => o.deviceId == options.deviceId);
    if (client && client.connected) return resolve(true);
    uni.createBLEConnection({
      ...options,
      success: (e) => {
        resolve(true);
        if (client) client.connected = true;
        else _gattClients.value.push({ deviceId: options.deviceId, connected: true, notifyMap: new Map() });
      },
      fail: (e) => {
        if (e?.code == -1) return resolve(true);
        reject(e);
      },
    });
  });
}

export function BLENotify(options: WingUniBluetooth.NotifyOptions): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      await openAdapter();
      await runWithLimitedTimeout(() => notify(options), { retryDelay: 100, retryTimeout: 5000 });
      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}
function notify(options: WingUniBluetooth.NotifyOptions): Promise<boolean> {
  return new Promise((resolve, fail) => {
    const client = _gattClients.value.find((o) => o.deviceId == options.deviceId);
    const key = `${options.serviceId}_${options.characteristicId}`;
    if (client && client.notifyMap.get(key)) return resolve(true);

    uni.notifyBLECharacteristicValueChange({
      ...options,
      success: (e) => {
        resolve(true);

        if (client) {
          client.notifyMap.set(key, true);
        } else {
          const notifyMap = new Map();
          notifyMap.set(key, true);
          _gattClients.value.push({ deviceId: options.deviceId, connected: true, notifyMap });
        }
      },
      fail,
    });
  });
}

export function BLEWrite(options: WingUniBluetooth.WriteOptions, max = 20, notifyOptions?: WingUniBluetooth.NotifyOptions): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      await BLEConnect({ deviceId: options.deviceId });
      if (notifyOptions) await BLENotify(notifyOptions);
      await runWithLimitedTimes(() => writeLong(options, max), { retryDelay: 5, retryTimes: 5 });
      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}
function writeLong({ value, ...rest }: WingUniBluetooth.WriteOptions, max = 20): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const n = Math.ceil(value.byteLength / max);
    for (let i = 0; i < n; i++) {
      const _value = value.slice(i * max, (i + 1) * max);
      try {
        await writeRetry({ ...rest, value: _value });
      } catch (error) {
        return reject(error);
      }
    }
    return resolve(true);
  });
}
function writeRetry(options: WingUniBluetooth.WriteOptions): Promise<boolean> {
  return runWithLimitedTimes(() => write(options), { retryDelay: 5, retryTimes: 100 });
}
function write({ value, ...rest }: WingUniBluetooth.WriteOptions): Promise<boolean> {
  return new Promise((resolve, fail) => {
    const _value: unknown = value;
    uni.writeBLECharacteristicValue({ ...rest, value: _value as any[], success: (e) => resolve(true), fail });
  });
}
