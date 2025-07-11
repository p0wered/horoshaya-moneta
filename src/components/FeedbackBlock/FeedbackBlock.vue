<script setup lang="ts">
  import type { Feedback } from './types';
  import FeedbackItem from './Item.vue';
  import PhotoVladislav from '@/assets/images/feedback/photo_vladislav.jpg';
  import PhotoIrina from '@/assets/images/feedback/photo_irina.jpg';
  import PhotoSvetlana from '@/assets/images/feedback/photo_svetlana.jpg';

  const feedback: Feedback[] = [
    {
      rate: 5,
      name: 'Владислав',
      photoUrl: PhotoVladislav,
      city: 'Москва',
      feedback:
          'Почему-то займ пришел не&nbsp;сразу, а&nbsp;с&nbsp;задержкой в&nbsp;10&nbsp;минут. А&nbsp;так молодцы. Буду брать повторный уже скоро',
    },
    {
      rate: 5,
      name: 'Ирина',
      photoUrl: PhotoIrina,
      city: 'Санкт-Петербург',
      feedback:
          'Быстро, одобрили заем с&nbsp;просрочками в&nbsp;кредитной истории. Спасибо! Обращусь еще',
    },
    {
      rate: 5,
      name: 'Светлана',
      photoUrl: PhotoSvetlana,
      city: 'Краснодар',
      feedback:
          '&laquo;Пользовалась займами уже несколько раз, и&nbsp;я&nbsp;всегда была довольна. Получила займ на&nbsp;карту быстро&raquo;.',
    },
  ];
</script>

<template>
  <section class="mx-auto" id="feedback">
    <div
        class="
        flex
        bg-yellow-subtle
        md:rounded-[40px]
        gap-7
        flex-col
        lg:flex-row
        p-5
        md:p-10
        py-10
      "
    >
      <FeedbackItem
          v-for="(item, index) in feedback"
          :key="index"
          :item="item"
          class="flex-1"
      />
    </div>
  </section>
</template>
