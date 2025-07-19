<script setup lang="ts">
import {defineProps, defineEmits, ref, watch} from 'vue';

  const props = defineProps<{
    modelValue: string;
    divisionCode?: boolean;
    placeholder?: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const localValue = ref(formatValue(props.modelValue));

  watch(
    () => props.modelValue,
    (newVal) => {
      const formatted = formatValue(newVal);
      if (formatted !== localValue.value) {
        localValue.value = formatted;
      }
    }
  );

  function formatValue(raw: string): string {
    return props.divisionCode
        ? formatDivision(raw)
        : formatPassport(raw);
  }

  function formatPassport(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 10);
    if (digits.length > 4) {
      return digits.slice(0, 4) + ' ' + digits.slice(4);
    }
    return digits;
  }

  function formatDivision(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 6);
    if (digits.length > 3) {
      return digits.slice(0, 3) + '-' + digits.slice(3);
    }
    return digits;
  }

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const formatted = formatValue(input.value);
    localValue.value = formatted;
    emit('update:modelValue', formatted);
  }
</script>

<template>
  <input
    type="text"
    :value="localValue"
    :maxlength="props.divisionCode ? 7 : 11"
    :placeholder="props.divisionCode ? '123-456' : '5413 123456'"
    @input="onInput"
    :class="[
    'w-full px-4 py-3 border rounded-md focus:outline-none text-[18]',
    props.isError
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-red'
    ]"
  />
  <p v-if="props.isError && props.errorMessage" class="mt-1 text-sm text-red-500">
    {{ props.errorMessage }}
  </p>
</template>
