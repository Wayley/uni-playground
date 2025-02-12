import { UUID_NORIFY, UUID_SERVICE, UUID_WRITE, write, type BLEResponse } from '.';
import Utils from './Utils';

const writeOptions = { serviceId: UUID_SERVICE, characteristicId_write: UUID_WRITE, characteristicId_notify: UUID_NORIFY };

/**FFAA协议指令校验 和 包长度计算 */
const getPkgLenAndCommandPass = (command: string, hexArr: string[], max?: number) => {
  const [v0, v1, v2, v3] = hexArr;
  const passed = v0 == 'FF' && v1 == 'AA' && v2 == command;

  let pkgLen = parseInt(v3, 16) + 5;
  if (max && pkgLen > max) pkgLen = max; // 蓝牙模块目前最多只返回${max} byte
  return { passed, pkgLen };
};
/**FFAA协议包CRC校验 */
const getPkgCrcPass = (hexArr: string[], max?: number) => {
  const len = hexArr.length;
  let passed = max && len >= max;
  if (!passed) {
    const _crc = generateCheck(hexArr.slice(2, len - 1));
    passed = hexArr[len - 1] == _crc;
  }
  return { passed };
};
/**FFAA协议CRC计算 */
const generateCheck = (hexArr: string[]): string => {
  const sum = hexArr.map((o) => parseInt(o, 16)).reduce((a, c) => a + c, 0) & 0xff;
  return Utils.decimal2hex(sum);
};
/**FFAA协议蓝牙写入通用方法
 *
 * @param deviceId 蓝牙设备ID
 * @param command 指令码(eg: 03-模块服务   80-AT   50-传输OTA文件   51-传输OTA文件结束 ...)
 * @param data 数据位
 * @param max 部分指令的蓝牙响应时超过一定大小时蓝牙模块会丢失(eg: AT^STATUS?), 以该值指定响应包大小可绕过指令和包CRC校验直接返回
 * @returns
 */
export function ffaaWrite(deviceId: string, command: string, data: string[], max?: number): Promise<string[]> {
  const len = Utils.decimal2hex(data.length);
  const check = generateCheck([command, len, ...data]);
  const hexArr = ['FF', 'AA', command, len, ...data, check];
  const value = Utils.hexArr2ab(hexArr);

  return write(
    { ...writeOptions, deviceId, value },
    {
      commandCheck: (hexArr) => getPkgLenAndCommandPass(command, hexArr, max),
      crcCheck: (hexArr) => getPkgCrcPass(hexArr, max),
    }
  );
}
/* ***********************************  *********************************** */
/**FFAA06-查询模组名称
 * eg: FFAA060006 => FFAA060B4A424434383130303030316F(JBD48100001)
 */
export function ffaaGetModuleName(deviceId: string): Promise<BLEResponse<string>> {
  return new Promise(async (resolve, reject) => {
    try {
      const hexArr = await ffaaWrite(deviceId, '06', []);
      resolve({
        response: hexArr.join(''),
        data: Utils.hexArr2str(hexArr.slice(4, -1)),
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**FFAA80-透传AT
 * - eg: 'AT^MAC?', 'AT^WIFISTA?', 'AT^WIFIMODE?', 'AT^WIFISTA_IP?', 'AT^STATUS?', 'AT^MQTTCFG?', 'AT^SERVER?', 'AT^VERSION?'
 */
export function ffaaWriteAT(deviceId: string, atCommand: string): Promise<BLEResponse<string>> {
  return new Promise(async (resolve, reject) => {
    const data = Utils.str2hexArr(atCommand);
    try {
      const hexArr = await ffaaWrite(deviceId, '80', data, 180);
      resolve({
        response: hexArr.join(''),
        data: Utils.hexArr2str(hexArr.slice(4, -1)),
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function test(deviceId: string): Promise<string[]> {
  let arr = ['AT^MAC?', 'AT^WIFISTA?', 'AT^WIFIMODE?', 'AT^WIFISTA_IP?', 'AT^STATUS?', 'AT^MQTTCFG?', 'AT^SERVER?', 'AT^VERSION?', 'AT^WIFISTA=ASDF8F1234,12345678'];
  try {
    const r = await ffaaGetModuleName(deviceId);
    console.log(r.data);
  } catch (error) {
    console.error(error);
  }
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    try {
      const r = await ffaaWriteAT(deviceId, c);
      console.log(r.data);
    } catch (error) {
      console.error(c, error);
    }
  }

  return [];
}
