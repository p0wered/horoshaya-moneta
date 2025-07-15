<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRouter, useRoute } from "vue-router";
  import { addDays, addMonths, addYears } from 'date-fns';
  import { formatCurrency, formatDate, formatLoanPeriod, mapSliderValueToPeriod } from '@/utils/format';
  import { createDefaultCalculations, saveCalculations } from '@/utils/session';
  import { useUtmSource } from '@/utils/utm.ts';

  import ButtonGradient from "@/components/Common/Buttons/ButtonGradient.vue";
  import Separator from "@/components/Separator.vue";
  import Slider from '@/components/Slider.vue';
  import ButtonRounded from "@/components/Common/Buttons/ButtonRounded.vue";

  withDefaults(
      defineProps<{
        small?: boolean
      }>(),
      {
        small: false,
      }
  );

  const router = useRouter();
  const route = useRoute();

  const { amount, period } = createDefaultCalculations();
  const { hasUtmSource } = useUtmSource();

  const loanAmount = ref(amount);
  const loanPeriod = ref(period);

  const isWeeksPeriod = computed(() => loanAmount.value >= 50000);

  const LOAN_PERIOD_SLIDER_MIN = 1;
  const LOAN_PERIOD_SLIDER_MAX = 42;

  const navigateToApply = () => {
    router.push({
      path: '/apply',
      query: { ...route.query }
    });
  };

  const loanAmountFormatted = computed(() =>
      formatCurrency(loanAmount.value)
  );

  const loanPeriodFormatted = computed(() => {
    return formatLoanPeriod(loanPeriod.value);
  });

  const dueDateFormatted = computed(() => {
    const now = new Date();
    let calculatedDueDate: Date;

    const { unit, value } = mapSliderValueToPeriod(loanPeriod.value);

    switch (unit) {
      case 'day':
        calculatedDueDate = addDays(now, value);
        break;
      case 'month':
        calculatedDueDate = addMonths(now, value);
        break;
      case 'year':
        calculatedDueDate = addYears(now, value);
        break;
      default:
        calculatedDueDate = now;
    }

    return formatDate(calculatedDueDate, 'd MMMM yyyy');
  });

  const updateSavedCalculations = () => {
    saveCalculations(loanAmount.value, loanPeriod.value, isWeeksPeriod.value);
  };

  watch([loanAmount, loanPeriod], () => {
    updateSavedCalculations();
  }, { immediate: true });
</script>

<template>
  <section>
    <div :class="[small ? 'p-2 md:p-6' : 'p-8 md:p-[50px] md:pl-[80px]']">

      <div v-if="!small">
        <h2 class="text-xl">Нужен займ?</h2>
        <p class="mt-4 text-md">Получи первый займ прямо сейчас на карту</p>
      </div>

      <div>
        <Slider
          class="mt-8"
          :min="1000"
          :max="100000"
          :step="1000"
          v-model="loanAmount"
          label="Сумма"
          @change="updateSavedCalculations">
          {{loanAmountFormatted}}
        </Slider>

        <Slider
          class="mt-8"
          :min="LOAN_PERIOD_SLIDER_MIN"
          :max="LOAN_PERIOD_SLIDER_MAX"
          :step="1"
          label="На какой срок?"
          v-model="loanPeriod"
          @change="updateSavedCalculations">
          {{loanPeriodFormatted}}
        </Slider>
      </div>

      <ButtonGradient
          :class="['w-full', 'mt-10', small ? 'rounded-full': 'rounded-lg']"
          @click="navigateToApply"
      >
        Оформить заявку
      </ButtonGradient>

      <div
        v-if="!small"
        class="
        bg-red-subtle
        text-sm text-center
        py-4
        pt-5
        px-2
        rounded-b-3xl
        -mt-1
        whitespace-normal"
      >
        <span class="text-red font-bold">Акция:</span>
        займ до 50 000 для новых клиентов
      </div>

      <Separator v-if="!small" size="small" class="mt-7" />

      <div v-if="!small" class="mt-7 sm:flex justify-between">
        <div class="flex justify-between items-baseline sm:block">
          <span class="sm:block text-black sm:text-black/50 sm:text-sm text-md">
            Вы берете
          </span>
          <span class="sm:block text-md mt-2">{{ loanAmountFormatted }}</span>
        </div>

        <div class="mt-4 sm:mt-0 flex justify-between items-baseline sm:block">
          <span class="sm:block text-black sm:text-black/50 sm:text-sm text-md">
            Займ до
          </span>
          <span class="sm:block text-md mt-2">{{ dueDateFormatted }}</span>
        </div>

        <div class="mt-4 sm:mt-0 flex justify-between items-baseline sm:block">
          <span class="sm:block text-black sm:text-black/50 sm:text-sm text-md">
            Возвращаете
          </span>
          <span class="sm:block text-md mt-2">{{ loanAmountFormatted }}</span>
        </div>
      </div>

      <div v-if="!small" class="mt-10 text-center text-black/50 text-[12px]">
        <p>
          Сервис осуществляет подбор микрозаймов между лицом, желающим оформить займ, и кредитными учреждениями
        </p>
        <p v-if="!hasUtmSource">
          Вы оформляете подписку стоимостью 3000 руб. каждые 30 дней, с регулярностью попыток списания 1 раз в день
        </p>
      </div>
    </div>

    <div v-if="!small" class="bg-red py-6 flex justify-center items-center px-4">
      <div class="flex items-center space-x-6">
        <div>
          <span class="block text-md text-white font-bold">
            Получите на 5000 ₽ больше
          </span>
          <span class="block mt-2 text-sm text-white text-opacity-50">
            Оформите заявку по этой кнопке
          </span>
        </div>

        <ButtonRounded @click="navigateToApply">
          <span class="text-md text-black">&xrarr;</span>
        </ButtonRounded>
      </div>
    </div>
  </section>
</template>