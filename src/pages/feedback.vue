<template>
  <view class="mask" @click="close">
    <view class="wrapper">
      <view class="content" @click.stop> {{ title }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { FEEDBACK_EVENT_NAME_CLOSED, FEEDBACK_EVENT_NAME_TX, type FeedBackEventOptions } from '@/common/feedback';
import { onLoad } from '@dcloudio/uni-app';
import { getCurrentInstance, ref, type Ref } from 'vue';
const title = ref('');

const eventChannel: Ref<UniNamespace.EventChannel | null> = ref(null);

onLoad((o: unknown) => {
  // @ts-ignore
  eventChannel.value = getCurrentInstance()?.proxy!.getOpenerEventChannel();

  eventChannel.value?.once(FEEDBACK_EVENT_NAME_TX, (data: FeedBackEventOptions) => {
    title.value = data.title ?? '';
  });
});

function close() {
  uni.navigateBack({
    success: (e) => {
      eventChannel.value?.emit(FEEDBACK_EVENT_NAME_CLOSED, {
        data: 'feedback closed',
      });
    },
  });
}
</script>
<style>
page {
  background: transparent;
}
</style>
<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
}

.wrapper {
  position: absolute;
  bottom: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  .content {
    display: flex;
    align-items: center;
    word-wrap: break-word;
    word-break: break-all;
    padding: 4px 10px;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    max-width: 65%;
    min-width: 160rpx;
    min-height: 40px;
    background: #f4f7f8;
    border-radius: 6px;
    opacity: 0.9;
  }
}
</style>
