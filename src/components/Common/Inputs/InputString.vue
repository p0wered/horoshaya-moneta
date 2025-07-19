<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
    maxLength?: number;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    const cyrillicRegex = /[^а-яА-ЯёЁ\s]/g;
    value = value.replace(cyrillicRegex, '');

    target.value = value;
    emit('update:modelValue', value);
  }
</script>

<template>
  <div>
    <input
      id="string-input"
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :maxlength="props.maxLength"
      @input="onInput"
      :class="[
      'w-full px-4 py-3 border rounded-md focus:outline-none text-[18]',
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