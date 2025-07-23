<script setup lang="ts">
  interface RadioOption {
    label: string;
    value: string;
  }

  const props = defineProps<{
    modelValue: string;
    options: RadioOption[];
    name: string;
    isError: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  function onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  }
</script>

<template>
  <div class="flex h-[50px] items-center gap-x-6 gap-y-3">
    <div
        v-for="option in props.options"
        :key="option.value"
        class="flex items-center cursor-pointer"
    >
      <input
        :id="`${props.name}-${option.value}`"
        type="radio"
        :name="props.name"
        :value="option.value"
        :checked="props.modelValue === option.value"
        @change="onChange"
        :class="[
         'appearance-none w-5 h-5 transition border-1 rounded-full',
         'checked:border-red checked:bg-red',
         'focus:outline-none focus:ring-1 focus:ring-red-300 focus:ring-offset-2',
         'cursor-pointer relative after:content-[\'\'] after:block after:w-2.5 after:h-2.5',
         'after:bg-white after:rounded-full',
         'after:absolute after:top-1/2 after:left-1/2',
         'after:-translate-x-1/2 after:-translate-y-1/2',
         'after:scale-0 after:checked:scale-100',
         'after:transition-transform after:duration-10',
         props.isError
           ? 'border-red-500'
           : 'border-gray-300'
         ]"
      />
      <label :for="`${props.name}-${option.value}`" class="ml-2 text-gray-700 text-[18px] cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>