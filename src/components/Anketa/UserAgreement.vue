<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  import { useAutoDocs } from "@/utils/auto-docs.ts";
  import CheckboxPrimary from "@/components/Common/Checkboxes/CheckboxPrimary.vue";

  const domain = window.location.origin;

  const props = defineProps<{
    checkboxOne: boolean;
    checkboxTwo: boolean;
    isErrorOne?: boolean;
    isErrorTwo?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:checkboxOne', value: boolean): void;
    (e: 'update:checkboxTwo', value: boolean): void;
  }>();

  const updateCheckboxOne = (value: boolean | string[]) => {
    if (typeof value === 'boolean') {
      emit('update:checkboxOne', value);
    }
  };

  const updateCheckboxTwo = (value: boolean | string[]) => {
    if (typeof value === 'boolean') {
      emit('update:checkboxTwo', value);
    }
  };

  const {
    publicOfertaPdf,
    personalDataPoliticPdf,
    personalDataAgreementPdf,
    paidSubAgreementPdf,
    recurrPaymentsAgreementPdf,
    cardDataAgreementPdf,
  } = useAutoDocs(domain)
</script>

<template>
  <CheckboxPrimary
      :model-value="props.checkboxOne"
      @update:model-value="updateCheckboxOne"
      :is-error="props.isErrorOne"
  >
    Заполняя заявку на сайте вы даете согласие со следующими условиями:
    <a v-if="publicOfertaPdf" :href="publicOfertaPdf" class="underline hover:text-black/40">Публичная оферта</a> и
    <a>действующие тарифы</a>,
    <a v-if="personalDataPoliticPdf" :href="personalDataPoliticPdf" class=" underline hover:text-black/40"> Политика обработки персональных данных</a>,
    <a v-if="personalDataAgreementPdf" :href="personalDataAgreementPdf" class=" underline hover:text-black/40"> Согласие на обработку персональных данных</a>.
  </CheckboxPrimary>

  <CheckboxPrimary
      :model-value="props.checkboxTwo"
      @update:model-value="updateCheckboxTwo"
      :is-error="props.isErrorTwo"
  >
    Заполняя заявку на сайте вы даете согласие со следующими условиями:
    <a v-if="cardDataAgreementPdf" :href="cardDataAgreementPdf" class="underline hover:text-black/40"> Соглашение о хранении учётных данных владельцы карт</a>,
    <a v-if="recurrPaymentsAgreementPdf" :href="recurrPaymentsAgreementPdf" class="underline hover:text-black/40"> Соглашение на применение Рекуррентных платежей</a>,
    <a v-if="paidSubAgreementPdf" :href="paidSubAgreementPdf" class="underline hover:text-black/40"> Соглашение на оформление платной подписки</a>.
    Подтверждаю, что не являюсь получателем единовременных и/или регулярных денежных выплат, предусмотренных
    Указами Президента РФ. Стоимость услуги 3000 рублей. Оплата производится раз в 30 дней. Осознаю, что оплата
    услуг не гарантирует получение займа.
  </CheckboxPrimary>
</template>
