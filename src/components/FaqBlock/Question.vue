<script setup lang="ts">
  import { ref } from 'vue';
  // @ts-ignore хз почему ругается, всё настроено
  import SlideUpDown from 'vue-slide-up-down';

  const isExpanded = ref(false);
</script>

<template>
  <article
      class="bg-white rounded-xl overflow-hidden question__shadow"
      :class="{ 'is-expanded': isExpanded }"
  >
    <div
        class="xl:px-6 xl:py-7 px-4 py-5 cursor-pointer text-md relative pr-4 flex items-center"
        @click="isExpanded = !isExpanded"
    >
      <i class="expandable__arrow md:hidden">
        <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M2.34315 0.757324L0.92894 2.17154L7.99999 9.24263L15.0711 2.17157L13.6568 0.757353L8.00001 6.41419L2.34315 0.757324Z"
              fill="#A1A1A1"
          />
        </svg>
      </i>

      <span class="pl-5 md:pl-0 ">
        <slot></slot>
      </span>

      <i class="expandable__arrow absolute right-0 hidden md:block mr-6">
        <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M2.34315 0.757324L0.92894 2.17154L7.99999 9.24263L15.0711 2.17157L13.6568 0.757353L8.00001 6.41419L2.34315 0.757324Z"
              fill="#A1A1A1"
          />
        </svg>
      </i>
    </div>

    <SlideUpDown :active="isExpanded" :duration="250">
      <slot name="description"></slot>
    </SlideUpDown>

  </article>
</template>

<style scoped>
.expandable__arrow {
  top: calc(50% - 5px);
  transition: transform 0.5s;
}

.is-expanded .expandable__arrow {
  transform: rotate(180deg);
}

.question__shadow{
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
