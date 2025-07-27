<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import { navigateToApply } from "@/utils/common.ts";
  import IconVerify from "@/assets/icons/IconVerify.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";

  const route = useRoute();
  const router = useRouter();

  const firstName = ref('');
  const lastName = ref('');
  const patronymic = ref('');
  const phone = ref('');
  const amount = ref(0);
  const period = ref(0);
  const isWeeklyPeriod = ref(false);

  onMounted(() => {
    firstName.value = localStorage.getItem('first_name') || '';
    lastName.value = localStorage.getItem('last_name') || '';
    patronymic.value = localStorage.getItem('patronymic') || '';
    phone.value = localStorage.getItem('phone') || '';

    let loanData = {
      amount: 25000,
      period: 10,
      isWeeklyPeriod: false
    };

    const existingLoanData = sessionStorage.getItem('savedCalculations');
    if (existingLoanData) {
      try {
        loanData = JSON.parse(existingLoanData);
      } catch (e) {
        console.error('Ошибка парсинга данных из sessionStorage:', e);
      }
    }

    const querySum = route.query.sum as string;
    const queryLoanLength = route.query.loan_length as string;

    if (querySum) {
      loanData.amount = parseInt(querySum, 10) || loanData.amount;
    }

    if (queryLoanLength) {
      loanData.period = parseInt(queryLoanLength, 10) || loanData.period;
    }

    sessionStorage.setItem('savedCalculations', JSON.stringify(loanData));

    amount.value = loanData.amount;
    period.value = loanData.period;
    isWeeklyPeriod.value = loanData.isWeeklyPeriod;
  });

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU');
  };
</script>

<template>
  <div class="md:h-screen">
    <div class="
      h-[calc(100vh-84px)] md:h-auto
      flex flex-col justify-between
      px-6 py-14 md:px-8 md:pt-8 md:pb-8
      bg-white
      border-b-1 border-gray-200 md:border-1
      max-w-3xl mx-auto
      md:my-8
      md:rounded-2xl"
    >
      <div>
        <h4 v-if="firstName && lastName"
            class="font-bold text-[30px] mb-1">
          {{ firstName }} {{ lastName }}
        </h4>

        <div class="flex gap-2 mb-4 items-center">
          <p class="font-semibold">
            Ваша заявка одобрена нашим сервисом!
          </p>
          <IconVerify/>
        </div>

        <p class="mb-4 mr-8">
          Нам уже передали вашу заявку и
          <span class="font-semibold text-red">
          мы автоматически обработали и согласовали её.
        </span>
        </p>

        <div class="mb-4">
          <p>Данные по вашей заявке:</p>
          <p v-if="firstName && lastName && patronymic">
            ФИО:
            <span class="font-bold">
            {{ firstName }} {{ lastName }} {{ patronymic }}
          </span>
          </p>
          <p v-if="phone">
            Телефон:
            <span class="font-bold">
            {{ phone }}
          </span>
          </p>
          <p>
            Сумма займа:
            <span class="font-bold">
            {{ amount.toLocaleString() }} ₽
          </span>
          </p>
          <p>
            Срок займа:
            <span class="font-bold">
            {{ period }} {{ isWeeklyPeriod ? 'недель' : 'дней' }}
          </span>
          </p>
          <p>
            Ставка:
            <span class="font-bold">
            от 0%
          </span>
          </p>
        </div>
      </div>

      <div>
        <p class="mb-4">
          Предложение действует:
          <span class="font-bold">
          до {{ getCurrentDate() }}
        </span>
        </p>

        <ButtonPrimary
            label="Завершить оформление"
            @click="() => navigateToApply(router)"
        />
      </div>

    </div>
  </div>
</template>
