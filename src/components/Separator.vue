<script setup lang="ts">
type SeparatorSize = 'small' | 'default';

interface Props {
  size?: SeparatorSize;
}

withDefaults(defineProps<Props>(), {
  size: 'default',
});
</script>

<template>
  <div
      :class="{
      'bg-separator-wave-sm': size === 'small',
      'h-[7px]': size === 'small',
      'bg-separator-wave': size === 'default',
      'h-[12px]': size === 'default',
    }"
  ></div>
</template>
