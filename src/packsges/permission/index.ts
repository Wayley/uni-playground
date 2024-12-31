import WingUniSystem from '@/packsges/system';

export enum WingUniPermissionTypeEnum {
  BLUETOOTH,
}
export class WingUniPermission {
  static requestPermissions(type: WingUniPermissionTypeEnum): Promise<boolean> {
    if (WingUniSystem.isAndroid) {
      if (type == WingUniPermissionTypeEnum.BLUETOOTH) {
        let permissions = ['android.permission.ACCESS_FINE_LOCATION'];
        const Build = plus.android.importClass('android.os.Build');
        // @ts-ignore
        if (Build.VERSION.SDK_INT >= 31) permissions.push('android.permission.BLUETOOTH_SCAN');
        return this.requestAndroidPermissions(permissions);
      }
    }
    return Promise.resolve(true);
  }

  static requestAndroidPermissions(permissions: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const r = plus.android.requestPermissions;
      r(
        permissions,
        ({ deniedAlways, deniedPresent, granted }) => {
          // 权限被永久拒绝
          if (deniedAlways.length > 0) return resolve(false);
          // 权限被临时拒绝 - 再次申请
          else if (deniedPresent.length > 0) r(deniedPresent, ({ granted }) => resolve(granted.length == deniedPresent.length), reject);
          // 权限被允许
          else if (granted.length == permissions.length) return resolve(true);
        },
        reject
      );
    });
  }
}

export default WingUniPermission;
