export class Utils {
  /**ArrayBuffer转十进制数组
   *
   * - 全部大小的十六进制
   * - eg: [255, 170, 128, 45, 97, 116, 94, 118, 101, 114, 115, 105, 111, 110, 63, 13, 10, 13, 10, 94, 86, 69, 82, 83, 73, 79, 78, 58, 32, 74, 66, 68, 46, 66, 87, 48, 49, 46, 48, 49, 46, 48, 50, 50, 10, 79, 75, 13, 10, 53]
   *
   */
  static ab2hexNumArr(ab: ArrayBuffer): number[] {
    return Array.prototype.map.call(new Uint8Array(ab), (bit: number) => bit) as number[];
  }

  /**ArrayBuffer转十六进制数组
   *
   * @param ab ArrayBuffer
   * @returns 全部大写的十六进制字符串
   * * - eg: ["FF", "AA", "80", "2D", "61", "74", "5E", "76", "65", "72", "73", "69", "6F", "6E", "3F", "0D", "0A", "0D", "0A", "5E", "56", "45", "52", "53", "49", "4F", "4E", "3A", "20", "4A", "42", "44", "2E", "42", "57", "30", "31", "2E", "30", "31", "2E", "30", "32", "32", "0A", "4F", "4B", "0D", "0A", "35"]
   */
  static ab2hexArr(ab: ArrayBuffer): string[] {
    return this.ab2hexNumArr(ab).map((o) => this.decimal2hex(o));
  }

  /** 十六进制数组转ArrayBuffer
   * - ['0xFF', '0xAA'] 或 ['FF', 'AA']
   */
  static hexArr2ab(hexArr: string[]) {
    const ab = new ArrayBuffer(hexArr.length);
    const dataView = new DataView(ab);
    hexArr.forEach((hex, i) => dataView.setUint8(i, parseInt(hex, 16)));
    return ab;
  }

  /** 异步延迟(ms)
   *
   * - 默认 10 ms
   */
  static sleep(n = 10): Promise<boolean> {
    return new Promise((r) => setTimeout(() => r(true), n));
  }

  /**字符串转十六进制数组
   *
   * eg:
   * - AT^MAC? => [61,74,5E,6D,61,63,3F]
   * - AT^WIFISTA? => [61,74,5E,77,69,66,69,73,74,61,3F]
   * - AT^WIFIMODE? => [61,74,5E,77,69,66,69,6D,6F,64,65,3F]
   * - AT^VERSION? => [61,74,5E,76,65,72,73,69,6F,6E,3F]
   * - AT^SERVER? => [61,74,5E,73,65,72,76,65,72,3F]
   * - AT^MQTTCFG? => [61,74,5E,6D,71,74,74,63,66,67,3F]
   * - AT^STATUS? => [61,74,5E,73,74,61,74,75,73,3F]
   * - AT^WIFISTA_IP? => [41,54,5E,57,49,46,49,53,54,41,5F,49,50,3F]
   */
  static str2hexArr(str: string) {
    let hexArray = [];
    for (let i = 0; i < str.length; i++) {
      hexArray.push(this.decimal2hex(str.charCodeAt(i)));
    }
    return hexArray;
  }

  /**十六进制数组转字符串 */
  static hexArr2str(hexArr: string[]) {
    const codes = hexArr.map((o) => parseInt(o, 16));
    return String.fromCharCode(...codes);
  }
  /**十进制数字转十六进制字符串
   * eg:
   * - 255 => FF
   * - 170 => AA
   */
  static decimal2hex(decimal: number) {
    return decimal.toString(16).toUpperCase().padStart(2, '0');
  }
}

export default Utils;
