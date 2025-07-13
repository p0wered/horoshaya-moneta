<script setup lang="ts">
  import HowToBlock from "@/components/HowToBlock/HowToBlock.vue";
  import WhyUsBlock from "@/components/WhyUsBlock/WhyUsBlock.vue";
  import FeedbackBlock from "@/components/FeedbackBlock/FeedbackBlock.vue";
  import FaqBlock from "@/components/FaqBlock/FaqBlock.vue";
  import FooterHome from "@/components/FooterHome/FooterHome.vue";

  import LogoLarge from "@/assets/images/logo_large.svg";
  import LoanCalculator from "@/components/LoanCalculator.vue";
</script>

<template>
  <main class="xl:pt-8">
    <section
      class="hero__container
      bg-white
      mx-auto
      text-black
      z-10
      relative
      overflow-hidden
      xl:container
      xl:rounded-3xl
      rounded-none"
    >
      <div class="flex flex-wrap lg:flex-nowrap">
        <div
          class="
            order__hero
            w-full
            hero:max-w-[740px]
            bg-order-hero bg-center bg-cover
            min-h-[320px]
            sm:min-h-[480px]
            md:min-h-[760px]
            p-6 pt-9
            md:pt-[50px] md:p-[50px] md:pl-[80px]
            flex flex-col
            justify-between
          "
        >
          <div class="order__hero-header flex justify-between">
            <div class="w-24 md:w-auto">
              <router-link to="/">
                <img :src="LogoLarge" alt="Logo" />
              </router-link>
            </div>
          </div>

          <div class="hero__text font-bold text-white text-xl md:text-3xl w-4/5">
            Получи первый онлайн займ
          </div>
        </div>

        <div class="order-form__wrapper w-full">
          <LoanCalculator :small="false"/>
        </div>
      </div>

      <HowToBlock class="px-[20px] md:px-[80px] py-10 md:py-[116px]" />
    </section>

    <section class="bg-white -mt-6 md:-mt-60 pt-16 md:pt-80 z-0 relative">
      <WhyUsBlock class="container bg-white px-6 md:px-20 pb-16 md:pb-40" />
    </section>

    <section class="bg-white md:px-20 md:pb-40">
      <FeedbackBlock class="container"/>
    </section>

    <FaqBlock class="bg-gray pt-10 md:pt-20 px-5 md:px-20 mb-16 md:mb-40" />

    <section class="application__bottom-wrapper mx-auto bg-yellow py-12 px-3 md:px-12">
      <div class="application__bottom max-w-[500px] mx-auto bg-white md:py-10 py-6 px-3 rounded-3xl text-center">
        <h3 class="text-[24px] md:text-xl font-medium">Заполните анкету</h3>
        <p class="text-md text-black/50 mt-2">И получите индивидуальное предложение</p>

        <LoanCalculator :small="true"/>

        <p class="text-xs text-black/50 md:mt-5 mt-2">
          Все данные надежно защищены:<br />защищенное соединение
        </p>
      </div>
    </section>

    <FooterHome/>
  </main>
</template>

<style scoped>
  .hero__container {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 1196px) {
    .application__bottom-wrapper {
      background-color: var(--color-red);
      background-image:
        url('../assets/images/application__bottom_left.jpg'),
        url('../assets/images/application__bottom_right.jpg');
      background-repeat: no-repeat;
      background-position: left center, right center;
    }
  }
</style>
