<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    percentage: number;
    primaryColor?: string;
    secondaryColor?: string;
    strokeWidth?: number;
    size?: number;
  }>();

  const primaryColor = props.primaryColor || '#00c950'; // green-500
  const secondaryColor = props.secondaryColor || '#2b7fff'; // blue-500
  const strokeWidth = props.strokeWidth || 10;
  const size = props.size || 100;

  const radius = computed(() => (size / 2) - (strokeWidth / 2));
  const circumference = computed(() => 2 * Math.PI * radius.value);

  const strokeDashoffset = computed(() => {
    const dash = circumference.value;
    return dash - (props.percentage / 100) * dash;
  });
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="secondaryColor"
        :stroke-width="strokeWidth"
        fill="none"
    />

    <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="primaryColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        transform="rotate(-90 50 50)" />
  </svg>
</template>

<style scoped>
  circle:last-child {
    transition: stroke-dashoffset 0.5s ease-in-out;
  }
</style>