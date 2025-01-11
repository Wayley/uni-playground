import { type Ref } from 'vue';

export interface GattClientDevice {
  deviceId: Readonly<string>;
  connected: Readonly<Ref<boolean>>;
  notifyMap: Map<string, boolean>;
  connect(options?: { timeout?: number }): Promise<boolean>;
  disconnect(): Promise<boolean>;
  notify(options: GattClientDeviceNotifyOptions): Promise<boolean>;
  read(options: GattClientDeviceReadOptions): Promise<boolean>;
  write(options: GattClientDeviceWriteOptions, options2?: GattClientDeviceNotifyOptions): Promise<boolean>;
  setMTU(options: { mtu: number }): Promise<boolean>;
  getServices(): Promise<{ uuid: string; isPrimary: boolean }[]>;
  getCharacteristics(options: { serviceId: string }): Promise<GattClientDeviceCharacteristic[]>;
  disconnect(): Promise<boolean>;
}
interface GattClientDeviceNotifyOptions {
  serviceId: string;
  characteristicId: string;
  state: boolean;
}

interface GattClientDeviceReadOptions {
  serviceId: string;
  characteristicId: string;
}

interface GattClientDeviceWriteOptions {
  serviceId: string;
  characteristicId: string;
  value: ArrayBuffer;
}

interface GattClientDeviceCharacteristic {
  uuid: string;
  properties: GattClientDeviceProperty;
}
interface GattClientDeviceProperty {
  read: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
}
