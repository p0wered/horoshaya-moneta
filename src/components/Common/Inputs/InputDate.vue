<script setup lang="ts">
  import { defineProps, defineEmits, watch, ref } from 'vue';

  const props = defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const localValue = ref(formatDate(props.modelValue));

  watch(
      () => props.modelValue,
      (val) => {
        const formatted = formatDate(val);
        if (formatted !== localValue.value) {
          localValue.value = formatted;
        }
      }
  );

  function formatDate(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 8);
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length >= 3) parts.push(digits.slice(2, 4));
    if (digits.length >= 5) parts.push(digits.slice(4, 8));
    return parts.join('-');
  }

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const formatted = formatDate(target.value);
    localValue.value = formatted;
    emit('update:modelValue', formatted);
  }
</script>

<template>
  <div>
    <input
      type="text"
      :value="localValue"
      maxlength="10"
      placeholder="ДД-ММ-ГГГГ"
      @input="onInput"
      :class="[
      'w-full px-4 py-3 border rounded-md focus:outline-none text-[18] transition',
      props.isError
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-red'
      ]"
    />
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
