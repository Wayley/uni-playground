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
    return this.ab2hexNumArr(ab).map((o) => o.toString(16).toUpperCase());
  }

  /** (十/0x十六)进制数组转ArrayBuffer
   * - ['0xFF', '0xAA'] 或 [255, 170] 或 [0xFF, 0xAA]
   */
  static hexArr2ab(hexArr: (string | number)[]) {
    const ab = new ArrayBuffer(hexArr.length);
    const dataView = new DataView(ab);
    hexArr.forEach((hex: unknown, i) => dataView.setUint8(i, hex as number));
    return ab;
  }

  /** 异步延迟(ms)
   *
   * - 默认 10 ms
   */
  static sleep(n = 10): Promise<boolean> {
    return new Promise((r) => setTimeout(() => r(true), n));
  }

  /**字符串转0x十六进制数组
   *
   * eg:
   * - AT^MAC? => [0x61,0x74,0x5E,0x6D,0x61,0x63,0x3F]
   * - AT^WIFISTA? => [0x61,0x74,0x5E,0x77,0x69,0x66,0x69,0x73,0x74,0x61,0x3F]
   * - AT^WIFIMODE? => [0x61,0x74,0x5E,0x77,0x69,0x66,0x69,0x6D,0x6F,0x64,0x65,0x3F]
   * - AT^VERSION? => [0x61,0x74,0x5E,0x76,0x65,0x72,0x73,0x69,0x6F,0x6E,0x3F]
   * - AT^SERVER? => [0x61,0x74,0x5E,0x73,0x65,0x72,0x76,0x65,0x72,0x3F]
   * - AT^MQTTCFG? => [0x61,0x74,0x5E,0x6D,0x71,0x74,0x74,0x63,0x66,0x67,0x3F]
   * - AT^STATUS? => [0x61,0x74,0x5E,0x73,0x74,0x61,0x74,0x75,0x73,0x3F]
   * - AT^WIFISTA_IP? => [0x41,0x54,0x5E,0x57,0x49,0x46,0x49,0x53,0x54,0x41,0x5F,0x49,0x50,0x3F]
   */
  static str2hexArr(str: string) {
    let hexArray = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0x0');
      hexArray.push(charCode);
    }
    return hexArray;
  }
}
