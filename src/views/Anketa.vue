<script setup lang="ts">
  import { ref, reactive, onMounted, watch, computed } from "vue";
  import {useUtmSource, setCookie, getCookie, getLoanData} from '@/utils/common.ts';
  import { configProxy } from "@/config.ts";
  import axios from "axios";
  import ApplyProgress from "@/components/Anketa/ApplyProgress.vue";
  import RecommendationBlock from "@/components/RecommendationBlock.vue";
  import ContactInfo from "@/components/Anketa/ContactInfo.vue";
  import UserData from "@/components/Anketa/UserData.vue";
  import PassData from "@/components/Anketa/PassData.vue";
  import DataVerification from "@/components/Anketa/DataVerification.vue";
  import PaymentForm from "@/components/Anketa/PaymentForm.vue";

  const localStorageKeys = {
    step: 'currentAnketaStep',
    passportSeriesAndNumber: 'passportSeriesAndNumber',
    passportDepCode: 'passportDepCode',
    passportIssueData: 'passportIssueDate'
  } as const;

  const userDataFields = ['first_name', 'last_name', 'patronymic', 'email', 'birthday'] as const;
  const passDataFields = [...userDataFields, 'gender'] as const;
  const cookieParams = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'click_id', 'web_id'] as const;

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

  const apiClient = axios.create({
    baseURL: `https://zaimgod.ru/`,
    timeout: 10000,
    params: {
      site_id: configProxy.siteId
    }
  });

  interface ApiResponse {
    status: string;
    status_code: number;
    lead_id: string;
  }

  const shouldShowProgress = computed(() =>
      (step.value <= 2 && hasUtmSource.value) || step.value <= 3
  );

  const currentStepComponent = computed(() => {
    if (step.value === 1) return 'ContactInfo';
    if (step.value === 2) return 'UserData';
    if (step.value === 3 && !hasUtmSource.value) return 'PassData';
    if ((step.value === 3 && hasUtmSource.value) || step.value === 4) return 'DataVerification';
    if ((step.value === 4 && hasUtmSource.value) || step.value === 5) return 'PaymentForm';
    return null;
  });

  const getCookieItem = (key: string): string => getCookie(key) || '';

  const createFormData = (additionalFields: Record<string, string> = {}) => {
    const requestFormData = new FormData();
    const loanData = getLoanData();

    const baseFields = {
      phone: formData.phone,
      lead_id: formData.lead_id,
      agreement_time: getCookieItem('agreement_time'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezone_offset: String(-new Date().getTimezoneOffset() / 60),
      source: getCookieItem('utm_source'),
      loan_sum: String(loanData.amount),
      loan_length: String(loanData.period),
      ...additionalFields
    };

    Object.entries(baseFields).forEach(([key, value]) => {
      if (value) requestFormData.append(key, value);
    });

    cookieParams.forEach(key => {
      const value = getCookieItem(key);
      if (value) requestFormData.append(key, value);
    });

    return requestFormData;
  };

  const appendFieldsFromStorage = (formData: FormData, fields: readonly string[]) => {
    fields.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) formData.append(key, value);
    });
  };

  const sendApiRequest = async (
      formData: FormData,
      endpoint: string,
      stepNumber: number
  ) => {
    try {
      const response = await apiClient.post<ApiResponse>(endpoint, formData);

      const data = response.data;
      if (data.status !== 'success') {
        throw new Error(
            `API вернул ошибку на шаге ${stepNumber}: ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (err: any) {
      const message = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      throw new Error(message);
    }
  };

  // шаг 1
  const sendStepOneRequest = async () => {
    const requestFormData = createFormData();
    appendFieldsFromStorage(requestFormData, userDataFields);

    const responseData = await sendApiRequest(requestFormData, 'new-user', 1);

    if (responseData.lead_id) {
      setCookie('lead_id', responseData.lead_id, 30);
      formData.lead_id = responseData.lead_id;
      return { success: true, message: 'Шаг 1 успешно обработан', lead_id: responseData.lead_id };
    }

    throw new Error('lead_id не получен от API');
  };

  // шаг 2
  const sendStepTwoRequest = async () => {
    if (!formData.lead_id) {
      step.value = 1;
      throw new Error('lead_id отсутствует. Невозможно отправить запрос шага 2.');
    }

    const requestFormData = createFormData();
    appendFieldsFromStorage(requestFormData, passDataFields);

    await sendApiRequest(requestFormData, 'add', 2);
    return { success: true, message: 'Шаг 2 успешно обработан' };
  };

  // шаг 3
  const sendStepThreeRequest = async () => {
    if (!formData.lead_id) {
      step.value = 1;
      throw new Error('lead_id отсутствует. Невозможно отправить запрос шага 3.');
    }

    const requestFormData = createFormData();
    appendFieldsFromStorage(requestFormData, passDataFields);

    const passportSeriesAndNumber = localStorage.getItem(localStorageKeys.passportSeriesAndNumber) || '';
    const [passportSeries, passportNumber] = passportSeriesAndNumber.split(' ').filter(Boolean);

    if (passportSeries && passportNumber) {
      requestFormData.append('passportSeries', passportSeries);
      requestFormData.append('passportNumber', passportNumber);
    }

    const passportDepCode = localStorage.getItem(localStorageKeys.passportDepCode);
    const passportIssueDate = localStorage.getItem(localStorageKeys.passportIssueData);

    if (passportDepCode) requestFormData.append('passportDepCode', passportDepCode);
    if (passportIssueDate) requestFormData.append('passport_issued_date', passportIssueDate);

    await sendApiRequest(requestFormData, 'add', 3);
    return { success: true, message: 'Шаг 3 успешно обработан' };
  };

  // управление шагами
  const handleStepSubmit = async () => {
    isLoading.value = true;

    try {
      const stepHandlers = {
        1: sendStepOneRequest,
        2: sendStepTwoRequest,
        3: sendStepThreeRequest
      };

      const handler = stepHandlers[step.value as keyof typeof stepHandlers];
      if (handler) {
        await handler();

        if (step.value === 2 && hasUtmSource.value) {
          step.value = 4;
        } else {
          step.value++;
        }
      }
    } catch (error) {
      console.error('Ошибка при отправке данных,', error);
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

  onMounted(() => {
    const savedStep = localStorage.getItem(localStorageKeys.step);

    if (savedStep) {
      const parsedStep = parseInt(savedStep);

      if (parsedStep >= 4) {
        step.value = hasUtmSource.value ? 2 : 3;
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
    localStorage.setItem(localStorageKeys.step, String(newStep));
  });
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
      v-if="shouldShowProgress"
      :step="step"
    />

    <ContactInfo
      v-if="currentStepComponent === 'ContactInfo'"
      v-model:form-data="formData"
      :is-loading="isLoading"
      @submit-step="handleStepSubmit"
    />

    <UserData
      v-else-if="currentStepComponent === 'UserData'"
      v-model:form-data="formData"
      :is-loading="isLoading"
      @submit-step="handleStepSubmit"
      @prev-step="handlePrevStep"
    />

    <PassData
      v-else-if="currentStepComponent === 'PassData'"
      v-model:form-data="formData"
      :is-loading="isLoading"
      @submit-step="handleStepSubmit"
      @prev-step="handlePrevStep"
    />

    <DataVerification
      v-else-if="currentStepComponent === 'DataVerification'"
      :lead-id="formData.lead_id"
      @verification-complete="handleVerificationComplete"
    />

    <PaymentForm
      v-else-if="currentStepComponent === 'PaymentForm'"
      :loan-amount="formData.loanAmount"
      :loan-period="formData.loanPeriod"
    />
  </div>

  <RecommendationBlock />
</template>