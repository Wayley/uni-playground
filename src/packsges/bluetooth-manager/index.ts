import WingUniPermission, { WingUniPermissionTypeEnum } from '@wing-uni/permission';
import WingUniSystem, { WingUniSystemURLEnum } from '@wing-uni/system';
import { useAdapterAvailableStateStore, useAdapterDiscoveringStateStore, useBLECharacteristicValueStore, useBLEConnectionStateStore, useDiscoveredDevicesStore } from './state';

export const TAG = 'WING-UNI-BLUETOOTH';

type OmittedOmitedAsyncOptions = 'success' | 'fail' | 'complete';

export class BluetoothManager {
  static #instance: BluetoothManager | null = null;

  constructor() {
    this.#addListeners();
  }

  static getInstance(): BluetoothManager {
    if (this.#instance == null) this.#instance = new BluetoothManager();
    return this.#instance;
  }
  openBluetoothSystemSetting() {
    return WingUniSystem.openSystemSetting(WingUniSystemURLEnum.BLUETOOTH);
  }
  requestBluetoothPermissions() {
    // const ActivityCompat = plus.android.importClass('androidx.core.app.ActivityCompat');
    // const ContextCompat = plus.android.importClass('androidx.core.content.ContextCompat');
    // const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
    // const mainActivity = plus.android.runtimeMainActivity();
    // ['android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_SCAN', 'android.permission.ACCESS_FINE_LOCATION'].forEach((p) => {
    //   const e = ActivityCompat.shouldShowRequestPermissionRationale(mainActivity, p);
    //   const d = ContextCompat.checkSelfPermission(mainActivity, p);
    //   if (d == PackageManager.PERMISSION_DENIED) {
    //     console.log(`HHHHHHHHHHHHHHH ${d}`);
    //   }
    //   console.log(`${p} = ${e}  ${d}`);
    // });
    return WingUniPermission.requestPermissions(WingUniPermissionTypeEnum.BLUETOOTH);
  }
  openAdapter() {
    return uni.openBluetoothAdapter();
  }
  closeAdapter() {
    return uni.closeBluetoothAdapter();
  }
  getAdapterState() {
    return uni.getBluetoothAdapterState();
  }
  startScan(options?: Omit<UniNamespace.StartBluetoothDevicesDiscoveryOptions, OmittedOmitedAsyncOptions>) {
    useDiscoveredDevicesStore().$patch({ devices: [] });
    return uni.startBluetoothDevicesDiscovery(options);
  }
  stopScan() {
    return uni.stopBluetoothDevicesDiscovery();
  }
  /**获取处于已连接状态的设备 */
  getConnectedDevices(options: Omit<UniNamespace.GetConnectedBluetoothDevicesOptions, OmittedOmitedAsyncOptions>) {
    return uni.getConnectedBluetoothDevices(options);
  }
  /**获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备 */
  getDevices() {
    return uni.getBluetoothDevices();
  }
  #addListeners() {
    console.log(`${TAG} 添加全局监听`);
    uni.onBluetoothAdapterStateChange(({ available, discovering }) => {
      const adapterAvailableState = useAdapterAvailableStateStore();
      if (adapterAvailableState.available != available) adapterAvailableState.$patch({ available });

      const adapterDiscoveringState = useAdapterDiscoveringStateStore();
      if (adapterDiscoveringState.discovering != available) adapterDiscoveringState.$patch({ discovering });
    });

    uni.onBluetoothDeviceFound(({ devices }) => {
      const discoveredDevices = useDiscoveredDevicesStore();
      const [device] = devices;
      if (device) {
        const i = discoveredDevices.devices.findIndex((o) => o.deviceId == device.deviceId);
        discoveredDevices.$patch((state) => {
          if (i > -1) state.devices[i] = device;
          else state.devices.push(device);
        });
      }
    });

    uni.onBLEConnectionStateChange(({ deviceId, connected }) => {
      const BLEConnectionState = useBLEConnectionStateStore();
      if (BLEConnectionState.deviceId == deviceId && BLEConnectionState.connected == connected) return;
      BLEConnectionState.$patch({ deviceId, connected });
    });

    uni.onBLECharacteristicValueChange((v) => {
      useBLECharacteristicValueStore().$patch(v);
    });
  }
}

export type BluetoothManagerError = {
  code: number;
  errMsg: string;
};
function test() {
  const m = BluetoothManager.getInstance();
  m.openAdapter();
}
