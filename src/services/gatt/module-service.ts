import { Utils } from '@/utils';
import { UUID_NORIFY, UUID_SERVICE, UUID_WRITE, write } from '.';

const writeOptions = { serviceId: UUID_SERVICE, characteristicId_write: UUID_WRITE, characteristicId_notify: UUID_NORIFY };
const getPakLen = (hex: string) => parseInt(`0x${hex}`, 16) + 5;
const generateCheck = (command: string[]): string => {
  const sum = command.map((o) => parseInt(o, 16)).reduce((a, c) => a + c, 0) & 0xff;
  return `0x${`00${sum.toString(16).toUpperCase()}`.slice(-2)}`;
};

export function writeAT(deviceId: string, atCommand: string): Promise<string[]> {
  const data = Utils.str2hexArr(atCommand);
  const len = data.length.toString(16).toUpperCase().padStart(4, '0x0');
  const check = generateCheck(['0x80', len, ...data]);
  const hexArr = ['0xff', '0xaa', '0x80', len, ...data, check];
  const value = Utils.hexArr2ab(hexArr);
  return write(
    { ...writeOptions, deviceId, value },
    {
      commandCheck([v0, v1, v2, v3]) {
        return { passed: v0 == 'FF' && v1 == 'AA' && v2 == '80', pkgLen: getPakLen(v3) };
      },
      crcCheck(hexArr) {
        return { passed: hexArr.length > 0 };
      },
    }
  );
}

export async function getModuleVersion2(deviceId: string): Promise<string[]> {
  const arr = ['AT^MAC?', 'AT^WIFISTA?', 'AT^WIFIMODE?', 'AT^WIFISTA_IP?', 'AT^STATUS?', 'AT^MATTCFG?', 'AT^SERVER?', 'AT^VERSION?'];

  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    try {
      const hexArr: unknown = (await writeAT(deviceId, c)).map((o) => `0x${o}`).slice(4, -1);
      const r = String.fromCharCode(...(hexArr as number[]));
      console.log(r);
    } catch (error) {
      console.error(c, error);
    }
  }

  return [];
}
