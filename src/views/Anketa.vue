<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from "vue";
  import { useUtmSource, setCookie, getCookie } from '@/utils/common.ts';
  import { configProxy } from "@/config.ts";
  import ApplyProgress from "@/components/Anketa/ApplyProgress.vue";
  import RecommendationBlock from "@/components/RecommendationBlock.vue";
  import ContactInfo from "@/components/Anketa/ContactInfo.vue";
  import UserData from "@/components/Anketa/UserData.vue";
  import PassData from "@/components/Anketa/PassData.vue";
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
  });

  onMounted(() => {
    const savedStep = localStorage.getItem('currentAnketaStep');

    if (savedStep) {
      const parsedStep = parseInt(savedStep);

      if (parsedStep >= 4) {

        if (hasUtmSource.value) {
          step.value = 2;
        } else {
          step.value = 3;
        }

      } else {
        step.value = parsedStep;
      }
    }

    if (!formData.lead_id) {
      const savedLeadId = getCookie('lead_id');
      if (savedLeadId) {
        formData.lead_id = savedLeadId;
      }
    }
  });

  watch(step, (newStep) => {
    localStorage.setItem('currentAnketaStep', String(newStep));
  });

  const getLocalStorageItem = (key: string) => localStorage.getItem(key) || '';
  const getCookieItem = (key: string) => getCookie(key) || '';

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

  const sendStepOneRequest = async (data: typeof formData) => {
    const apiUrl = `https://zaimgod.ru/new-user?site_id=${configProxy.siteId}`;
    const requestFormData = new FormData();

    requestFormData.append('phone', data.phone);
    requestFormData.append('agreement_time', getCookieItem('agreement_time'));
    requestFormData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    requestFormData.append('timezone_offset', String(-new Date().getTimezoneOffset() / 60));

    const localStorageKeys = ['first_name', 'last_name', 'patronymic', 'email', 'birthday'];
    localStorageKeys.forEach(key => {
      const value = getLocalStorageItem(key);
      if (value) {
        requestFormData.append(key, value);
      }
    });

    const cookieParamsToAppend = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'click_id', 'web_id'];
    cookieParamsToAppend.forEach(key => {
      const value = getCookieItem(key);
      if (value) {
        requestFormData.append(key, value);
      }
    });

    const utmSourceValue = getCookieItem('utm_source');
    if (utmSourceValue) {
      requestFormData.append('source', utmSourceValue);
    } else {
      requestFormData.append('source', '');
    }

    let loanAmount = 0;
    let loanPeriod = 0;

    const savedCalculations = sessionStorage.getItem('savedCalculations');
    if (savedCalculations) {
      try {
        const parsedLoanData = JSON.parse(savedCalculations);
        if (parsedLoanData && typeof parsedLoanData === 'object') {
          if (typeof parsedLoanData.amount === 'number') {
            loanAmount = parsedLoanData.amount;
          }
          if (typeof parsedLoanData.period === 'number') {
            loanPeriod = parsedLoanData.period;
          }
        }
      } catch (e) {
        console.error('Ошибка парсинга savedCalculations из sessionStorage:', e);
      }
    }

    requestFormData.append('loan_sum', String(loanAmount));
    requestFormData.append('loan_length', String(loanPeriod));

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: requestFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP, статус: ${response.status}, ответ: ${errorText}`);
      }

      const responseData = await response.json();

      if (responseData.status === 'success' && responseData.lead_id) {
        setCookie('lead_id', responseData.lead_id, 30);
        formData.lead_id = responseData.lead_id;
        return { success: true, message: 'Шаг 1 успешно обработан', lead_id: responseData.lead_id };
      } else {
        throw new Error(`Апи вернул ошибку: ${JSON.stringify(responseData)}`);
      }
    } catch (error) {
      console.error('Ошибка в sendStepOneRequest:', error);
      throw new Error(`Ошибка API на шаге 1: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleStepSubmit = async () => {
    isLoading.value = true;
    let dataToSend: any = {};

    try {
      if (step.value === 1) {
        await sendStepOneRequest(formData);
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
    step.value++;
  };
</script>

<template>
  <div class="
    p-5 md:px-12 md:pt-8 md:pb-8
    bg-white
    border-b-1 border-gray-200 md:border-1
    max-w-3xl mx-auto
    md:my-8 mb-4
    md:rounded-2xl"
  >
    <ApplyProgress
        v-if="(step <= 2 && hasUtmSource) || step <= 3"
        :step="step"
    />
    <ContactInfo
        v-if="step === 1"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
    />
    <UserData
        v-else-if="step === 2"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="handlePrevStep"
    />
    <PassData
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
        v-else-if="(step === 4 && hasUtmSource) || step === 5"
        :loan-amount="formData.loanAmount"
        :loan-period="formData.loanPeriod"
    />
  </div>
  <RecommendationBlock/>
</template>