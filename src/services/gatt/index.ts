import { bleCharacteristicValue, BLEWrite } from '@/connectivity-kit';
import { Utils } from '@/utils';
import { watch } from 'vue';

export const UUID_SERVICE = '0000FF00-0000-1000-8000-00805F9B34FB';
export const UUID_NORIFY = '0000FF01-0000-1000-8000-00805F9B34FB';
export const UUID_WRITE = '0000FF02-0000-1000-8000-00805F9B34FB';

interface WriteOptions {
  deviceId: string;
  serviceId: string;
  characteristicId_write: string;
  value: ArrayBuffer;
  characteristicId_notify: string;
  max?: number;
}

interface Checker {
  commandCheck(hexArr: string[]): { passed: boolean; pkgLen: number };
  crcCheck(hexArr: string[]): { passed: boolean };
}
/**写入特征值并监听特征值变化回复
 *
 */
export function write(options: WriteOptions, checker: Checker): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const { deviceId, serviceId, characteristicId_write, value, max, characteristicId_notify } = options;
    const writeOptions = { deviceId, serviceId, characteristicId: characteristicId_write, value };
    const notifyOptions = characteristicId_notify ? { deviceId, serviceId, characteristicId: characteristicId_notify, state: true } : undefined;

    let pkg: string[] = [];
    let len: number | null = null;
    let responsed = false;
    let timer: number;
    const stop = watch(bleCharacteristicValue, (v) => {
      if (v.deviceId == deviceId && v.serviceId == serviceId && v.characteristicId == characteristicId_notify) {
        const hexArr = Utils.ab2hexArr(v.value);
        if (len == null) {
          const { passed, pkgLen } = checker.commandCheck(hexArr);
          if (passed) len = pkgLen;
        }
        if (len) {
          pkg = pkg.concat(hexArr);
          if (pkg.length == len) {
            const { passed } = checker.crcCheck(pkg);
            if (passed) {
              responsed = true;
              resolve(pkg);
              clearTimeout(timer);
              stop();
            }
          } else if (pkg.length > len) {
            len = null;
            pkg = [];
          }
        } else {
          len = null;
          pkg = [];
        }
      }
    });

    try {
      await BLEWrite(writeOptions, max, notifyOptions);
      timer = setTimeout(() => {
        if (!responsed) {
          reject('timeout');
          stop();
        }
      }, 3000);
    } catch (error) {
      reject(error);
      stop();
    }
  });
}
