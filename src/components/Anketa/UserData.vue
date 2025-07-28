<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import InputString from "@/components/Common/Inputs/InputString.vue";
  import InputDate from "@/components/Common/Inputs/InputDate.vue";
  import InputEmail from "@/components/Common/Inputs/InputEmail.vue";
  import CheckboxRadio from "@/components/Common/Checkboxes/CheckboxRadio.vue";
  import InputNumeric from "@/components/Common/Inputs/InputNumeric.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import {
    validateRequiredString,
    validateEmail,
    validateDate,
    validateGender,
    validateNumeric
  } from '@/utils/validators';
  import { getLoanData } from '@/utils/common.ts'; // Импортируем вашу функцию

  interface StepTwoFormData {
    lastName: string;
    firstName: string;
    patronymic: string;
    birthdayDate: string;
    email: string;
    gender: string;
    loanAmount: number;
    loanPeriod: number;
  }

  const props = defineProps<{
    formData: StepTwoFormData;
    isLoading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit-step'): void;
    (e: 'prev-step'): void;
    (e: 'update:formData', value: StepTwoFormData): void;
  }>();

  const genderOptions = [
    { label: 'М', value: 'm' },
    { label: 'Ж', value: 'f' }
  ];

  const lastNameError = ref('');
  const firstNameError = ref('');
  const patronymicError = ref('');
  const birthdayDateError = ref('');
  const emailError = ref('');
  const genderError = ref('');
  const loanAmountError = ref('');
  const loanPeriodError = ref('');

  const localStorageKeys: Record<Exclude<keyof StepTwoFormData, 'loanAmount' | 'loanPeriod'>, string> = {
    lastName: 'last_name',
    firstName: 'first_name',
    patronymic: 'patronymic',
    birthdayDate: 'birthday',
    email: 'email',
    gender: 'gender',
  };

  const sessionStorageCalculationsKey = 'savedCalculations';

  onMounted(() => {
    let hasLoadedData = false;

    for (const keyString in localStorageKeys) {
      const key = keyString as Exclude<keyof StepTwoFormData, 'loanAmount' | 'loanPeriod'>;
      const lsKey = localStorageKeys[key];
      const savedValue = localStorage.getItem(lsKey);

      if (savedValue !== null) {
        if (key === 'gender') {
          const genderFound = genderOptions.some(opt => opt.value === savedValue);
          if (genderFound) {
            props.formData[key] = savedValue as any;
            hasLoadedData = true;
          }
        } else {
          props.formData[key] = savedValue as any;
          hasLoadedData = true;
        }
      }
    }

    const loanData = getLoanData();
    props.formData.loanAmount = loanData.amount;
    props.formData.loanPeriod = loanData.period;

    const defaultLoanData = getLoanData();
    if (loanData.amount !== defaultLoanData.amount || loanData.period !== defaultLoanData.period) {
      hasLoadedData = true;
    }

    if (hasLoadedData) {
      emit('update:formData', props.formData);
    }
  });

  watch(() => props.formData, (newFormData) => {
    for (const keyString in localStorageKeys) {
      const key = keyString as Exclude<keyof StepTwoFormData, 'loanAmount' | 'loanPeriod'>;
      const lsKey = localStorageKeys[key];
      let valueToStore: string | number | undefined = newFormData[key];

      if (valueToStore === null || valueToStore === undefined || valueToStore === '') {
        localStorage.removeItem(lsKey);
      } else {
        localStorage.setItem(lsKey, String(valueToStore));
      }
    }

    const currentCalculations = {
      amount: newFormData.loanAmount,
      period: newFormData.loanPeriod
    };

    sessionStorage.setItem(sessionStorageCalculationsKey, JSON.stringify(currentCalculations));

  }, { deep: true });

  const validateStep = () => {
    let isValid = true;

    lastNameError.value = validateRequiredString(props.formData.lastName);
    if (lastNameError.value) isValid = false;

    firstNameError.value = validateRequiredString(props.formData.firstName);
    if (firstNameError.value) isValid = false;

    patronymicError.value = validateRequiredString(props.formData.patronymic);
    if (patronymicError.value) isValid = false;

    birthdayDateError.value = validateDate(props.formData.birthdayDate);
    if (birthdayDateError.value) isValid = false;

    emailError.value = validateEmail(props.formData.email);
    if (emailError.value) isValid = false;

    genderError.value = validateGender(props.formData.gender);
    if (genderError.value) isValid = false;

    loanAmountError.value = validateNumeric(props.formData.loanAmount, 1000, 100000);
    if (loanAmountError.value) isValid = false;

    loanPeriodError.value = validateNumeric(props.formData.loanPeriod, 1, 365);
    if (loanPeriodError.value) isValid = false;

    return isValid;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      emit('submit-step');
    }
  };

  const handlePrev = () => {
    emit('prev-step');
  };

  const clearStringError = (field: 'last_name' | 'first_name' | 'patronymic' | 'email') => {
    if (field === 'last_name') lastNameError.value = '';
    if (field === 'first_name') firstNameError.value = '';
    if (field === 'patronymic') patronymicError.value = '';
    if (field === 'email') emailError.value = '';
  };
  const clearDateError = (field: 'birthday') => {
    if (field === 'birthday') birthdayDateError.value = '';
  };
  const clearNumericError = (field: 'loanAmount' | 'loanPeriod') => {
    if (field === 'loanAmount') loanAmountError.value = '';
    if (field === 'loanPeriod') loanPeriodError.value = '';
  };
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h4 class="text-xl font-semibold">Личные данные</h4>
    <p class="text-sm text-red">Шаг 2</p>
  </div>

  <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">
    <div class="w-full">
      <p class="mb-2 text-[14px]">Фамилия <span class="text-red">*</span></p>
      <InputString
          v-model="props.formData.lastName"
          placeholder="Иванов"
          :is-error="!!lastNameError"
          :error-message="lastNameError"
          @blur="lastNameError = validateRequiredString(props.formData.lastName)"
          @input="clearStringError('last_name')"
          @wrong-layout="lastNameError = 'Переключите раскладку'"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Имя <span class="text-red">*</span></p>
      <InputString
          v-model="props.formData.firstName"
          placeholder="Иван"
          :is-error="!!firstNameError"
          :error-message="firstNameError"
          @blur="firstNameError = validateRequiredString(props.formData.firstName)"
          @input="clearStringError('first_name')"
          @wrong-layout="firstNameError = 'Переключите раскладку'"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Отчество <span class="text-red">*</span></p>
      <InputString
          v-model="props.formData.patronymic"
          placeholder="Иванович"
          :is-error="!!patronymicError"
          :error-message="patronymicError"
          @blur="patronymicError = validateRequiredString(props.formData.patronymic)"
          @input="clearStringError('patronymic')"
          @wrong-layout="patronymicError = 'Переключите раскладку'"
      />
    </div>
  </div>

  <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">
    <div class="md:w-[458px]">
      <p class="mb-2 text-[14px]">Дата рождения <span class="text-red">*</span></p>
      <InputDate
          v-model="props.formData.birthdayDate"
          :is-error="!!birthdayDateError"
          :error-message="birthdayDateError"
          @blur="birthdayDateError = validateDate(props.formData.birthdayDate)"
          @input="clearDateError('birthday')"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Email <span class="text-red">*</span></p>
      <InputEmail
          v-model="props.formData.email"
          :is-error="!!emailError"
          :error-message="emailError"
          @blur="emailError = validateEmail(props.formData.email)"
          @input="clearStringError('email')"
      />
    </div>
    <div class="">
      <p class="mb-2 text-[14px]">Пол <span class="text-red">*</span></p>
      <CheckboxRadio
          v-model="props.formData.gender"
          :options="genderOptions"
          name="gender"
          :is-error="!!genderError"
          @change="genderError = validateGender(props.formData.gender)"
      />
    </div>
  </div>

  <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">
    <div class="w-full">
      <p class="mb-2 text-[14px]">Сумма займа <span class="text-red">*</span></p>
      <InputNumeric
          v-model="props.formData.loanAmount"
          :min="1000"
          :max="100000"
          :max-length="6"
          :is-error="!!loanAmountError"
          :error-message="loanAmountError"
          @blur="loanAmountError = validateNumeric(props.formData.loanAmount, 1000, 100000)"
          @input="clearNumericError('loanAmount')"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Срок займа (дней) <span class="text-red">*</span></p>
      <InputNumeric
          v-model="props.formData.loanPeriod"
          :min="1"
          :max="365"
          :max-length="3"
          :is-error="!!loanPeriodError"
          :error-message="loanPeriodError"
          @blur="loanPeriodError = validateNumeric(props.formData.loanPeriod, 1, 365)"
          @input="clearNumericError('loanPeriod')"
      />
    </div>
  </div>

  <p class="text-xs text-black/50 my-6">
    <span class="text-red">*</span> Информация обязательна для заполнения
  </p>

  <div class="flex flex-col gap-6 mt-3">
    <ButtonPrimary
        label="Продолжить"
        :is-loading="isLoading"
        @click="handleSubmit"
    />
    <ButtonSecondary
        label="Назад"
        :is-loading="isLoading"
        @click="handlePrev"
    />
  </div>
</template>
