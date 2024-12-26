<template>
  <view>
    <view>{{ UniLogger.globalLevel }}</view>
    <button>Set Global Level</button>
    <button>Set Instance Level</button>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import UniLogger, { Level } from '@wing-uni/logger';

const logger = new UniLogger('AA:C2:37:00:1B:10');

onLoad(() => {
  test();
});
function test() {
  const n = new Date().getTime();
  logger.fatal('--', n, 'Fatal', { name: 'fatal' }); // √
  UniLogger.globalLevel = Level.Debug;
  // logger.setLevel(Level.Warn);
  logger.error(n, 'Error', { name: 'error' }); // √
  logger.warn(n, 'Warn', { name: 'warn' }); // √
  logger.info(n, 'Info', { name: 'info' }); // √
  logger.debug(n, 'Debug', { name: 'debug' }); // √
  logger.trace(n, 'Trace', { name: 'trace' }); // √
}
</script>
<style scoped lang="scss"></style>
