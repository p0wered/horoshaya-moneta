<template>
  <div
      :class="{
      'bg-separator-wave-sm': size === 'small',
      'h-[7px]': size === 'small',
      'bg-separator-wave': size === 'default',
      'h-[12px]': size === 'default',
    }"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

enum SeparatorSize {
  Small = 'small',
  Default = 'default',
}

export default defineComponent({
  props: {
    size: {
      type: String as () => SeparatorSize,
      default: SeparatorSize.Default,
    },
  },
  setup(props) {
    const separatorHeight = computed(() => {
      if (props.size === SeparatorSize.Small) {
        return 7;
      }

      return 10;
    });

    return {
      separatorHeight,
    };
  },
});
</script>
