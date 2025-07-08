<template>
  <main class="xl:py-16">
    <section
        class="
        hero__container
        container
        bg-white
        mx-auto
        xl:rounded-tr-3xl
        rounded-b-3xl
        text-black
        z-10
        relative
      "
    >
      <HowToBlock class="px-[20px] md:px-[80px] py-10 md:py-[116px]" />
    </section>
  </main>
</template>

<script setup lang="ts">
import HowToBlock from "../components/HowToBlock/HowToBlock.vue";
</script>

<style scoped>
  .hero__text {
    text-shadow: 0px 100px 80px rgba(0, 0, 0, 0.08),
    0px 64.8148px 46.8519px rgba(0, 0, 0, 0.0607407),
    0px 38.5185px 25.4815px rgba(0, 0, 0, 0.0485926),
    0px 20px 13px rgba(0, 0, 0, 0.04),
    0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0314074),
    0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0192593);
  }
</style>
