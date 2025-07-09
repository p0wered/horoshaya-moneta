<template>
  <div class="md:flex lg:items-center relative">
    <div class="text-orange text-[33px] font-bold absolute md:relative">
      {{ step }}
    </div>
    <div class="md:pl-9 text-center flex-grow lg:text-left">
      <img
          :src="imageUrl"
          :alt="title"
          :title="title"
          class="mx-auto lg:mx-0"
      />
      <h3 class="text-l mt-7">{{ title }}</h3>
      <p class="text-[16px] text-black/50 mt-4">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    step: Number,
    title: String,
    imageUrl: String,
  },
});
</script>
