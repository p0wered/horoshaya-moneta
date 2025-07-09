<template>
  <div class="lg:flex gap-6 items-center">
    <ul class="flex flex-wrap lg:flex-col justify-around gap-2 lg:gap-6">
      <li
          v-for="(card, index) in cards"
          :key="index"
          class="px-2 py-2 cursor-pointer rounded-lg lg:min-w-[360px] relative"
          @click="selectedCardIndex = index"
          :class="{ 'is-selected': selectedCardIndex === index }"
      >
        <component :is="card.iconComponent" class="hidden lg:inline-block" />

        <span
            class="lg:ml-4 text-black text-opacity-50 text-sm md:text-md"
            :class="{ 'text-opacity-100': selectedCardIndex === index }"
        >
          {{ card.title }}
        </span>

        <span v-if="selectedCardIndex === index" class="hidden lg:inline text-md absolute right-4 arrow">
          &xrarr;
        </span>
      </li>
    </ul>

    <div class="flex-1 text-center mt-10 lg:mt-0">
      <img :src="cards[selectedCardIndex].src" class="mx-auto" alt="CardImage" />
      <p>Срок перевода занимает <span class="font-bold">до 10 минут</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import IconCardVisa from '@/assets/icons/card/Visa.vue';
import IconCardContact from '@/assets/icons/card/Contact.vue';
import IconCardCorona from '@/assets/icons/card/Corona.vue';
import IconCardMastercard from '@/assets/icons/card/Mastercard.vue';
import IconCardUmoney from '@/assets/icons/card/Umoney.vue';
import IconCardBankTransfer from '@/assets/icons/card/BankTransfer.vue';

import cardVisa from '@/assets/images/howto/card_visa_lg.png';
import cardContact from '@/assets/images/howto/card_contact_lg.png';
import cardCorona from '@/assets/images/howto/card_korona_lg.png';
import cardMastercard from '@/assets/images/howto/card_mc_lg.png';
import cardUmoney from '@/assets/images/howto/card_u_lg.png';
import cardBank from '@/assets/images/howto/card_bank_lg.png';

interface Card {
  title: string;
  iconComponent: any;
  src: string;
}

export default defineComponent({
  setup() {
    const selectedCardIndex = ref(0);

    const cards: Card[] = [
      { title: 'Visa', iconComponent: IconCardVisa, src: cardVisa },
      { title: 'Contact', iconComponent: IconCardContact, src: cardContact },
      { title: 'Золотая корона', iconComponent: IconCardCorona, src: cardCorona },
      { title: 'Mastercard', iconComponent: IconCardMastercard, src: cardMastercard },
      { title: 'Юмани', iconComponent: IconCardUmoney, src: cardUmoney },
      { title: 'Банковский перевод', iconComponent: IconCardBankTransfer, src: cardBank },
    ];

    return {
      selectedCardIndex,
      cards,
    };
  },
});
</script>

<style scoped>
.is-selected {
  box-shadow:
  0 27px 65px rgba(0, 0, 0, 0.03),
  0 18px 38px rgba(0, 0, 0, 0.0227778),
  0 10px 21px rgba(0, 0, 0, 0.0182222),
  0 5px  11px rgba(0, 0, 0, 0.015),
  0 2px  5px  rgba(0, 0, 0, 0.0117778),
  0 1px  3px  rgba(0, 0, 0, 0.00722222);
}

.arrow {
  top: calc(50% - 10px);
}
</style>