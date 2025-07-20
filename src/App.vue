<script setup lang="ts">
  import {onMounted} from "vue";
  import {saveQueryToCookie, useInactivityTimer} from "@/utils/common.ts";
  import Footer from "@/components/Footer/Footer.vue";

  useInactivityTimer();

  onMounted(() => {
    saveQueryToCookie();
  })

  //TODO накинуть transition на инпуты
</script>

<template>
  <main>
    <RouterView/>
    <Footer/>
  </main>
</template>
