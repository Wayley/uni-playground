export class Utils {
  static ab2hexArr(ab: ArrayBuffer): string[] {
    return Array.prototype.map.call(new Uint8Array(ab), (bit: number) => `00${bit.toString(16).toUpperCase()}`.slice(-2)) as string[];
  }

  /** 异步延迟(ms)
   *
   * - 默认 10 ms
   */
  static sleep(n = 10): Promise<boolean> {
    return new Promise((r) => setTimeout(() => r(true), n));
  }
}
