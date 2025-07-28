<script setup lang="ts">
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import InputPhone from '@/components/Common/Inputs/InputPhone.vue';
  import InputCardNumber from '@/components/Common/Inputs/InputCardNumber.vue';
  import UnsubscribeModal from '@/components/UnsubscribeModal.vue';
  import RecommendationBlock from "@/components/RecommendationBlock.vue";

  const phoneUnsubscribe = ref('');
  const cardNumberUnsubscribe = ref('');

  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const showUnsubscribeModal = ref(false);

  const isFormValid = computed(() => {
    return phoneUnsubscribe.value.trim().length === 18 && cardNumberUnsubscribe.value.trim().length === 19;
  });

  const openTelegram = () => {
    window.open('https://t.me/zaimia_v_bot');
  }

  const openUnsubscribeModal = () => {
    if (!isFormValid.value) {
      errorMessage.value = 'Пожалуйста, заполните оба поля';
      return;
    }

    showUnsubscribeModal.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeUnsubscribeModal = () => {
    showUnsubscribeModal.value = false;
    document.body.style.overflow = '';
  };

  async function changeTariff() {
    closeUnsubscribeModal();

    errorMessage.value = '';
    successMessage.value = '';

    if (!isFormValid.value) {
      errorMessage.value = 'Пожалуйста, заполните оба поля';
      return;
    }

    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('site_id', '10');
      formData.append('phone', phoneUnsubscribe.value);
      formData.append('card_number', cardNumberUnsubscribe.value);

      const response = await axios.post('//zaimgod.ru/change-tariff', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        validateStatus: status => status < 500
      });

      if (response.status === 403) {
        errorMessage.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
      } else {
        const data = typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
        if (data.status === 'success') {
          successMessage.value = 'Вы успешно сменили тариф на Базовый';
        } else {
          errorMessage.value = 'Мы не смогли найти активную подписку с такими данными. Пожалуйста, проверьте данные.';
        }
      }
    } catch {
      errorMessage.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
    } finally {
      isLoading.value = false;
    }
  }

  async function unsubscribe() {
    closeUnsubscribeModal();

    errorMessage.value = '';
    successMessage.value = '';

    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('site_id', '10');
      formData.append('phone', phoneUnsubscribe.value);
      formData.append('card_number', cardNumberUnsubscribe.value);

      const response = await axios.post('//zaimgod.ru/unsubscribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        validateStatus: status => status < 500
      });

      if (response.status === 403) {
        errorMessage.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
      } else {
        const data = typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
        if (data.status === 'success') {
          successMessage.value = 'Вы успешно отписаны от системы';
        } else {
          errorMessage.value = 'Мы не смогли найти активную подписку с такими данными. Пожалуйста, проверьте данные.';
        }
      }
    } catch {
      errorMessage.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <div class="md:p-12 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Отписаться от платных услуг</h2>
      <p class="text-black/70">Мы не сможем отписать Вас от сервиса, если данные будут отличаться</p>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-8 w-full">
      <div class="w-full">
        <p class="mb-2">Номер телефона <span class="text-red">*</span></p>
        <InputPhone v-model="phoneUnsubscribe" id="phone-input"/>
      </div>
      <div class="w-full">
        <p class="mb-2">Номер привязанной карты <span class="text-red">*</span></p>
        <InputCardNumber v-model="cardNumberUnsubscribe" id="card_number"/>
      </div>
    </div>

    <div v-if="errorMessage" class="mt-4 text-red">{{ errorMessage }}</div>
    <div v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</div>

    <hr class="mt-12 mb-6 border-gray-300" />

    <p class="text-xs text-black/50 mb-12">
      <span class="text-red">*</span> Информация обязательна для заполнения
    </p>

    <div class="flex md:flex-row flex-col gap-4">
      <button
          class="p-4 w-full bg-red text-white rounded-lg hover:bg-red-dark transition cursor-pointer"
          :disabled="isLoading"
          @click="changeTariff"
      >
        {{ isLoading ? 'Загрузка...' : 'Сменить тариф' }}
      </button>
      <button
          class="p-4 w-full text-red hover:text-red-dark cursor-pointer"
          :disabled="isLoading"
          @click="openUnsubscribeModal"
      >
        {{ isLoading ? 'Загрузка...' : 'Отписаться' }}
      </button>
    </div>
  </div>

  <div class="max-w-3xl md:mx-auto mx-4 mb-6 p-6 rounded-2xl bg-red/10">
    <p class="mb-4">
      Если у вас не получается отписаться, вы забыли какую именно карту вы
      использовали – это не повод её блокировать или звонить в банк. Просто
      напишите нам в Telegram, мы отпишем вас в ручную.
    </p>
    <button
        class="p-4 w-full bg-red text-white rounded-lg hover:bg-red-dark cursor-pointer"
        @click="openTelegram"
    >
      Написать в Telegram
    </button>
  </div>

  <RecommendationBlock/>

  <hr class="max-w-3xs mt-[-5rem] mb-32 mx-auto border-red border-3 rounded-full">

  <UnsubscribeModal
      :show="showUnsubscribeModal"
      @close="closeUnsubscribeModal"
      @changeTariff="changeTariff"
      @unsubscribe="unsubscribe"
  />
</template>
