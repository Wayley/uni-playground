<template>
  <view>Available: {{ available }}</view>
  <view>Discovering: {{ discovering }}</view>

  <view style="display: flex">
    <view style="flex: 1">
      <uv-divider :text="`原始扫描数据:${discoveredDevices.length}`" textSize="12" />
      <view class="cell" v-for="d in discoveredDevices">
        <view v-for="(v, k) in d">
          <text style="font-weight: 600">{{ k }} </text> :{{ v }}
        </view>
      </view>
    </view>

    <view style="flex: 1; margin-left: 10px">
      <uv-divider :text="`自定义扫描数据:${enhancedDiscoveredDevices.length}`" textSize="12" />
      <view class="cell" v-for="d in enhancedDiscoveredDevices">
        <view v-for="(v, k) in d" style="word-break: break-all">
          <text style="font-weight: 600">{{ k }} </text> :{{ v }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { available, discoveredDevices, discovering, startScan, stopScan } from '@/connectivity-kit';
import { enhancedDiscoveredDevices, UUID_SERVICE } from '@/hooks/useEnhancedDevices';
import { Utils } from '@/utils';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import { onUnmounted } from 'vue';

onLoad(() => {
  init();
});
onUnmounted(() => {
  console.log('Unmounted');
});
onPullDownRefresh(() => {
  init();
  setTimeout(() => uni.stopPullDownRefresh(), 500);
});
async function init() {
  try {
    uni.showLoading({ title: '扫描中...', mask: true });

    console.log('停止扫描');
    await stopScan();
    console.log('停止扫描 成功');

    console.log('开始扫描');
    await startScan({ services: [UUID_SERVICE] });
    console.log('开始扫描 成功');

    await Utils.sleep(5000);

    console.log('停止扫描');
    await stopScan();
    console.log('停止扫描 成功');

    enhancedDiscoveredDevices.value.sort((a, b) => (b?.RSSI ?? 0) - (a?.RSSI ?? 0));
  } catch (error) {
    console.error(error);
  }
  uni.hideLoading();
}
</script>
<style scoped lang="scss">
.cell {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 12px;
  padding: 5px;
}
</style>
