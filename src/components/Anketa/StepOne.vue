<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import InputPhone from "@/components/Common/Inputs/InputPhone.vue";
import UserAgreement from "@/components/Anketa/UserAgreement.vue";
import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
import { validatePhone } from '@/utils/validators';

interface StepOneFormData {
  phone: string;
  userAgreementOne: boolean;
  userAgreementTwo: boolean;
}

const props = defineProps<{
  formData: StepOneFormData;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit-step'): void;
  (e: 'update:formData', value: StepOneFormData): void;
}>();

// Локальные ref для ошибок
const phoneError = ref('');
// Ошибки для чекбоксов
const agreementOneError = ref('');
const agreementTwoError = ref('');


const validateStep = () => {
  let isValid = true;

  // Валидация телефона
  phoneError.value = validatePhone(props.formData.phone);
  if (phoneError.value) {
    isValid = false;
  }

  // Валидация чекбоксов
  if (!props.formData.userAgreementOne) {
    agreementOneError.value = 'Вы должны принять все условия.';
    isValid = false;
  } else {
    agreementOneError.value = '';
  }

  if (!props.formData.userAgreementTwo) {
    agreementTwoError.value = 'Вы должны принять все условия.';
    isValid = false;
  } else {
    agreementTwoError.value = '';
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateStep()) {
    emit('submit-step');
  }
};

// Функция для очистки ошибки при вводе
const clearPhoneError = () => {
  phoneError.value = '';
};

// Функции для очистки ошибок чекбоксов при изменении
const clearAgreementOneError = () => {
  agreementOneError.value = '';
};
const clearAgreementTwoError = () => {
  agreementTwoError.value = '';
};
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h4 class="text-xl font-semibold">Регистрация</h4>
    <p class="text-sm text-red">Шаг 1</p>
  </div>

  <div class="flex md:flex-row flex-col justify-between gap-8 mb-6 w-full">
    <div class="w-full">
      <p class="mb-2 text-[14px]">Номер телефона <span class="text-red">*</span></p>
      <InputPhone
          v-model="props.formData.phone"
          :is-error="!!phoneError"
          :error-message="phoneError"
          @blur="phoneError = validatePhone(props.formData.phone)"
          @input="clearPhoneError"
      />
    </div>
  </div>

  <UserAgreement
      v-model:checkboxOne="props.formData.userAgreementOne"
      v-model:checkboxTwo="props.formData.userAgreementTwo"
      :is-error-one="!!agreementOneError"
      :is-error-two="!!agreementTwoError"
      @update:checkboxOne="clearAgreementOneError"
      @update:checkboxTwo="clearAgreementTwoError"
  />

  <p v-if="!!agreementOneError || !!agreementTwoError" class="text-red text-xs mt-2">
    {{ agreementOneError || agreementTwoError }}
  </p>

  <p class="text-xs text-black/50 my-6">
    <span class="text-red">*</span> Информация обязательна для заполнения
  </p>

  <div class="flex flex-col gap-6 mt-3 mb-4">
    <ButtonPrimary
        label="Продолжить"
        :is-loading="isLoading"
        @click="handleSubmit"
    />
  </div>
</template>