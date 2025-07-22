<script lang="ts" setup>
// Не нужно импортировать onMounted, если вручную не добавляем скрипты.
// import { onMounted } from 'vue'; // Удаляем, если injectAdsfinScript уже используется глобально

import CompanyCard from './CompanyCard.vue';

// Типизация пропсов для лучшей проверки
interface CompanyCardWrapperProps {
  data: Offer[]; // Используем интерфейс Offer, который определен в родительском компоненте
  slide_vitrina: boolean;
  with_ad: boolean;
  type?: string | null; // Добавляем type как проп, если он нужен для логики v-if
}

const props = defineProps<CompanyCardWrapperProps>();

// Логика Adsfin скрипта должна быть централизована в YourMainApplyPage
// или в utils/adsfin, а не дублироваться здесь.
// Если 'place_136060782102027115' должен инжектироваться здесь,
// используйте injectAdsfinScript как в YourMainApplyPage.
// import { injectAdsfinScript, formatPlaceId } from "@/utils/adsfin"; // Если нужно

// onMounted(() => {
//   // Этот код дублирует логику из YourMainApplyPage.vue, где уже вызывается injectAdsfinScript.
//   // Предполагается, что adsfinPlaces.center или подобное уже включает этот PlaceId.
//   // Если нет, то можно вызвать здесь:
//   // injectAdsfinScript('136060782102027115');
// });

// Локальный ref для элемента, если нужен прямой доступ к DOM (пока не используется)
// const listRef = ref<HTMLElement | null>(null);

</script>

<template>
  <div class="company-card">
    <div class="company-card__scroll-container">
      <CompanyCard
          v-for="(offer, index) in props.data"
          :key="offer.id || index"
          :data="offer"
          :slide_vitrina="props.slide_vitrina"
          class="company-card__element"
      />

      <div v-if="props.type && props.with_ad" class="company-card__element company-card__ad-container">
        <ins id="place_136060782102027115"></ins>
      </div>

      <div class="company-card__element company-card__element_router">
        <div class="company-card__list company-card__list_router">
          <p class="company-card__text_bold company-card__text_bold_router">
            Не нашли подходящего предложения?
          </p>
        </div>
        <a href="/offers" target="_blank" class="company-card__button company-card__button_router">
          Посмотреть другие
        </a>
      </div>
      <div>
        <div class="company-card__last-item"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-card {
  display: grid;
  place-items: center;
}

.company-card__scroll-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  max-width: 1117px;
  justify-items: start;
  /* Tailwind-подобные медиа-запросы */
  @media (max-width: 1025px) {
    max-width: 800px;
  }
  @media (max-width: 830px) {
    max-width: 500px;
  }
}

.company-card__element {
  flex: 1; /* Если используется display: flex, а не grid */
  max-width: 240px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 19px;
  padding: 0.625rem 0.75rem;
  border: 1px solid #E6E6E6;
  border-radius: 8px;
}

.company-card__element_router {
  gap: 0;
}
.company-card__list {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
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
  margin-top: 17px;
  text-decoration: none; /* Перенесено из глобальных стилей CompanyCard */
}
.company-card__button_router {
  color: #fff;
  border: none;
  background-color: var(--primary);
}
.company-card__icon {
  margin-right: 8px;
}
.company-card__slide-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: #7c8087;
  cursor: pointer;
  opacity: 0.4;
  z-index: 1;
}
.company-card__slide-button_left {
  left: 24px;
}
.company-card__slide-button_right {
  right: -20px;
}
.company-card__last-item {
  width: 38px
}
/* Стили для рекламного блока, чтобы он соответствовал остальным карточкам */
.company-card__ad-container {
  /* Возможно, нужны будут специфичные стили, чтобы реклама выглядела как карточка */
  display: flex; /* Чтобы ins мог занимать место как flex-item */
  justify-content: center;
  align-items: center;
  min-height: 200px; /* Примерная высота, чтобы реклама не "прыгала" */
  /* background-color: #f9f9f9; */ /* Для визуального обозначения */
}

@media screen and (max-width: 740px) {
  .company-block:hover .company-card__buttons {
    visibility: hidden;
  }
  .company-card__scroll-container {
    padding: 0 0.75rem; /* Если нужен паддинг на мобилках */
    display: flex; /* Снова меняем на flex для скролла */
    flex-direction: column; /* Если элементы должны идти друг под другом */
    gap: 12px; /* Убираем 14px */
    align-items: center;
    position: relative;
    /* Чтобы скрывался скроллбар */
    overflow-x: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .company-card__scroll-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .company-card__last-item {
    width: 0;
  }
  .company-card__element {
    max-width: none; /* Позволяем элементу растягиваться */
    width: 100%; /* Убедимся, что он занимает всю доступную ширину */
  }
}
.company-card__button:hover {
  opacity: 0.8;
}

/* Этот стиль лучше убрать и использовать Tailwind `no-underline` или установить в `main.css` */
/* a {
  text-decoration: none;
} */
</style>