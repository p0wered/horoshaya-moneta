<script setup lang="ts">
  import {useInactivityTimer} from "@/utils/common.ts";

  useInactivityTimer();
</script>

<template>
  <main>
    <RouterView/>
  </main>
</template>
