<script lang="ts" setup>
  import { ref, computed, defineProps, defineEmits, nextTick } from 'vue';

  const props = defineProps<{ modelValue: string }>();
  const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

  const inputRef = ref<HTMLInputElement>();
  const digits = ref('');
  const isFocused = ref(false);

  if (props.modelValue) {
    const d = props.modelValue.replace(/\D/g, '');
    digits.value = d.startsWith('7') ? d.slice(1, 11) : d.slice(0, 10);
  }

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
        class="
          w-full
          px-4 py-3
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-1
          focus:ring-red
          text-[18]"
    />
  </div>
</template>
