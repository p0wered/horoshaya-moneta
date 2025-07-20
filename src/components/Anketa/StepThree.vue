<script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
  import InputPassport from "@/components/Common/Inputs/InputPassport.vue";
  import InputDate from "@/components/Common/Inputs/InputDate.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import {
    validatePassportSeriesAndNumber,
    validateSubdivisionCode,
    validateDate
  } from '@/utils/validators';

  interface StepThreeFormData {
    seriesAndNumber: string;
    subdivisionCode: string;
    issueDate: string;
  }

  const props = defineProps<{
    formData: StepThreeFormData;
    isLoading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit-step'): void;
    (e: 'prev-step'): void;
    (e: 'update:formData', value: StepThreeFormData): void;
  }>();

  const seriesAndNumberError = ref('');
  const subdivisionCodeError = ref('');
  const issueDateError = ref('');

  const localStorageKeys: Record<keyof StepThreeFormData, string> = {
    seriesAndNumber: 'passportSeriesAndNumber',
    subdivisionCode: 'passportSubdivisionCode',
    issueDate: 'passportThreeIssueDate',
  };

  onMounted(() => {
    let hasLoadedData = false;
    for (const keyString in localStorageKeys) {
      const key = keyString as keyof StepThreeFormData;
      const lsKey = localStorageKeys[key];
      const savedValue = localStorage.getItem(lsKey);

      if (savedValue !== null) {
        props.formData[key] = savedValue;
        hasLoadedData = true;
      }
    }

    if (hasLoadedData) {
      emit('update:formData', props.formData);
    }
  });

  watch(() => props.formData, (newFormData) => {
    for (const keyString in localStorageKeys) {
      const key = keyString as keyof StepThreeFormData;
      const lsKey = localStorageKeys[key];
      const valueToStore = newFormData[key];

      if (valueToStore === null || valueToStore === undefined || valueToStore === '') {
        localStorage.removeItem(lsKey);
      } else {
        localStorage.setItem(lsKey, String(valueToStore));
      }
    }
  }, { deep: true });

  const validateStep = () => {
    let isValid = true;

    seriesAndNumberError.value = validatePassportSeriesAndNumber(props.formData.seriesAndNumber);
    if (seriesAndNumberError.value) isValid = false;

    subdivisionCodeError.value = validateSubdivisionCode(props.formData.subdivisionCode);
    if (subdivisionCodeError.value) isValid = false;

    issueDateError.value = validateDate(props.formData.issueDate);
    if (issueDateError.value) isValid = false;

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

  const clearPassportError = (field: 'seriesAndNumber' | 'subdivisionCode') => {
    if (field === 'seriesAndNumber') seriesAndNumberError.value = '';
    if (field === 'subdivisionCode') subdivisionCodeError.value = '';
  };
  const clearDateError = (field: 'issueDate') => {
    if (field === 'issueDate') issueDateError.value = '';
  };
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h4 class="text-xl font-semibold">Паспортные данные</h4>
    <p class="text-sm text-red">Шаг 3</p>
  </div>

  <div class="flex md:flex-row flex-col justify-between gap-4 w-full">
    <div class="w-full">
      <p class="mb-2 text-[14px]">Серия и номер паспорта <span class="text-red">*</span></p>
      <InputPassport
          v-model="props.formData.seriesAndNumber"
          :is-error="!!seriesAndNumberError"
          :error-message="seriesAndNumberError"
          @blur="seriesAndNumberError = validatePassportSeriesAndNumber(props.formData.seriesAndNumber)"
          @input="clearPassportError('seriesAndNumber')"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Код подразделения <span class="text-red">*</span></p>
      <InputPassport
          v-model="props.formData.subdivisionCode"
          :division-code="true"
          :is-error="!!subdivisionCodeError"
          :error-message="subdivisionCodeError"
          @blur="subdivisionCodeError = validateSubdivisionCode(props.formData.subdivisionCode)"
          @input="clearPassportError('subdivisionCode')"
      />
    </div>
    <div class="w-full">
      <p class="mb-2 text-[14px]">Дата выдачи <span class="text-red">*</span></p>
      <InputDate
          v-model="props.formData.issueDate"
          :is-error="!!issueDateError"
          :error-message="issueDateError"
          @blur="issueDateError = validateDate(props.formData.issueDate)"
          @input="clearDateError('issueDate')"
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