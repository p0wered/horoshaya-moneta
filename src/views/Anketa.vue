<script setup lang="ts">
import { ref, reactive } from "vue";
import Header from "@/components/Header/Header.vue";
import ApplyProgress from "@/components/Anketa/ApplyProgress.vue";
import RecommendationBlock from "@/components/RecommendationBlock.vue";

import StepOne from "@/components/Anketa/StepOne.vue";
import StepTwo from "@/components/Anketa/StepTwo.vue";
import StepThree from "@/components/Anketa/StepThree.vue";

const isLoading = ref(false);
const step = ref(1);

const formData = reactive({
  phone: '',
  userAgreementOne: false,
  userAgreementTwo: false,
  lastName: '',
  firstName: '',
  patronymic: '',
  birthdayDate: '',
  email: '',
  gender: '',
  loanAmount: 50000,
  loanPeriod: 30,
  seriesAndNumber: '',
  subdivisionCode: '',
  issueDate: '',
  lead_id: ''
  // Пример: сюда можно добавлять куки или ID сессии, полученные с API
  // sessionId: '',
  // firstStepCookie: '',
});

// Предположим, у вас есть функция для симуляции API-запросов
// В реальном приложении это будут fetch/axios запросы к вашему бэкенду
const simulateApiRequest = (data: any, stepNum: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Отправка данных на шаге ${stepNum}:`, data);
      // В реальном приложении здесь будет проверка ответа сервера
      const success = Math.random() > 0.1; // 90% успеха для демонстрации

      if (success) {
        // Здесь можно обновить formData, если API возвращает новые данные (например, куки)
        // if (stepNum === 1) formData.sessionId = apiResponse.sessionId;
        // if (stepNum === 2) formData.cookieFromStep2 = apiResponse.someOtherCookie;
        resolve({ success: true, message: `Шаг ${stepNum} успешно обработан` });
      } else {
        reject(new Error(`Ошибка API на шаге ${stepNum}`));
      }
    }, 1000); // Задержка для демонстрации загрузки
  });
};

// Обработчик для перехода на следующий шаг и отправки API
const handleStepSubmit = async () => {
  isLoading.value = true;
  let dataToSend: any = {}; // Данные для текущего API-запроса

  try {
    if (step.value === 1) {
      dataToSend = {
        phone: formData.phone,
        // ...возможно, какие-то начальные куки
      };
      await simulateApiRequest(dataToSend, 1);
    } else if (step.value === 2) {
      // Отправляем все накопленные данные до текущего шага
      dataToSend = {
        phone: formData.phone,
        lastName: formData.lastName,
        firstName: formData.firstName,
        patronymic: formData.patronymic,
        birthdayDate: formData.birthdayDate,
        email: formData.email,
        gender: formData.gender,
        loanAmount: formData.loanAmount,
        loanPeriod: formData.loanPeriod,
        // ...любые куки, полученные на предыдущих шагах
        // firstStepCookie: formData.firstStepCookie,
      };
      await simulateApiRequest(dataToSend, 2);
    } else if (step.value === 3) {
      // Отправляем ВСЕ накопленные данные
      dataToSend = {
        phone: formData.phone,
        lastName: formData.lastName,
        firstName: formData.firstName,
        patronymic: formData.patronymic,
        birthdayDate: formData.birthdayDate,
        email: formData.email,
        gender: formData.gender,
        loanAmount: formData.loanAmount,
        loanPeriod: formData.loanPeriod,
        seriesAndNumber: formData.seriesAndNumber,
        subdivisionCode: formData.subdivisionCode,
        issueDate: formData.issueDate,
        // ...все куки, полученные ранее
      };
      await simulateApiRequest(dataToSend, 3);
      alert('Анкета успешно заполнена и данные отправлены!');
      // Опционально: сброс формы или перенаправление после завершения
      // Object.assign(formData, {/* сброс всех полей до начальных значений */});
      // step.value = 1;
      return; // Завершаем функцию, так как анкета полностью отправлена
    }
    step.value++; // Переходим к следующему шагу только после успешной отправки данных
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте еще раз.');
    // Можно реализовать более сложную обработку ошибок, например, вернуться на предыдущий шаг
  } finally {
    isLoading.value = false;
  }
};

const handlePrevStep = () => {
  step.value--;
};
</script>

<template>
  <Header/>

  <div class="md:px-12 md:pt-8 md:pb-6 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">
    <ApplyProgress :step="step"/>

    <StepOne
        v-if="step === 1"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
    />
    <StepTwo
        v-else-if="step === 2"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="handlePrevStep"
    />
    <StepThree
        v-else-if="step === 3"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="handlePrevStep"
    />
  </div>

  <RecommendationBlock/>
</template>