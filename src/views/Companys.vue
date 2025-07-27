<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getCookie } from '@/utils/common.ts';
  import offersData from '@/offers/offers_data.ts';
  import CompanysCard from '@/components/CompanysCard.vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import TgBotImage from '../assets/images/companys/tg-bot.svg';
  import VkBotImage from '../assets/images/companys/vk-bot.svg';

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

  interface ApiResponse {
    offers: Offer[]
    checkers: number[]
    user: { status: string }
    tracking_active: string | null
  }

  const route = useRoute();
  const router = useRouter();
  const loading = ref(true);
  const error = ref('');
  const offers = ref<Offer[]>([]);
  const clickedOffers = ref(new Set<string>());
  const displayFullName = ref<string>('');

  const sortedOffers = computed(() => {
    const notClicked = offers.value.filter(offer => !clickedOffers.value.has(offer.id));
    const clicked = offers.value.filter(offer => clickedOffers.value.has(offer.id));
    return [...notClicked, ...clicked]
  })

  const displayItems = computed(() => {
    return sortedOffers.value.map(offer => ({ type: 'offer', ...offer }));
  });

  const getVitrinaFromType = (type: string | null): number => {
    let vid = 63;

    switch (type) {
      case "double":
        vid = 61;
        break;
      case "comebacker":
        vid = 59;
        break;
      case "overloaded":
        vid = 64;
        break;
    }

    return vid;
  }

  const getAdditionalUtms = (): string => {
    const utmSource = getCookie('utm_source') || '';
    const utmWeb = getCookie('utm_web') || '';

    return JSON.stringify({
      utm_source: utmSource,
      utm_web: utmWeb
    })
  }

  const fetchOffers = async (): Promise<void> => {
    try {
      const uid = route.query.uid as string || '';
      const type = route.query.type as string;
      const vid = getVitrinaFromType(type);
      const additionalUtms = getAdditionalUtms();

      const formData = new FormData();
      formData.append('vid', vid.toString());
      formData.append('additional_utms', additionalUtms);
      formData.append('uid', uid);

      const response = await fetch('https://zaimgod.ru/offers?v=2.0', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json()

      if (data.offers && data.offers.length > 0) {
        offers.value = data.offers;
      } else {
        offers.value = offersData.offers || [];
      }
    } catch (err) {
      console.error('Ошибка при загрузке офферов:', err);
      try {
        offers.value = offersData.offers || []
      } catch (localErr) {
        error.value = 'Не удалось загрузить предложения';
      }
    } finally {
      loading.value = false;
    }
  }

  const handleOfferClick = (offerId: string): void => {
    clickedOffers.value.add(offerId);
    // Сохраняем в localStorage для постоянства между сессиями
    const clicked = Array.from(clickedOffers.value);
    localStorage.setItem('clickedOffers', JSON.stringify(clicked));
  }

  const loadClickedOffers = (): void => {
    try {
      const saved = localStorage.getItem('clickedOffers');
      if (saved) {
        const parsed = JSON.parse(saved);
        clickedOffers.value = new Set(parsed);
      }
    } catch (err) {
      console.error('Ошибка при загрузке кликнутых офферов:', err);
    }
  }

  const sendActivationRequest = async (): Promise<void> => {
    try {
      const uid = route.query.uid as string || getCookie('lead_id') || '';

      const formData = new FormData()
      formData.append('lead_id', uid);
      formData.append('status', 'addCard');
      formData.append('key', 'BVmP2UpftWzUWmCTMXY9CMGkGq8n7cNCDvHDXahj9BzjDRZfFpKFghbAGQF5');

      await fetch('https://zaimgod.ru/set-verify?site_id=10', {
        method: 'POST',
        body: formData
      })
    } catch (err) {
      console.error('Ошибка при отправке активации:', err)
    }
  }

  const removeFromIframeParam = (): void => {
    const currentQuery = { ...route.query };

    if ('from_iframe' in currentQuery) {
      delete currentQuery.from_iframe;
      router.replace({ query: currentQuery })
    }
  }

  onMounted(async () => {
    const savedFirstName = localStorage.getItem('first_name');
    const savedPatronymic = localStorage.getItem('patronymic');

    if (savedFirstName) {
      displayFullName.value = savedFirstName;
    }

    if (savedPatronymic) {
      displayFullName.value = `${displayFullName.value} ${savedPatronymic}`.trim();
    }

    loadClickedOffers();
    removeFromIframeParam();

    if (route.query.activation === '1') {
      await sendActivationRequest();
    }

    await fetchOffers();
  });
</script>

<template>
  <div class="min-h-screen bg-white md:pb-24">

    <div class="
      background-block
      min-h-[32rem] md:min-h-[65vh]
      p-8 flex
      flex-col items-center
      bg-blue-100"
    >
      <div class="mt-10 md:mt-18">
        <p
          v-if="displayFullName"
          class="md:text-[20px] font-medium text-center  mb-4 text-gray-700">
          {{displayFullName}}, поздравляем!
        </p>

        <p
          v-else
          class="md:text-[20px] font-medium text-center  mb-4 text-gray-700">
          Поздравляем!
        </p>

        <h1 class="md:text-xl text-[24px] max-w-3xl font-medium text-center mb-12 text-gray-800">
          Одновременно подайте не менее 5 заявок в указанные ниже организации.
        </h1>
      </div>
    </div>

    <div class="container mx-4 md:mx-auto p-4 mt-[-12rem] bg-white md:rounded-3xl shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      <div v-if="loading" class="min-h-60 flex items-center justify-center">
        <LoadingSpinner color="#f91e45" size="64px"/>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <template v-for="item in displayItems" :key="item.id">
          <CompanysCard
              :offer="item"
              :is-clicked="clickedOffers.has(item.id)"
              @offer-clicked="handleOfferClick"
          />
        </template>
      </div>
    </div>

    <div class="container flex flex-col justify-center items-center mt-18">
      <p class="text-black/60 mb-6">
        Не подошли условия?
      </p>
      <div class="flex gap-3">
        <a
            class="p-3 border border-[#1d94d3] rounded-3xl"
            href="https://t.me/zaym_help_bot"
            target="_blank"
        >
          <img
              class="w-[254px] h-[76px]"
              :src="TgBotImage"
              alt="Telegram"
          >
        </a>
        <a
            class="p-3 border border-[#0077ff] rounded-3xl"
            href="https://vk.me/finsos"
            target="_blank"
        >
          <img
              class="w-[254px] h-[76px]"
              :src="VkBotImage"
              alt="Telegram"
          >
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
 .background-block{
   background-image:
     url("../assets/images/companys/companys-overlay.png"),
     url("../assets/images/companys/companys-banner.png");
   background-repeat: no-repeat, no-repeat;
   background-size: 100%, contain;
   background-position-y: bottom;
   background-position-x: center;
 }
</style>
