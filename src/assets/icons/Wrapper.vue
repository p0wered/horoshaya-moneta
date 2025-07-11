<script setup lang="ts">
  const DEFAULT_SIZE = 18;

  interface Props {
    iconName?: string;
    width?: number | string;
    height?: number | string;
  }

  withDefaults(defineProps<Props>(), {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
  });
</script>

<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      viewBox="2 2 20 20"
      :aria-labelledby="iconName"
      role="presentation"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g>
      <slot />
    </g>
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: -2px;
}
</style>
