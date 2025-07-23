<script lang="ts" setup>
  import { ref, computed, nextTick, watch, onMounted } from 'vue';

  const props = defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const localStorageKey = 'userPhone';

  const inputRef = ref<HTMLInputElement>();
  const digits = ref('');
  const isFocused = ref(false);

  onMounted(() => {
    const savedPhone = localStorage.getItem(localStorageKey);
    if (savedPhone) {
      const d = savedPhone.replace(/\D/g, '');
      digits.value = d.startsWith('7') ? d.slice(1, 11) : d.slice(0, 10);
      emit('update:modelValue', formatted.value);
    } else if (props.modelValue) {
      const d = props.modelValue.replace(/\D/g, '');
      digits.value = d.startsWith('7') ? d.slice(1, 11) : d.slice(0, 10);
    }
  });


  const formatted = computed(() => {
    if (!isFocused.value && !digits.value) return ''

    const d = digits.value;
    let result = '+7 ';
    if (d.length === 0) return result

    const p1 = d.slice(0, 3)
    result += '(' + p1;
    if (d.length < 3) return result
    result += ') ';

    const p2 = d.slice(3, 6)
    result += p2;
    if (d.length < 6) return result
    result += '-';

    const p3 = d.slice(6, 8)
    result += p3;
    if (d.length < 8) return result
    result += '-';

    const p4 = d.slice(8, 10)
    result += p4;
    return result
  })

  function setCaret(pos: number) {
    nextTick(() => inputRef.value?.setSelectionRange(pos, pos));
  }

  function onFocus() {
    isFocused.value = true;
    if (!digits.value) {
      setCaret(3);
    }
  }

  function onBlur() {
    isFocused.value = false
    if (!digits.value) {
      emit('update:modelValue', '');
      localStorage.removeItem(localStorageKey);
    }
  }

  function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    let d = val.replace(/\D/g, '');

    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1)
    d = d.slice(0, 10);
    digits.value = d;
    emit('update:modelValue', formatted.value);
  }

  function onKeyDown(e: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
      'Home', 'End'
    ];
    if (allowedKeys.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }

    const start = inputRef.value?.selectionStart || 0;
    if ((e.key === 'Backspace' || e.key === 'Delete') && start <= 3) {
      e.preventDefault();
    }
  }

  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      localStorage.setItem(localStorageKey, newValue);
    } else {
      localStorage.removeItem(localStorageKey);
    }
  });
</script>

<template>
  <div>
    <input
        id="phone-input"
        type="tel"
        ref="inputRef"
        :value="formatted"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        placeholder="+7 (900) 000-00-00"
        maxlength="18"
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