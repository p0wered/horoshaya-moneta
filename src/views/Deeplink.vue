<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import { navigateToApply, getLoanData } from "@/utils/common.ts";
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

  onMounted(() => {
    firstName.value = localStorage.getItem('first_name') || '';
    lastName.value = localStorage.getItem('last_name') || '';
    patronymic.value = localStorage.getItem('patronymic') || '';
    phone.value = localStorage.getItem('phone') || '';

    let loanDataFromSession = getLoanData();

    const querySum = route.query.sum as string;
    const queryLoanLength = route.query.loan_length as string;

    if (querySum) {
      const parsedQuerySum = parseInt(querySum, 10);
      if (!isNaN(parsedQuerySum)) {
        loanDataFromSession.amount = parsedQuerySum;
      }
    }

    if (queryLoanLength) {
      const parsedQueryPeriod = parseInt(queryLoanLength, 10);
      if (!isNaN(parsedQueryPeriod)) {
        loanDataFromSession.period = parsedQueryPeriod;
      }
    }

    sessionStorage.setItem('savedCalculations', JSON.stringify({
      amount: loanDataFromSession.amount,
      period: loanDataFromSession.period
    }));

    amount.value = loanDataFromSession.amount;
    period.value = loanDataFromSession.period;
  });

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU');
  };
</script>

<template>
  <div class="md:h-screen">
    <div class="
      h-[calc(100vh-76px)] md:h-auto
      flex flex-col justify-between
      px-6 pt-6 pb-14 md:px-8 md:pt-8 md:pb-8
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
            {{ period }} дней
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
