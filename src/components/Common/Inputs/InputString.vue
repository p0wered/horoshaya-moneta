<script setup lang="ts">
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
    maxLength?: number;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'wrong-layout'): void;
  }>();

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value: string;

    const cyrillicRegex = /[^а-яА-ЯёЁ\s]/g;

    if (cyrillicRegex.test(target.value)) {
      emit('wrong-layout');
    }
    value = target.value.replace(cyrillicRegex, '');

    target.value = value;
    emit('update:modelValue', value);
  }

  function onKeypress(event: KeyboardEvent) {
    const char = event.key;
      if (!/[а-яА-ЯёЁ\s]/.test(char)) {
        event.preventDefault();
        emit('wrong-layout');
      }
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
      @keypress="onKeypress"
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