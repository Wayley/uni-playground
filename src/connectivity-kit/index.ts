import { reactive, readonly, ref, type Ref } from 'vue';

const _available = ref(true);
export const available = readonly(_available);
const _discovering = ref(false);
export const discovering = readonly(_discovering);
const _discoveredDevice: Ref<WingUniBluetooth.BluetoothDeviceInfo | null> = ref(null);
export const discoveredDevice = readonly(_discoveredDevice);
const _discoveredDevices: Ref<WingUniBluetooth.BluetoothDeviceInfo[]> = ref([]);
export const discoveredDevices = readonly(_discoveredDevices);

const _opened = ref(false);
const _listened = ref(false);
const bleCharacteristicValue: WingUniBluetooth.BLECharacteristicValue = reactive({
  deviceId: '',
  serviceId: '',
  characteristicId: '',
  value: new ArrayBuffer(),
});
const bleConnectionState: WingUniBluetooth.BLEConnectionState = reactive({
  deviceId: '',
  connected: false,
});

export function startScan(options?: WingUniBluetooth.ScanOptions): Promise<boolean> {
  return new Promise(async (resolve, fail) => {
    if (_discovering.value) return resolve(true);
    try {
      await openAdapter();
    } catch (error) {
      return fail(error);
    }
    _discoveredDevice.value = null;
    _discoveredDevices.value = [];
    uni.startBluetoothDevicesDiscovery({ ...options, success: (e) => resolve(true), fail });
  });
}

export function stopScan(): Promise<boolean> {
  return new Promise(async (resolve, fail) => {
    if (!_discovering.value) return resolve(true);
    try {
      await openAdapter();
    } catch (error) {
      return fail(error);
    }
    _discovering.value = false;
    uni.stopBluetoothDevicesDiscovery({ success: (e) => resolve(true), fail });
  });
}

function openAdapter(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (_opened.value) return resolve(true);
    const onOpend = () => {
      _opened.value = true;
      addListeners();
    };
    uni.openBluetoothAdapter({
      success: (e) => {
        resolve(true);
        onOpend();
      },
      fail: (e) => {
        if (e?.code == 10001) onOpend();
        reject(e);
      },
    });
  });
}
function closeAdapter(): Promise<boolean> {
  return new Promise((resolve, fail) => {
    if (!_opened.value) return resolve(true);
    uni.closeBluetoothAdapter({
      success: (e) => {
        _opened.value = false;
        resolve(true);
      },
      fail,
    });
  });
}

function addListeners() {
  if (_listened.value) return;
  _listened.value = true;

  uni.onBluetoothAdapterStateChange((e) => {
    if (!e.available || (!_available.value && !_discovering.value && e.available && e.discovering)) e.discovering = false;
    _discovering.value = e.discovering;

    _available.value = e.available;
    if (!e.available) _opened.value = false;
  });

  uni.onBluetoothDeviceFound(({ devices }) => {
    const _device: unknown = devices[0];
    const device = _device as WingUniBluetooth.BluetoothDeviceInfo;
    if (device) {
      _discoveredDevice.value = device;

      const _device = _discoveredDevices.value.find((o) => o.deviceId == device.deviceId);
      if (_device) Object.assign(_device, device);
      else _discoveredDevices.value.push(device);
    }
  });

  uni.onBLEConnectionStateChange(({ deviceId, connected }) => {
    Object.assign(bleConnectionState, { deviceId, connected });
  });

  uni.onBLECharacteristicValueChange(({ value, ...rest }) => {
    const _value: unknown = value;
    Object.assign(bleCharacteristicValue, { ...rest, value: _value as ArrayBuffer });
  });
}

export declare namespace WingUniBluetooth {
  interface BluetoothDeviceInfo {
    deviceId: string;
    RSSI?: number;
    name?: string;
    localName?: string;
    advertisData?: ArrayBuffer;
    advertisServiceUUIDs?: string[];
    serviceData?: string[];
  }
  interface BLEConnectionState {
    deviceId: string;
    connected: boolean;
  }
  interface BLECharacteristicValue {
    deviceId: string;
    serviceId: string;
    characteristicId: string;
    value: ArrayBuffer;
  }
  interface ScanOptions {
    powerLevel?: 'low' | 'medium' | 'high';
    services?: string[];
    allowDuplicatesKey?: boolean;
    interval?: number;
  }
}
