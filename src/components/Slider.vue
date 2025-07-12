<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import noUiSlider from 'nouislider/dist/nouislider';
  import 'nouislider/dist/nouislider.css';

  interface Props {
    modelValue: number;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    min: 0,
    max: 100,
    step: 1,
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const slider = ref<HTMLElement | null>(null);

  const getValue = (values: (string | number)[]): number => {
    const firstValue = values[0];
    if (typeof firstValue === 'number') {
      return firstValue;
    }
    return parseInt(firstValue);
  };

  onMounted(() => {
    if (slider.value) {
      const sliderComponent = noUiSlider.create(slider.value, {
        start: [props.modelValue],
        step: props.step,
        connect: [true, false],
        behaviour: 'drag',
        range: {
          min: props.min,
          max: props.max,
        },
      });
      sliderComponent.on('update', (values) =>
          emit('update:modelValue', getValue(values))
      );
      sliderComponent.on('change', (values) =>
          emit('change', getValue(values))
      );
    }
  });
</script>

<template>
  <div class="calc-slider">
    <div class="calc-slider__label flex justify-between text-md">
      <div>{{ label }}</div>
      <div class="font-semibold">
        <slot>{{ modelValue }}</slot>
      </div>
    </div>

    <div id="slider" ref="slider" class="mt-6"></div>
  </div>
</template>

<style>
.noUi-horizontal {
  height: 4px;
}

.noUi-horizontal .noUi-handle {
  width: 27px;
  height: 27px;
  background-color: var(--color-red);
  border: 2px solid white;
  box-shadow: none;
  border-radius: 50%;
  top: -12px;
  cursor: pointer;
}

.noUi-horizontal .noUi-handle::before,
.noUi-horizontal .noUi-handle::after {
  content: none;
}

.noUi-connect {
  background: var(--color-red);
}

.noUi-target {
  border: 0;
  background-color: whitesmoke;
  box-shadow: none;
  border-radius: 9999px;
}
</style>