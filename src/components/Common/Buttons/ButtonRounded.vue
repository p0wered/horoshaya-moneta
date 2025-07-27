<script setup lang="ts">

</script>

<template>
  <button
      class="bg-white px-3 md:px-6 py-3 md:py-4 rounded-full flex items-center cursor-pointer"
      @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>
