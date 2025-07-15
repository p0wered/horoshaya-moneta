<script setup lang="ts">
  import { defineProps, defineEmits, watch, ref } from 'vue';

  const props = defineProps<{ modelValue: string }>();
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
  <input
    type="text"
    :value="localValue"
    maxlength="10"
    placeholder="ДД-ММ-ГГГГ"
    @input="onInput"
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
</template>
