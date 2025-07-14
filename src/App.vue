<script setup lang="ts">
import {saveQueryToCookie, useInactivityTimer} from "@/utils/common.ts";
  import FooterPrimary from "@/components/FooterPrimary/FooterPrimary.vue";
  import {onMounted} from "vue";

  useInactivityTimer();

  onMounted(() => {
    saveQueryToCookie();
  })
</script>

<template>
  <main>
    <RouterView/>
    <FooterPrimary/>
  </main>
</template>
