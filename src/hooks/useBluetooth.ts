import { type ComputedRef, type Ref } from 'vue';
import type { GattClientDevice } from './useGattClientDevice';

export interface UseBluetoothReturn {
  inited: Readonly<Ref<boolean>>;
  available: Readonly<Ref<boolean>>;
  discovering: Readonly<Ref<boolean>>;
  discoverdDevices: Readonly<Ref<Readonly<Readonly<BluetoothDeviceInfo>[]>>>;
  connectedDevices: Readonly<ComputedRef<Readonly<Readonly<BluetoothDeviceInfo>[]>>>;
  gattClientDevices?: Readonly<Ref<GattClientDevice[]>>;

  openAdapter(): Promise<boolean>;
  closeApapter(): Promise<boolean>;
  startScan(options?: StartScanOptions): Promise<boolean>;
  stopScan(): Promise<boolean>;
  getDevices(): Promise<Readonly<Readonly<BluetoothDeviceInfo>[]>>;
  createGattClientDevice(info: Readonly<BluetoothDeviceInfo>): Readonly<GattClientDevice>;
}

interface BluetoothDeviceInfo {
  deviceId: string;
  RSSI?: number;
  name?: string;
  localName?: string;
  advertisData?: ArrayBuffer;
  advertisServiceUUIDs?: string[];
  serviceData?: string[];
}

interface StartScanOptions {
  services?: string[];
  allowDuplicatesKey?: boolean;
  interval?: number;
}
