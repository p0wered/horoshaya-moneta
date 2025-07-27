<script setup lang="ts">
  import {onMounted} from "vue";
  import {saveQueryToCookie, useInactivityTimer, useUtmSource} from "@/utils/common.ts";
  import Footer from "@/components/Footer/Footer.vue";
  import {useRoute} from "vue-router";
  import Header from "@/components/Header/Header.vue";

  // TODO Редирект верификации без lead_id

  const route = useRoute();

  useInactivityTimer();

  onMounted(() => {
    saveQueryToCookie();
    useUtmSource();
  })
</script>

<template>
  <Header/>
  <RouterView/>
  <Footer :short="route.name !== 'Home'"/>
</template>
