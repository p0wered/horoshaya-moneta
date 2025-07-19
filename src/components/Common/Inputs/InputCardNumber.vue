<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
  }>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const rawValue = ref('');

  watch(
      () => props.modelValue,
      (val) => {
        rawValue.value = (val || '').replace(/\D/g, '').slice(0, 10);
      },
      { immediate: true }
  );

  function formatFromRaw(digits: string) {
    const len = digits.length;
    if (len > 6) {
      const firstSix = digits.slice(0, 6);
      const lastFour = digits.slice(6);
      const core = firstSix + '*'.repeat(6) + lastFour;
      return (core.match(/.{1,4}/g) || []).join(' ');
    }
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  const formattedValue = computed<string>({
    get() {
      return formatFromRaw(rawValue.value);
    },
    set(val: string) {
      emit('update:modelValue', val);
    },
  });
</script>

<template>
  <input
    v-model="formattedValue"
    placeholder="Первые 6 и последние 4 цифры"
    maxlength="19"
    :class="[
    'w-full px-4 py-3 border rounded-md focus:outline-none text-[18]',
    props.isError
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-red'
    ]"
  />
</template>
