<template>
  <div>
    <BlockTitle>Как получить деньги?</BlockTitle>
    <div class="flex mt-5 md:mt-12 flex-wrap gap-4">
      <Step
          v-for="(step, index) in steps"
          :key="index"
          :step="index + 1"
          :title="step.title"
          :image-url="step.imageUrl"
          class="w-full text-center lg:text-left mt-12 lg:flex-1"
      >
        <span v-html="step.description"></span>
      </Step>
    </div>
    <Separator class="mt-20" />
    <BlockTitle class="mt-10 md:mt-20">Куда зачисляются деньги?</BlockTitle>
    <CardSelector class="mt-10 md:mt-20" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Separator from "../Separator.vue";
import Step from "./Step.vue";
import CardSelector from "./CardSelector.vue";
import BlockTitle from "../BlockTitle.vue";
import applyImg from '../../assets/images/howto/howto_apply.png'
import checkImg from '../../assets/images/howto/howto_check.png'
import receiveImg from '../../assets/images/howto/howto_receive_money.png'

interface Step {
  title: string;
  imageUrl: string;
  description: string;
}

export default defineComponent({
  components: {BlockTitle, CardSelector, Step, Separator},
  setup() {
    const steps: Step[] = [
      {
        title: 'Зарегистрируйтесь',
        imageUrl: applyImg,
        description:
            'Оставить заявку можно, заполнив форму на&nbsp;сайте или бесплатно по&nbsp;телефону.',
      },
      {
        title: 'Дождитесь принятия решения',
        imageUrl: checkImg,
        description: 'Система принимает решение всего за&nbsp;1&nbsp;минуту.',
      },
      {
        title: 'Получите деньги',
        imageUrl: receiveImg,
        description:
            'Мы&nbsp;переведём вам деньги на&nbsp;карту, банковский счет или через &laquo;Контакт&raquo;.',
      },
    ];

    return { steps };
  },
});
</script>
