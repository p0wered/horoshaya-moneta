<script setup lang="ts">
  import type { Feature } from './_types';
  import WhyFeature from './Feature.vue';
  import BlockTitle from '@/components/BlockTitle.vue';
  import WhyMoneyImg from '@/assets/images/why/why_money.png';
  import WhyFastImg from '@/assets/images/why/why_fast.png';
  import WhyProlongationImg from '@/assets/images/why/why_prolongation.png';

  const features: Feature[] = [
    {
      imageUrl: WhyMoneyImg,
      title: 'Нужная сумма &mdash; быстро!',
      description:
          'Выберите необходимую сумму займа и&nbsp;срок, на&nbsp;который хотите взять его.',
    },
    {
      imageUrl: WhyFastImg,
      title: 'Быстрая и&nbsp;простая подача заявки',
      description: 'Подача заявки займет всего несколько минут.',
    },
    {
      imageUrl: WhyProlongationImg,
      title: 'Простое продление займа',
      description:
          'Как только займ будет одобрен, мы&nbsp;сообщим об&nbsp;этом, и&nbsp;вы&nbsp;получите деньги в&nbsp;течение нескольких минут.',
    },
  ];
</script>

<template>
  <section class="bg-white mx-auto">
    <BlockTitle>Почему выбирают нас?</BlockTitle>

    <div class="flex mt-10 md:mt-20">
      <figure class="md:mr-40 flex-1">
        <p class="text-[26px] md:text-[36px] font-bold">710 000</p>
        <figcaption
            class="text-black/50 mt-5 text-sm md:text-[16px]"
        >
          клиентов в 5 странах
        </figcaption>
      </figure>

      <figure class="flex-1">
        <p class="text-[26px] md:text-[36px] font-bold">4.52/5</p>
        <figcaption
            class="text-black/50 mt-5 text-sm md:text-[16px]"
        >
          клиентов довольны предоставляемыми нами услугами
        </figcaption>
      </figure>
    </div>

    <div class="flex mt-20 flex-col lg:flex-row gap-7">
      <WhyFeature
          v-for="(feature, index) in features"
          :key="index"
          :feature="feature"
          class="w-full lg:flex-1"
      />
    </div>
  </section>
</template>
