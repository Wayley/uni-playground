import { readonly, ref } from 'vue';

export function useAppVersion() {
  const info = uni.getAppBaseInfo();
  const appVersion = ref(info.appVersion);

  // #ifdef APP-PLUS
  // @ts-ignore
  appVersion.value = info.appWgtVersion;
  // #endif

  return {
    appVersion: readonly(appVersion),
  };
}
