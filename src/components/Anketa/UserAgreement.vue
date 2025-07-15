<script setup lang="ts">
  import CheckboxPrimary from "@/components/Common/Checkboxes/CheckboxPrimary.vue";
  import {ref} from "vue";

  const checkboxOne = ref(false);
  const checkboxTwo = ref(false);
</script>

<template>
  <CheckboxPrimary v-model="checkboxOne">
    Заполняя заявку на сайте вы даете согласие со следующими условиями:
    <a href="/offer" class="underline hover:text-black/40">Публичная оферта</a> и
    <a href="/about" class="underline hover:text-black/40">действующие тарифы</a>,
    <a href="/privacy" class=" underline hover:text-black/40"> Политика обработки персональных данных</a>,
    <a href="/privacy" class=" underline hover:text-black/40"> Согласие на обработку персональных данных</a>.
  </CheckboxPrimary>
  <CheckboxPrimary v-model="checkboxTwo">
    Заполняя заявку на сайте вы даете согласие со следующими условиями:
    <a href="/offer" class="underline hover:text-black/40"> Соглашение о хранении учётных данных владельцы карт</a>,
    <a href="/about" class="underline hover:text-black/40"> Соглашение на применение Рекуррентных платежей</a>,
    <a href="/privacy" class="underline hover:text-black/40"> Соглашение на оформление платной подписки</a>.
    Подтверждаю, что не являюсь получателем единовременных и/или регулярных денежных выплат, предусмотренных
    Указами Президента РФ. Стоимость услуги 3000 рублей. Оплата производится раз в 30 дней. Осознаю, что оплата
    услуг не гарантирует получение займа.
  </CheckboxPrimary>
</template>

<style scoped>

</style>