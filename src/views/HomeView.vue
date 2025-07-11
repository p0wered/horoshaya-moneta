<script setup lang="ts">
  import HowToBlock from "@/components/HowToBlock/HowToBlock.vue";
  import WhyUsBlock from "@/components/WhyUsBlock/WhyUsBlock.vue";
  import FeedbackBlock from "@/components/FeedbackBlock/FeedbackBlock.vue";
  import FaqBlock from "@/components/FaqBlock/FaqBlock.vue";
  import FooterHome from "@/components/FooterHome/FooterHome.vue";
</script>

<template>
  <main class="xl:pt-8">
    <section
        class="
        hero__container
        container
        bg-white
        mx-auto
        xl:rounded-3xl
        rounded-3xl
        text-black
        z-10
        relative
      "
    >
      <HowToBlock class="px-[20px] md:px-[80px] py-10 md:py-[116px]"/>
    </section>

    <section class="bg-white -mt-6 md:-mt-60 pt-16 md:pt-80 z-0 relative">
      <WhyUsBlock class="bg-white px-6 md:px-20 pb-16 md:pb-40" />
    </section>

    <section class="bg-white md:px-20 md:pb-40">
      <FeedbackBlock />
    </section>

    <FaqBlock class="bg-gray pt-10 md:pt-20 px-5 md:px-20 mb-16 md:mb-40" />

    <FooterHome/>
  </main>
</template>

<style scoped>
  .hero__container {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 1196px) {
    .application__bottom-wrapper {
      background:
        url('../assets/images/application__bottom_left.jpg'),
        url('../assets/images/application__bottom_right.jpg'),
        #feba28;
      background: no-repeat, no-repeat, no-repeat left, right;
    }
  }
</style>
