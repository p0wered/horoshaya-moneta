<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { saveQueryToCookie, useInactivityTimer, useUtmSource } from "@/utils/common.ts";
  import Footer from "@/components/Footer/Footer.vue";
  import Header from "@/components/Header/Header.vue";

  const route = useRoute();

  useInactivityTimer();

  onMounted(() => {
    window.scrollTo(0, 0);
    saveQueryToCookie();
    useUtmSource();
  })
</script>

<template>
  <Header/>
  <RouterView/>
  <Footer :short="route.name !== 'Home'"/>
</template>
