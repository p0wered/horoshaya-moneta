<script lang="ts" setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { sendMetrika, getCookie, setCookie } from '@/utils/common'; // Импортируем getCookie и setCookie

import IconCheckCompany from '@/icons/IconCheckCompany.vue';

// Типизация Offer (повторяем, т.к. это отдельный компонент)
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

// Типизация пропсов
interface CompanyCardProps {
  data: Offer; // Ожидаем один объект Offer
  slide_vitrina: boolean;
}

const props = defineProps<CompanyCardProps>();

const store = useStore();
// Получаем offers из хранилища Vuex
const offers = computed<Offer[]>(() => store.getters.getOffers);


const redirectToLink = (event: MouseEvent) => { // Типизируем event
  sendMetrika('offer_redirect');

  const currentOfferData = props.data;
  const existingCookie = getCookie('visitedOffers');
  const visitedOffers: Record<string, number> = existingCookie ? JSON.parse(existingCookie) : {};
  visitedOffers[currentOfferData.id] = new Date().getTime();
  setCookie('visitedOffers', JSON.stringify(visitedOffers), 7);

  // Важно: 'offers.value' уже является плоским массивом из родительского компонента.
  // Перегруппировка здесь не имеет смысла, если основной список уже плоский.
  // Если же offers.value должен быть изначально сгруппирован по 6, то нужно пересмотреть.
  // Предполагаем, что offers.value - это плоский массив, который надо отсортировать,
  // чтобы просмотренные офферы ушли в конец.
  // Эта логика сортировки просмотренных офферов была в родительском компоненте (YourMainApplyPage).
  // Если вы хотите, чтобы она происходила после каждого клика, то текущая реализация
  // приведет к пересортировке всего списка офферов в хранилище.

  // Вместо повторной группировки, просто отсортируем текущий список offers
  // и обновим его в сторе.

  // Получаем текущие офферы из стора
  const currentOffers = [...offers.value]; // Копируем, чтобы не мутировать напрямую

  // Создаем новую логику сортировки на основе visitedOffers
  currentOffers.sort((a, b) => {
    const aVisited = visitedOffers[a.id] ? Number(visitedOffers[a.id]) : 0;
    const bVisited = visitedOffers[b.id] ? Number(visitedOffers[b.id]) : 0;

    const timeComparison = aVisited - bVisited;
    if (timeComparison !== 0) {
      return timeComparison;
    }
    // Сохраняем изначальный порядок для не посещенных, если есть
    // Но для этого нужно знать их изначальный индекс, что усложняет.
    // Если просто двигаем посещенные в конец, достаточно timeComparison.
    return 0; // Сохраняем относительный порядок, если времена посещения одинаковы
  });

  store.commit('setOffers', currentOffers); // Обновляем отсортированный список в сторе

  event.preventDefault(); // Предотвращаем стандартный переход по ссылке
  window.open(props.data.link, '_blank'); // Открываем ссылку в новой вкладке
};

function getDeclension(value: string | number): string { // Типизируем value
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (numValue % 10 === 1 && numValue % 100 !== 11) {
    return 'дня';
  } else {
    return 'дней';
  }
}

function isOfferVisited(): boolean { // Типизируем возвращаемое значение
  const currentOfferData = props.data;
  const existingCookie = getCookie('visitedOffers');
  const visitedOffers: Record<string, number> = existingCookie ? JSON.parse(existingCookie) : {};
  return visitedOffers[currentOfferData.id] !== undefined;
}
</script>

<template>
  <li class="company-card__element">
    <a class="company-card__logo" :href="props.data.link" target="_blank" @click="redirectToLink">
      <img :src="props.data.logo" :alt="props.data.name" class="company-card__img"/>
    </a>
    <div class="company-card__list">
      <p class="company-card__text">
        Процентная ставка
        <span class="company-card__text_bold">{{ props.data.percentage }}%</span>
      </p>
      <p class="company-card__text">
        До <span class="company-card__text_bold">{{ props.data.max_loan }} &#8381;</span>
      </p>
      <p class="company-card__text">
        Срок до <span class="company-card__text_bold">{{ props.data.loan_length_max }} {{ getDeclension(props.data.loan_length_max) }}</span>
      </p>
    </div>

    <button v-if="isOfferVisited() && !props.slide_vitrina" class="company-card__button company-card__button_checked">
      <IconCheckCompany class="company-card__icon" />
      Просмотрено
    </button>

    <a v-else class="company-card__button" :href="props.data.link" target="_blank" @click="redirectToLink">Получить деньги</a>
  </li>
</template>

<style scoped>
.company-card {
  width: 100%; /* Убедимся, что это относится к контейнеру, а не к отдельной карточке */
}
/* Стили для скролла, вероятно, относятся к CompanyCardWrapper, не к отдельной карточке */
/* .company-card::-webkit-scrollbar { display: none; } */
/* .company-card__scroll-container { ... } */

.company-card__element {
  display: flex;
  flex-direction: column;
  gap: 19px;
  max-width: 260px; /* Установил max-width для отдельной карточки */
  padding: 0.625rem 0.75rem;
  border: 1px solid #E6E6E6;
  border-radius: 8px;
}
.company-card__element_router {
  gap: 0;
}
.company-card__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 230px; /* Фиксированная ширина списка внутри карточки */
  text-align: center;
  text-wrap: nowrap;
}
.company-card__logo {
  height: 70px;
  max-width: 247px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none; /* Убираем подчеркивание для ссылки-логотипа */
}
.company-card__img {
  max-height: 70px;
  max-width: 230px;
}
.company-card__list_router {
  margin: 63px 0;
}
.company-card__text {
  text-align: center;
  color: #000;
}
.company-card__text_bold {
  font-weight: 700;
}
.company-card__text_bold_router {
  color: var(--secondary-primary);
  text-align: center;
  width: 240px;
}
.company-card__button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 54px;
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  background-color: var(--light);
  border: 1px solid var(--secondary-light);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none; /* Важно для <a> */
}
.company-card__button_checked {
  background-color: #e1eee5;
  border: 1px solid #bfdcc9;
  color: #333;
}
.company-card__button_router {
  color: #fff;
  border: none;
  background-color: var(--primary);
}
.company-card__icon {
  margin-right: 8px;
}
@media screen and (max-width: 740px) {
  /* Эти стили, вероятно, должны применяться к CompanyCardWrapper, а не к каждой карточке */
  /* .company-card { ... } */
  /* .company-card__scroll-container { ... } */

  .company-card__element {
    max-width: none; /* Убираем max-width, чтобы элемент мог быть шире на мобильных */
    width: 100%; /* Занимает всю ширину контейнера */
  }
}
.company-card__button:hover {
  opacity: 0.8;
}
</style>
