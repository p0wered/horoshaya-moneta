<script setup lang="ts">
  import {ref} from "vue";
  import router from "@/router";
  import RecommendationBlock from "@/components/RecommendationBlock.vue";
  import InputPhone from "@/components/Common/Inputs/InputPhone.vue";
  import Header from "@/components/Header/Header.vue";
  import UserAgreement from "@/components/Anketa/UserAgreement.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ApplyProgress from "@/components/Anketa/ApplyProgress.vue";
  import InputString from "@/components/Common/Inputs/InputString.vue";
  import InputDate from "@/components/Common/Inputs/InputDate.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import InputNumeric from "@/components/Common/Inputs/InputNumeric.vue";
  import CheckboxRadio from "@/components/Common/Checkboxes/CheckboxRadio.vue";

  const isLoading = ref(false);
  const step = ref(1);

  // первый шаг
  const phone = ref('');

  // второй шаг
  const birthdayDate = ref('');
  const firstName = ref('');
  const lastName = ref('');
  const patronymic = ref('');
  const email = ref('');

  const gender = ref('');
  const genderOptions = [
    { label: 'М', value: 'male' },
    { label: 'Ж', value: 'female' }
  ];

  const loanAmount = ref(50000);
  const loanPeriod = ref(30);

  // третий шаг
  // const seriesAndNumber = ref('');
  // const subdivisionCode = ref('');
  // const issueDate = ref('');

  function completeStepOne(): void {
    isLoading.value = true;
    router.push('/apply/pass')
    isLoading.value = false;
  }
</script>

<template>
  <Header/>

  <div class="md:px-12 md:pt-8 md:pb-10 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">

    <ApplyProgress :step="step"/>

    <div class="flex justify-between items-center mb-6">
      <h4 class="text-xl font-semibold">Регистрация</h4>
      <p class="text-sm text-red">Шаг {{ step }}</p>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-8 w-full">
      <div class="w-full">
        <p class="mb-2 text-[14px]">Номер телефона <span class="text-red">*</span></p>
        <InputPhone v-model="phone"/>
      </div>
    </div>

    <p class="text-xs text-black/50 my-6">
      <span class="text-red">*</span> Информация обязательна для заполнения
    </p>

    <UserAgreement/>

    <div class="flex flex-col gap-6 mt-3">
      <ButtonPrimary
          label="Продолжить"
          :is-loading="isLoading"
          @click="completeStepOne"
      />
      <ButtonSecondary
          label="Назад"
          :is-loading="isLoading"
          @click=""
      />
    </div>
  </div>

  <div class="md:px-12 md:pt-8 md:pb-10 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">

    <ApplyProgress :step="step"/>

    <div class="flex justify-between items-center mb-6">
      <h4 class="text-xl font-semibold">Личные данные</h4>
      <p class="text-sm text-red">Шаг {{ step }}</p>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">
      <div class="w-full">
        <p class="mb-2 text-[14px]">Фамилия <span class="text-red">*</span></p>
        <InputString
            v-model="lastName"
            placeholder="Иванов"
        />
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Имя <span class="text-red">*</span></p>
        <InputString
            v-model="firstName"
            placeholder="Иван"
        />
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Отчество <span class="text-red">*</span></p>
        <InputString
            v-model="patronymic"
            placeholder="Иванович"
        />
      </div>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">
      <div class="md:w-[458px]">
        <p class="mb-2 text-[14px]">Дата рождения <span class="text-red">*</span></p>
        <InputDate v-model="birthdayDate"/>
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Email <span class="text-red">*</span></p>
        <InputString
            v-model="email"
            placeholder="example@mail.com"
        />
      </div>
      <div class="">
        <p class="mb-2 text-[14px]">Пол <span class="text-red">*</span></p>
        <CheckboxRadio
            v-model="gender"
            :options="genderOptions"
            name="gender"
        />
      </div>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-4 w-full mb-6">

      <div class="w-full">
        <p class="mb-2 text-[14px]">Сумма займа <span class="text-red">*</span></p>
        <InputNumeric
            v-model="loanAmount"
            :min="1000"
            :max="100000"
            :max-length="6"
        />
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Срок займа (дней) <span class="text-red">*</span></p>
        <InputNumeric
            v-model="loanPeriod"
            :min="1"
            :max="365"
            :max-length="3"
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
          @click="completeStepOne"
      />
      <ButtonSecondary
          label="Назад"
          :is-loading="isLoading"
          @click=""
      />
    </div>
  </div>

  <div class="md:px-12 md:pt-8 md:pb-10 p-5 bg-white md:border-1 border-b-1 border-gray-200 max-w-3xl mx-auto md:my-8 mb-4 md:rounded-2xl">

    <ApplyProgress :step="step"/>

    <div class="flex justify-between items-center mb-6">
      <h4 class="text-xl font-semibold">Паспортные данные</h4>
      <p class="text-sm text-red">Шаг {{ step }}</p>
    </div>

    <div class="flex md:flex-row flex-col justify-between gap-4 w-full">
      <div class="w-full">
        <p class="mb-2 text-[14px]">Серия и номер паспорта <span class="text-red">*</span></p>
        <InputDate v-model="birthdayDate"/>
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Код подразделения <span class="text-red">*</span></p>
        <InputDate v-model="birthdayDate"/>
      </div>
      <div class="w-full">
        <p class="mb-2 text-[14px]">Дата выдачи <span class="text-red">*</span></p>
        <InputDate v-model="birthdayDate"/>
      </div>
    </div>

    <p class="text-xs text-black/50 my-6">
      <span class="text-red">*</span> Информация обязательна для заполнения
    </p>

    <div class="flex flex-col gap-6 mt-3">
      <ButtonPrimary
          label="Продолжить"
          :is-loading="isLoading"
          @click="completeStepOne"
      />
      <ButtonSecondary
          label="Назад"
          :is-loading="isLoading"
          @click=""
      />
    </div>
  </div>

  <RecommendationBlock/>

</template>
