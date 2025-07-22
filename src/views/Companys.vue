<script lang="ts" setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import { getCookie, setCookie, sendMetrika } from "@/utils/common";
import { formatPlaceId, injectAdsfinScript } from "@/utils/adsfin";
import offers_data from "@/offers/offers_data.ts"; // Mock data

// --- Components ---
import CompanyCardWrapper from "../components/CompanyCardWrapper.vue";
import LinksSocialNetworks from "../components/LinksSocialNetworks.vue";

// --- Type Definitions ---
interface Offer {
  logo: string;
  name: string;
  max_loan: string;
  offer_type: string;
  partner_id: string;
  percentage: string;
  variant_id: string;
  loan_length_max: string;
  loan_length_min: string;
  approved_age_max: string;
  approved_age_min: string;
  is_first_nopercentage: string;
  id: string;
  link: string;
}

interface SavedCalculations {
  amount: number;
  period: number;
  isWeeklyPeriod: boolean;
}

// --- Vue Router Initialization ---
const route = useRoute();

// --- Accessing Global $config ---
const app = getCurrentInstance();
const $config = computed(() => app?.appContext.config.globalProperties.$config || {});
const currentDomain = window.location.origin;

// --- Reactive State ---
const offers = ref<Offer[]>([]);
const visitedOffers = ref<Record<string, number>>({});

// --- Data from Session Storage (Saved Calculations) ---
const savedCalculations = computed<SavedCalculations>(() => {
  const data = sessionStorage.getItem('savedCalculations');
  return data ? JSON.parse(data) : { amount: 0, period: 0, isWeeklyPeriod: false };
});

const loanAmountFormatted = computed(() => {
  return savedCalculations.value.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
});

// --- Data from Local Storage (fullNameString) ---
const firstName = ref(localStorage.getItem('firstName') || '');
const patronymic = ref(localStorage.getItem('patronymic') || '');

const fullNameString = computed(() => {
  return firstName.value && patronymic.value ? `${firstName.value} ${patronymic.value},` : null;
});

// --- URL Parameter Handling ---
const urlParams = computed(() => new URLSearchParams(route.query as Record<string, string>));
const uid = computed(() => urlParams.value.get("uid") ?? "");
const type = computed(() => urlParams.value.get("type"));
const noSqueezeParam = computed(() => urlParams.value.get("no_squeeze"));
const activationParam = computed(() => urlParams.value.get("activation"));
const fromIframeParam = computed(() => urlParams.value.get("from_iframe"));

// --- URL Utility Functions ---
function removeURLParameter(url: string, parameter: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(parameter);
  return urlObj.toString();
}

// --- Adsfin Places for Script Injection ---
const adsfinPlaces = {
  over: "144422707724035113",
  top: "144422628920269113",
  center: "144422644547013110",
  bottom: "144422666282942119",
} as const;

// --- Component Initialization Logic (onMounted) ---
onMounted(async () => {
  console.log('Current Domain Config:', $config.value[currentDomain]); // For debugging

  window.scrollTo(0, 0);

  if (noSqueezeParam.value === "1") {
    setCookie("no_squeeze", "1", 7);
  }

  if (activationParam.value === "1") {
    sendMetrika("activation_success");
  }

  if (fromIframeParam.value !== null) {
    if (window.top) { // Safe check for window.top
      const newLink = removeURLParameter(window.location.href, "from_iframe");
      window.top.location.replace(newLink);
    } else {
      console.warn("window.top is not accessible, cannot redirect from iframe.");
    }
    return;
  } else {
    if (activationParam.value === "1") {
      handleActivationPostback(uid.value);
    }
  }

  loadOffers();

  for (const placeId of Object.values(adsfinPlaces)) {
    injectAdsfinScript(placeId);
  }
});

