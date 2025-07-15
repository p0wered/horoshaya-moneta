<script setup lang="ts">
  interface Props {
    type?: 'small' | 'normal';
    loading?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    type: 'normal',
    loading: false,
  });
</script>

<template>
  <button
      class="
      bg-gradient-to-b
      from-red
      to-red-light
      text-white
      font-bold
      text-md
      px-12
      cursor-pointer
    "
      :class="{
      'hover:bg-gradient-to-t': !loading,
      'cursor-wait': loading,
      'is-loading': loading,
      'py-2': type === 'small',
      'py-5': type === 'normal',
      'px-6': type === 'small',
      'px-12': type === 'normal',
      'text-sm': type === 'small',
      'text-md': type === 'normal',
    }"
      :disabled="loading"
  >
    <slot />
  </button>
</template>

<style scoped>
  .is-loading {
    animation: loading 3s ease infinite;
  }
  @keyframes loading {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.8;
    }
  }
</style>