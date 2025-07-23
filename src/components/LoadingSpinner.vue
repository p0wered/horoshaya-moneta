<script setup lang="ts">
  interface Props {
    size?: string;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24px',
    color: '#FFFFFF',
  });
</script>

<template>
  <div class="w-full flex justify-center">
    <div
      class="simple-spinner block border-3 border-transparent rounded-full"
      :style="{
        width: props.size,
        height: props.size,
        borderTopColor: props.color,
        borderRightColor: props.color,
        borderBottomColor: props.color,
      }"
    />
  </div>

</template>

<style scoped>
  .simple-spinner {
    box-sizing: border-box;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>