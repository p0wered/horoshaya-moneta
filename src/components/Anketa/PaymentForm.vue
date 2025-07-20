<script setup lang="ts">
  import { defineProps, ref, onMounted } from 'vue';
  import { configProxy } from "@/config";
  import axios from 'axios';
  import PieChart from "@/components/PieChart.vue";

  const props = defineProps<{
    loanAmount: number;
    loanPeriod: number;
  }>();

  const domain = window.location.origin;
  const paymentLink = ref<string | null>(null);
  const hasError = ref(false);
  const isLoadingPayment = ref(true);
  const displayFullName = ref<string>('');

  onMounted(async () => {
    const savedFirstName = localStorage.getItem('first_name');
    const savedPatronymic = localStorage.getItem('patronymic');
    const uid = localStorage.getItem('lead_id');

    if (savedFirstName) {
      displayFullName.value = savedFirstName;
    }

    if (savedPatronymic) {
      displayFullName.value = `${displayFullName.value} ${savedPatronymic}`.trim();
    }

    if (!uid) {
      console.error('Ошибка: lead_id не найден в localStorage.');
      hasError.value = true;
      isLoadingPayment.value = false;
      return;
    }

    const apiUrl = `https://payment.mfo-0.ru/web_form?sid=${configProxy[domain].siteId}&uid=${uid}&cid=${configProxy[domain].cid}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.status === 'success' && response.data.link) {
        paymentLink.value = response.data.link;
        hasError.value = false;
      } else {
        console.error('API response error or invalid format:', response.data);
        hasError.value = true;
      }
    } catch (error) {
      console.error('Error fetching payment terminal:', error);
      hasError.value = true;
    } finally {
      isLoadingPayment.value = false;
    }
  });
</script>

<template>
  <h4 class="text-xl font-semibold mb-2">{{ displayFullName }}</h4>

  <p class="text-red mb-6">
    Ваша заявка одобрена нашим сервисом!
  </p>

  <p class="text-sm mb-6">
    Для продолжения вам необходимо активировать аккаунт банковской картой, мы спишем и сразу вернем 1 рубль.
    Укажите реквизиты вашей карты. Активация нужна для идентификации вашей персоны. Для первого займа Вам доступно
    специальное предложение — займ под 0% (без процентов и переплат)*.
  </p>

  <div class="flex md:flex-row flex-col gap-4 justify-between mb-6">
    <div>
      <p>Сумма займа</p>
      <p class="text-red">{{ props.loanAmount }} ₽</p>
    </div>
    <div>
      <p>Срок займа</p>
      <p class="text-red">{{ props.loanPeriod }} дн.</p>
    </div>
    <div>
      <p>Вам доступно</p>
      <p class="text-red">12 условий займа</p>
    </div>
  </div>

  <div class="flex justify-between mb-5">
    <p>Сводка доступных условий</p>
    <div class="flex gap-4">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"/>
        <p class="text-xs">Сумма</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"/>
        <p class="text-xs">Срок</p>
      </div>
    </div>
  </div>

  <div class="flex justify-between mb-8">
    <div class="flex flex-col items-center">
      <PieChart
        :percentage="50"
        :stroke-width="14"
      />
      <p class="mt-2">Выбрано</p>
    </div>
    <div class="flex flex-col items-center">
      <PieChart
          :percentage="65"
          :stroke-width="14"
      />
      <p class="mt-2">Больше сумма</p>
    </div>
    <div class="flex flex-col items-center">
      <PieChart
          :percentage="30"
          :stroke-width="14"
      />
      <p class="mt-2">Больше срок</p>
    </div>
    <div class="flex flex-col items-center">
      <PieChart
          :percentage="10"
          :stroke-width="14"
      />
      <p class="mt-2">Меньше сумма</p>
    </div>
  </div>

  <div>
    <div
        v-if="!paymentLink"
      :class="[
        'flex justify-center items-center',
        'min-h-32 mb-3',
        'py-8 px-4',
        'rounded-md',
        'bg-gray-100',
        hasError
        ? 'text-red-500'
        : 'text-black/50'
      ]"
    >
      <p v-if="isLoadingPayment && !hasError">Идёт загрузка терминала...</p>
      <p v-else-if="hasError">Произошла ошибка при загрузке терминала оплаты</p>
    </div>
    <iframe
        v-else
        :src="paymentLink"
        class="rounded-lg mb-4"
        width="100%"
        height="400px"
        allowfullscreen
    ></iframe>
  </div>
</template>