// --- Handle Postback After Activation ---
async function handleActivationPostback(currentUid: string): Promise<void> {
  const setVerify = new FormData();
  setVerify.append("status", "addCard");
  setVerify.append("key", "BVmP2UpftWzUWmCTMXY9CMGkGq8n7cNCDvHDXahj9BzjDRZfFpKFghbAGQF5");
  setVerify.append("lead_id", currentUid);

  try {
    const siteId = $config.value[currentDomain]?.siteId;
    if (!siteId) {
      console.error("Site ID not found in config for current domain.");
      sendMetrika("postback_fail");
      return;
    }

    const response = await fetch(`https://api.mfo-0.ru/set-verify?site_id=${siteId}`, {
      method: "POST",
      body: setVerify,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    sendMetrika("postback_success");
  } catch (error) {
    console.error("Error sending postback:", error);
    sendMetrika("postback_fail");
  }
}

// --- Load and Sort Offers ---
async function loadOffers(): Promise<void> {
  const requestData = new FormData();

  let vid = 81;
  switch (type.value) {
    case "double":
      vid = 84;
      break;
    case "comebacker":
      vid = 82;
      break;
    case "overloaded":
      vid = 83;
      break;
  }
  requestData.append("vid", vid.toString());

  const utmSource = getCookie("utm_source") || "";
  const utmWeb = getCookie("web_id") || "";

  requestData.append(
      "additional_utms",
      JSON.stringify({
        utm_source: utmSource,
        utm_web: utmWeb,
      })
  );

  requestData.append("uid", uid.value);

  const visitedOffersCookie = getCookie("visitedOffers");
  visitedOffers.value = visitedOffersCookie ? JSON.parse(visitedOffersCookie) : {};

  try {
    const response = await fetch(`https://api.mfo-0.ru/offers?v=2.0`, {
      method: "POST",
      body: requestData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData.offers && responseData.offers.length > 0) {
      layoutOffers(responseData.offers);
    } else {
      console.warn("API вернул пустой список офферов, используем моковые данные.");
      layoutOffers(offers_data.offers as Offer[]); // Corrected
    }
  } catch (error) {
    console.error("Error fetching offers from API:", error);
    layoutOffers(offers_data.offers as Offer[]); // Corrected
  }
}

function layoutOffers(offersList: Offer[]): void {
  const groupedOffers: Offer[][] = [];
  for (let i = 0; i < offersList.length; i += 6) {
    groupedOffers.push(offersList.slice(i, i + 6));
  }

  groupedOffers.forEach((group) => {
    group.sort((a, b) => {
      const aVisited = visitedOffers.value[a.id] ? Number(visitedOffers.value[a.id]) : 0;
      const bVisited = visitedOffers.value[b.id] ? Number(visitedOffers.value[b.id]) : 0;

      const timeComparison = aVisited - bVisited;
      if (timeComparison !== 0) {
        return timeComparison;
      }

      return offersList.indexOf(a) - offersList.indexOf(b);
    });
  });

  offers.value = groupedOffers.flat();
}
</script>

<template>
  <div class="flex flex-col gap-7 py-7 px-0 min-h-[calc(100vh_-_100px)] pb-52">
    <div v-if="type">
      <ins :id="formatPlaceId(adsfinPlaces.over)"></ins>
    </div>

    <div class="flex flex-col gap-7 items-center w-full max-w-7xl mx-auto px-4 md:px-0">
      <div class="flex flex-col items-center mb-7 text-center">
        <h2 v-if="fullNameString" class="mb-6 text-xl font-bold text-gray-800">
          {{ fullNameString }}
        </h2>
        <h3 v-if="fullNameString && savedCalculations.amount" class="text-base">
          Вам предварительно одобрено
          <span class="font-bold text-red-500">{{ loanAmountFormatted }} &#8381;</span>
        </h3>
        <h3 v-else-if="!fullNameString && savedCalculations.amount" class="text-base">
          Вам предварительно одобрено
          <span class="font-bold text-red-500">{{ loanAmountFormatted }} &#8381;</span>
        </h3>
      </div>
      <p class="text-base text-gray-700">
        Для получения денег подайте заявки в следующие компании:
      </p>

      <p v-if="$config[currentDomain]">
        **{{ $config[currentDomain].type }} {{ $config[currentDomain].legalEntity }}**,
        <br>
        ОГРНИП
        **{{ $config[currentDomain].individualEntrepreneurNumber }}**,
        <br>
        ИНН
        **{{ $config[currentDomain].inn }}**
      </p>
    </div>

    <ul class="flex flex-col gap-7 w-full max-w-7xl mx-auto px-4 md:px-0">
      <li v-if="offers.slice(0, 6).length > 0">
        <p class="ml-0 md:ml-12 mb-3 text-lg font-bold text-gray-800">Выгодные условия</p>
        <div>
          <CompanyCardWrapper
              :data="offers.slice(0, 6)"
              :slide_vitrina="false"
              :with_ad="false"
          />
        </div>
      </li>

      <div>
        <ins :id="formatPlaceId(adsfinPlaces.top)"></ins>
      </div>

      <li v-if="offers.slice(6, 12).length > 0">
        <p class="ml-0 md:ml-12 mb-3 text-lg font-bold text-gray-800">Онлайн-займ на карту</p>
        <div>
          <CompanyCardWrapper
              :data="offers.slice(6, 12)"
              :slide_vitrina="false"
              :with_ad="false"
          />
        </div>
      </li>

      <li v-if="offers.slice(12, 18).length > 0">
        <p class="ml-0 md:ml-12 mb-3 text-lg font-bold text-gray-800">Только паспорт</p>
        <div>
          <CompanyCardWrapper
              :data="offers.slice(12, 18)"
              :slide_vitrina="false"
              :with_ad="true"
          />
        </div>
      </li>

      <div>
        <ins :id="formatPlaceId(adsfinPlaces.center)"></ins>
      </div>

      <LinksSocialNetworks />
    </ul>
  </div>
</template>

<style scoped>
/* Styles here */
</style>