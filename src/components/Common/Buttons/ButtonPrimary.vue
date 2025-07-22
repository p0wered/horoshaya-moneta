<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";

  interface Props {
    isLoading?: boolean;
    label?: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  function handleClick() {
    if (!props.isLoading) {
      emit('click');
    }
  }
</script>

<template>
  <button
      :class="[
        'p-4 w-full text-white rounded-lg transition font-bold',
        props.isLoading
          ? 'bg-red/50 hover:bg-red/50 cursor-default'
          : 'bg-red hover:bg-red-dark cursor-pointer'
      ]"
      @click="handleClick"
      :disabled="props.isLoading"
  >
    <template v-if="props.isLoading">
      <LoadingSpinner/>
    </template>
    <template v-else>
      {{ label }}
    </template>
  </button>
</template>