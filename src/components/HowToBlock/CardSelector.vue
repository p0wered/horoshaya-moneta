<script setup lang="ts">
  import { ref } from 'vue';
  import IconCardIconVisa from '@/assets/icons/card/IconVisa.vue';
  import IconCardIconContact from '@/assets/icons/card/IconContact.vue';
  import IconCardIconCorona from '@/assets/icons/card/IconCorona.vue';
  import IconCardIconMastercard from '@/assets/icons/card/IconMastercard.vue';
  import IconCardIconUmoney from '@/assets/icons/card/IconUmoney.vue';
  import IconCardIconBankTransfer from '@/assets/icons/card/IconBankTransfer.vue';

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

  const selectedCardIndex = ref(0);

  const cards: Card[] = [
    { title: 'Visa', iconComponent: IconCardIconVisa, src: cardVisa },
    { title: 'Contact', iconComponent: IconCardIconContact, src: cardContact },
    { title: 'Золотая корона', iconComponent: IconCardIconCorona, src: cardCorona },
    { title: 'Mastercard', iconComponent: IconCardIconMastercard, src: cardMastercard },
    { title: 'Юмани', iconComponent: IconCardIconUmoney, src: cardUmoney },
    { title: 'Банковский перевод', iconComponent: IconCardIconBankTransfer, src: cardBank },
  ];
</script>

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

        <span v-if="selectedCardIndex === index" class="hidden lg:inline text-md absolute right-4 arrow">&xrarr;</span>
      </li>
    </ul>

    <div class="flex-1 text-center mt-10 lg:mt-0">
      <img :src="cards[selectedCardIndex].src" class="mx-auto" alt="CardImage" />
      <p>Срок перевода занимает <span class="font-bold">до 10 минут</span></p>
    </div>
  </div>
</template>

<style scoped>
.is-selected {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.arrow {
  top: calc(50% - 10px);
}
</style>