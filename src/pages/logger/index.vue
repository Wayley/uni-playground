<template>
  <uv-cell-group>
    <uv-cell title="Global Level" :value="globalLevelLabel" isLink @click="openLevelPicker(LevelTarget.Global)" />
    <uv-cell title="Instance Level" :value="instanceLevelLabel" isLink @click="openLevelPicker(LevelTarget.Instance)" />
  </uv-cell-group>
  <uv-picker ref="pickRef" keyName="label" :columns="[levels]" @confirm="confirm" />
</template>

<script setup lang="ts">
import UvPicker from '@climblee/uv-ui/components/uv-picker/uv-picker.vue';
import UniLogger, { Level } from '@wing-uni/logger';
import { computed, ref, type Ref } from 'vue';

const logger = new UniLogger('LOGGER_TEST_CATEGORY');

const globalLevel = ref(UniLogger.globalLevel);
const globalLevelLabel = computed(() => levels.find((o) => o.value == globalLevel.value)?.label);
const instanceLevel = ref(logger.level);
const instanceLevelLabel = computed(() => levels.find((o) => o.value == instanceLevel.value)?.label);

const pickRef = ref<InstanceType<typeof UvPicker> | null>(null);
const levels = [
  { label: 'Off', value: Level.Off },
  { label: 'Fatal', value: Level.Fatal },
  { label: 'Error', value: Level.Error },
  { label: 'Warn', value: Level.Warn },
  { label: 'Info', value: Level.Info },
  { label: 'Debug', value: Level.Debug },
  { label: 'Trace', value: Level.Trace },
  { label: 'All', value: Level.All },
];

const enum LevelTarget {
  Global,
  Instance,
}
const levelTarget: Ref<LevelTarget | null> = ref(null);
function openLevelPicker(target: LevelTarget) {
  levelTarget.value = target;
  let i;
  if (target == LevelTarget.Global) {
    i = levels.findIndex((o) => o.value == globalLevel.value);
  } else if (target == LevelTarget.Instance) {
    i = levels.findIndex((o) => o.value == instanceLevel.value);
  }
  if (i != undefined && i > -1) pickRef.value.setIndexs([i], true);
  pickRef.value.open();
}
function confirm(e: any) {
  const level = e.value[0].value as Level;
  const target = levelTarget.value;
  if (target == LevelTarget.Global) {
    UniLogger.globalLevel = level;
    globalLevel.value = level;
  } else if (target == LevelTarget.Instance) {
    logger.setLevel(level);
    instanceLevel.value = level;
  }
  log();
}

function log() {
  const n = new Date().getTime();
  logger.fatal(n, 'Fatal', { name: 'fatal' });
  logger.error(n, 'Error', { name: 'error' });
  logger.warn(n, 'Warn', { name: 'warn' });
  logger.info(n, 'Info', { name: 'info' });
  logger.debug(n, 'Debug', { name: 'debug' });
  logger.trace(n, 'Trace', { name: 'trace' });
}
</script>
<style scoped lang="scss"></style>
