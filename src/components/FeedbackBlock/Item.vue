<script setup lang="ts">
  import { computed } from 'vue';
  import type { Feedback } from './types';
  import { range } from 'lodash';
  import IconStar from "@/assets/icons/IconStar.vue";

  interface Props {
    item: Feedback;
  }
  const props = defineProps<Props>();

  const rating = computed(() => range(props.item.rate));
</script>

<template>
  <figure class="flex flex-nowrap place-items-start gap-4">
    <img
        class="rounded-full w-[44px] md:w-[54px]"
        :src="item.photoUrl"
        :alt="item.name"
        :title="item.name"
        loading="lazy"
    />
    <figcaption>
      <div class="flex">
        <IconStar v-for="mark in rating" :key="mark" class="mr-1" />
      </div>
      <h4 class="text-[20px] mt-2">{{ item.name }}</h4>
      <span class="text-sm text-black text-opacity-50">{{ item.city }}</span>
      <p class="mt-4 md:mt-6 text-sm md:text-[16px]" v-html="item.feedback"></p>
    </figcaption>
  </figure>
</template>
