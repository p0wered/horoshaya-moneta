<script setup lang="ts">
  import { ref } from 'vue'
  import FaqQuestion from './Question.vue'
  import BlockTitle from '@/components/BlockTitle.vue'

  interface Question {
    title: string
    description: string
  }

  const questions = ref<Question[]>([
    {
      title: 'Как оформить услугу?',
      description:
          'Просто заполните анкету, активируйте заявку и действуйте по следующими инструкциями. После оформления в любой из предложенной нашим сервисом микрофинансовой организации деньги зачислятся на ваш счет уже в день обращения. Обычно процесс оформления заявки максимально упрощен и занимает всего несколько минут. В анкете указывайте только настоящую информацию. При использовании ложной информации вероятность отказа многократно увеличивается.',
    },
    {
      title: 'Какие требования к заемщику?',
      description:
          'Вам должно быть 18 лет и у вас должна иметься банковская карта — больше нет никаких требований.',
    },
    {
      title: 'Какая процентная ставка?',
      description:
          'На первый займ микрофинансовые организации практически всегда предоставляют возможность взять деньги под 0%. На повторные выдачи процентная ставка может быть от 0.01%, всё зависит от выбранной вами МФО.',
    },
    {
      title: 'У меня плохая кредитная история',
      description:
          'Мы понимаем, что ситуации могут быть разными, и работаем со всеми клиентами — даже при наличии плохой кредитной истории подберём удобный заём с выгодными условиями. А вовремя выплаченные займы помогают улучшить вашу кредитную историю!',
    },
  ])
</script>

<template>
  <section class="container mx-auto">
    <BlockTitle>Частые вопросы</BlockTitle>

    <section class="mt-10 md:mt-10">
      <FaqQuestion class="mt-[12px]" v-for="(question, index) in questions" :key="index">
        <h4 class="text-[16px] md:text-md font-medium">{{ question.title }}</h4>
        <template #description>
          <p
            class="px-6 pb-4 pt-4 border-t-1 border-gray-200 md:text-md text-sm text-black/80"
            v-html="question.description"
          />
        </template>
      </FaqQuestion>
    </section>

  </section>
</template>
