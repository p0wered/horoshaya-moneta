<script setup lang="ts">
  import type { Feature } from './_types';

  interface Props {
    feature: Feature;
  }

  defineProps<Props>();
</script>

<template>
  <figure class="flex place-items-start">
    <img
        :src="feature.imageUrl"
        :alt="feature.title"
        :title="feature.title"
        loading="lazy"
        class="w-[72px] md:w-[82px]"
    />
    <figcaption class="pl-8">
      <h4 v-html="feature.title" class="text-md md:text-[24px]"></h4>
      <p
          v-html="feature.description"
          class="text-black/50 text-sm md:text-[16px] mt-4"
      ></p>
    </figcaption>
  </figure>
</template>
