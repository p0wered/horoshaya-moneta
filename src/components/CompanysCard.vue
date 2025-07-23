<template>
  <div
    class="
      bg-white
      rounded-2xl
      hover:shadow-xl transition
      p-4"
    :class="
      isClicked
      ? 'opacity-75 border border-gray-300'
      : 'border border-red/50'
    "
  >
    <div class="flex items-center mb-4">
      <div class="w-full h-24 rounded-lg flex items-center justify-center">
        <img
            :src="offer.logo"
            :alt="offer.name"
            class="w-full h-[100%] object-contain rounded"
            @error="onImageError"
        />
      </div>
    </div>

    <div class="space-y-2 mb-4 px-3">
      <div class="flex gap-1">
        <p class="text-gray-700">
          Процентная ставка:
          <span class="font-semibold text-green-600">
            {{ offer.percentage }} %
          </span>
        </p>

      </div>

      <div class="flex flex-wrap gap-1">
        <p class="text-gray-700">
          Вам предодобрено:
        </p>
        <p class="font-semibold text-green-600">
          до {{ formatAmount(offer.max_loan) }} ₽
        </p>
      </div>

      <div class="flex gap-1">
        <p class="text-gray-700">
          Срок:
          <span class="font-semibold text-blue-500">
            до {{ offer.loan_length_max }} дней
          </span>
        </p>
      </div>

      <div class="flex gap-1">
        <p class="text-gray-700">
          Возраст:
          <span class="font-semibold text-gray-700">
            от {{ offer.approved_age_min }} до {{ offer.approved_age_max }} лет
          </span>
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <a
          v-if="!isClicked"
          :href="offer.link"
          target="_blank"
          class="
            block w-full
            bg-red/10 hover:bg-red
            text-red hover:text-white
            font-semibold
            py-3 px-4
            rounded-lg
            text-center
            transition-colors duration-200"
          @click="handleClick"
      >
        Получить деньги
      </a>

      <button
          v-else
          disabled
          class="block w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg text-center cursor-not-allowed"
      >
        Просмотрено
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Offer {
  id: string
  logo: string
  name: string
  max_loan: string
  offer_type: string
  partner_id: string
  percentage: string
  variant_id: string
  loan_length_max: string
  loan_length_min: string
  approved_age_max: string
  approved_age_min: string
  link: string
}

interface Props {
  offer: Offer
  isClicked: boolean
}

interface Emits {
  (e: 'offer-clicked', offerId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formatAmount = (amount: string): string => {
  return new Intl.NumberFormat('ru-RU').format(parseInt(amount))
}

const onImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
}

const handleClick = (): void => {
  emit('offer-clicked', props.offer.id);
}
</script>