<script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    modelValue: number | null;
    placeholder?: string;
    min?: number;
    max?: number;
    maxLength?: number;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void;
  }>();

  const inputValue = ref<string>('');

  watch(() => props.modelValue, (newValue) => {
    if (newValue !== null && newValue !== undefined && !isNaN(newValue)) {
      inputValue.value = String(newValue);
    } else {
      inputValue.value = '';
    }
  }, { immediate: true });

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    value = value.replace(/\D/g, '');

    inputValue.value = value;
    target.value = value;

    let numericValue: number | null = null;
    if (value !== '') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        numericValue = parsed;
        if (props.min !== undefined && numericValue < props.min) {
          numericValue = props.min;
        }
        if (props.max !== undefined && numericValue > props.max) {
          numericValue = props.max;
        }
      }
    }

    emit('update:modelValue', numericValue);
  }

  function onBlur() {
    let valueToEmit: number | null = null;
    if (inputValue.value !== '') {
      const parsed = parseInt(inputValue.value, 10);
      if (!isNaN(parsed)) {
        valueToEmit = parsed;
        if (props.min !== undefined && valueToEmit < props.min) {
          valueToEmit = props.min;
        }
        if (props.max !== undefined && valueToEmit > props.max) {
          valueToEmit = props.max;
        }
      }
    }

    if (valueToEmit !== null && String(valueToEmit) !== inputValue.value) {
      inputValue.value = String(valueToEmit);
    } else if (valueToEmit === null && inputValue.value !== '') {
      inputValue.value = '';
    }


    emit('update:modelValue', valueToEmit);
  }

  function onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
      'Home', 'End'
    ];
    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
</script>

<template>
  <div>
    <input
      type="text"
      :value="inputValue"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeyDown"
      :placeholder="placeholder"
      :maxlength="maxLength"
      inputmode="numeric"
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