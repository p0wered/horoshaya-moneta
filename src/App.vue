<script setup lang="ts">
  import { onMounted, ref} from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { saveQuery, useInactivityTimer, useUtmSource } from "@/utils/common.ts";
  import Footer from "@/components/Footer/Footer.vue";
  import Header from "@/components/Header/Header.vue";
  import PageLoading from "@/components/PageLoading.vue";
  import SubscriptionPopup from "@/components/SubscriptionPopup.vue";

  const route = useRoute();
  const router = useRouter();
  const { hasUtmSource } = useUtmSource();

  const isLoading = ref(false);
  const isPopupOpen = ref(true);

  const popupRoutes = [
    'Home',
    'Anketa',
  ];

  router.beforeEach(() => {
    isLoading.value = true;
  });

  router.afterEach((to) => {
    isLoading.value = false;

    if (popupRoutes.includes(to.name as string) && !hasUtmSource.value) {
      isPopupOpen.value = true;
    } else {
      isPopupOpen.value = false;
    }

  });

  useInactivityTimer();

  onMounted(() => {
    saveQuery();
    if (popupRoutes.includes(route.name as string) && !hasUtmSource.value) {
      isPopupOpen.value = true;
    }
  })
</script>

<template>
  <Header v-if="route.name !== 'Home'"/>

  <template v-if="isLoading">
    <PageLoading/>
  </template>

  <template v-else>
    <RouterView/>
    <SubscriptionPopup
        v-if="isPopupOpen"
        @close="isPopupOpen = false"
    />
    <Footer :short="route.name !== 'Home'"/>
  </template>
</template>