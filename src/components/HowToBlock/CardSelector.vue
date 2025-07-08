<template>
  <div class="lg:flex gap-6 items-center">
    <ul class="flex flex-wrap lg:flex-col justify-around gap-2 lg:gap-6">
      <li
          v-for="(card, index) in cards"
          :key="index"
          class="px-2 py-2 cursor-pointer rounded-lg lg:min-w-[360px] relative"
          @click="selectedCardIndex = index"
          :class="{
          'is-selected': selectedCardIndex === index,
        }"
      >
        <component :is="card.iconComponent" class="hidden lg:inline-block" />

        <span
            class="lg:ml-4 text-black text-opacity-50 text-sm md:text-md"
            :class="{ 'text-opacity-100': selectedCardIndex === index }"
        >{{ card.title }}</span
        >

        <span
            v-if="selectedCardIndex === index"
            class="hidden lg:inline text-md absolute right-4 arrow"
        >&xrarr;</span
        >
      </li>
    </ul>

    <div class="flex-1 text-center mt-10 lg:mt-0">
      <img :src="selectedCardImage" class="mx-auto" />
      <p>Срок перевода занимает <span class="font-bold">до 10 минут</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import IconCardVisa from '../../assets/icons/card/Visa.vue';
import IconCardContact from '../../assets/icons/card/Contact.vue';
import IconCardCorona from '../../assets/icons/card/Corona.vue';
import IconCardMastercard from '../../assets/icons/card/Mastercard.vue';
import IconCardUmoney from '../../assets/icons/card/Umoney.vue';
import IconCardBankTransfer from '../../assets/icons/card/BankTransfer.vue';

interface Card {
  title: string;
  iconComponent: any;
  cardSrc: string;
}

export default defineComponent({
  setup() {
    const selectedCardIndex = ref(0);

    const cards: Card[] = [
      {
        title: 'Visa',
        iconComponent: IconCardVisa,
        cardSrc: 'card_visa_lg',
      },
      {
        title: 'Contact',
        iconComponent: IconCardContact,
        cardSrc: 'card_contact_lg',
      },
      {
        title: 'Золотая корона',
        iconComponent: IconCardCorona,
        cardSrc: 'card_korona_lg',
      },
      {
        title: 'Mastercard',
        iconComponent: IconCardMastercard,
        cardSrc: 'card_mc_lg',
      },
      {
        title: 'Юмани',
        iconComponent: IconCardUmoney,
        cardSrc: 'card_u_lg',
      },
      {
        title: 'Банковский перевод',
        iconComponent: IconCardBankTransfer,
        cardSrc: 'card_bank_lg',
      },
    ];

    const selectedCardImage = computed(
        () => `/howto/${cards[selectedCardIndex.value].cardSrc}.png`
    );

    return {
      selectedCardIndex,
      cards,
      selectedCardImage,
    };
  },
});
</script>

<style scoped>
.is-selected {
  box-shadow: 0px 27px 65px rgba(0, 0, 0, 0.03),
  0px 17.5px 38.0671px rgba(0, 0, 0, 0.0227778),
  0px 10.4px 20.7037px rgba(0, 0, 0, 0.0182222),
  0px 5.4px 10.5625px rgba(0, 0, 0, 0.015),
  0px 2.2px 5.2963px rgba(0, 0, 0, 0.0117778),
  0px 0.5px 2.55787px rgba(0, 0, 0, 0.00722222);
}

.arrow {
  top: calc(50% - 10px);
}
</style>
