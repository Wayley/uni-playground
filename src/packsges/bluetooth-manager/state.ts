import { createPinia, defineStore } from 'pinia';
import { TAG } from '.';

const pinia = createPinia();

export const useAdapterAvailableStateStore = () => defineStore(`${TAG}-ADAPTER-AVAILABLE-STATE`, { state: (): { available: boolean } => ({ available: false }) })(pinia);

export const useAdapterInitedStateStore = () => defineStore(`${TAG}-ADAPTER-INITED-STATE`, { state: (): { inited: boolean } => ({ inited: false }) })(pinia);

export const useAdapterDiscoveringStateStore = () => defineStore(`${TAG}-ADAPTER-DISCOVERING-STATE`, { state: (): { readonly discovering: boolean } => ({ discovering: false }) })(pinia);

export const useDiscoveredDevicesStore = () => defineStore(`${TAG}-DISCOVERED-DEVICES`, { state: (): { devices: Array<UniNamespace.BluetoothDeviceInfo> } => ({ devices: [] }) })(pinia);

export const useBLEConnectionStateStore = () => defineStore(`${TAG}-BLE-CONNECTION-STATE`, { state: (): UniNamespace.OnBLEConnectionStateChangeSuccess => ({ deviceId: '', connected: false }) })(pinia);

export const useBLECharacteristicValueStore = () => defineStore(`${TAG}-BLE-CHARACTERISTIC-VALUE`, { state: (): UniNamespace.OnBLECharacteristicValueChangeSuccess => ({ deviceId: '', serviceId: '', characteristicId: '', value: [] }) })(pinia);
