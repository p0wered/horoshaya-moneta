<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
    maxLength?: number;
  }>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();
</script>

<template>
  <div>
    <input
        id="phone-input"
        type="text"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :maxlength="props.maxLength"
        class="
        w-full
        px-4 py-3
        border border-gray-300
        rounded-md
        focus:outline-none
        focus:ring-1
        focus:ring-red
        text-[18]
      "
    />
  </div>
</template>