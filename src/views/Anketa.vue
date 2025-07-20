<script setup lang="ts">
  import {ref, reactive, onMounted, watch} from "vue";
  import { useUtmSource } from '@/utils/utm.ts';
  import Header from "@/components/Header/Header.vue";
  import ApplyProgress from "@/components/Anketa/ApplyProgress.vue";
  import RecommendationBlock from "@/components/RecommendationBlock.vue";
  import StepOne from "@/components/Anketa/StepOne.vue";
  import StepTwo from "@/components/Anketa/StepTwo.vue";
  import StepThree from "@/components/Anketa/StepThree.vue";
  import DataVerification from "@/components/Anketa/DataVerification.vue";
  import PaymentForm from "@/components/Anketa/PaymentForm.vue";

  const { hasUtmSource } = useUtmSource();
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
    lead_id: '',
    paymentCompleted: false,
  });

  onMounted(() => {
    const savedStep = localStorage.getItem('currentAnketaStep');
    if (savedStep) {
      step.value = parseInt(savedStep);
    }

    const savedPaymentCompleted = localStorage.getItem('paymentCompleted');
    if (savedPaymentCompleted === 'true') {
      formData.paymentCompleted = true;

      if (step.value <= 4) {
        step.value = 5;
      }
    }
  });

  watch(step, (newStep) => {
    localStorage.setItem('currentAnketaStep', String(newStep));
  });


  // временно для отладки
  const simulateApiRequest = (data: any, stepNum: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Отправка данных на шаге ${stepNum}:`, data);
        const success = Math.random() > 0.1;

        if (success) {
          if (stepNum === 1) {
            formData.lead_id = `lead_${Date.now()}`;
            console.log('Получен lead_id:', formData.lead_id);
          }
          resolve({ success: true, message: `Шаг ${stepNum} успешно обработан` });
        } else {
          reject(new Error(`Ошибка API на шаге ${stepNum}`));
        }
      }, 1000);
    });
  };

  const handleStepSubmit = async () => {
    isLoading.value = true;
    let dataToSend: any = {};

    try {
      if (step.value === 1) {
        dataToSend = {
          phone: formData.phone,
          userAgreementOne: formData.userAgreementOne,
          userAgreementTwo: formData.userAgreementTwo,
        };
        await simulateApiRequest(dataToSend, 1);
        step.value++;
      } else if (step.value === 2) {
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
          lead_id: formData.lead_id,
        };
        await simulateApiRequest(dataToSend, 2);

        if (hasUtmSource.value) {
          step.value = 4;
        } else {
          step.value++;
        }

      } else if (step.value === 3) {
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
          lead_id: formData.lead_id,
        };
        await simulateApiRequest(dataToSend, 3);
        step.value++;
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте еще раз.');
    } finally {
      isLoading.value = false;
    }
  };

  const handlePrevStep = () => {
    if (step.value === 4 && hasUtmSource.value) {
      step.value = 2;
    } else {
      step.value--;
    }
  };

  const handleVerificationComplete = () => {
    console.log('Data verification completed. Transitioning to PaymentForm.');
    localStorage.setItem('paymentCompleted', 'true');
    formData.paymentCompleted = true;
    step.value++;
  };
</script>

<template>
  <Header/>

  <div class="md:px-12 md:pt-8 md:pb-6 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">
    <ApplyProgress v-if="step <= 3" :step="step"/>

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
        v-else-if="step === 3 && !hasUtmSource"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="handlePrevStep"
    />
    <DataVerification
        v-else-if="(step === 3 && hasUtmSource) || step === 4"
        :lead-id="formData.lead_id"
        @verification-complete="handleVerificationComplete"
    />
    <PaymentForm
        v-else-if="step === 5"
        :loan-amount="formData.loanAmount"
        :loan-period="formData.loanPeriod"
    />
  </div>

  <RecommendationBlock/>
</template>