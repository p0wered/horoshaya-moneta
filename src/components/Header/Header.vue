<script setup lang="ts">
import { ref } from 'vue';
import router from "@/router";
import LogoBlack from '@/assets/images/logo_black.svg';
import IconEmail from "@/assets/icons/IconEmail.vue";
import IconPhone from "@/assets/icons/IconPhone.vue";
import HeaderDropdown from "@/components/Header/HeaderDropdown.vue";

const showEmailDropdown = ref(false);
const showPhoneDropdown = ref(false);
</script>

<template>
  <header class="relative bg-white border-b-1 border-b-gray-200 max-h-[76px]">
    <div class="container flex justify-between items-center p-4">
      <img
          :src="LogoBlack"
          @click="router.push('/')"
          class="md:w-28 w-24 cursor-pointer"
          alt="Хорошая Монета"
      >

      <div class="flex md:gap-6 gap-1 md:flex-row flex-col items-end text-[13px] md:text-[16px]">
        <div
            class="relative "
            @mouseenter="showEmailDropdown = true"
            @mouseleave="showEmailDropdown = false"
        >
          <a
            class="flex gap-2.5 items-center cursor-pointer hover:text-black/70 transition"
            :href="`tel:${$config.email}`"
          >
            <p class="font-medium">
              {{ $config.email }}
            </p>
            <IconEmail/>
          </a>

          <HeaderDropdown v-show="showEmailDropdown"/>
        </div>

        <div
            class="relative"
            @mouseenter="showPhoneDropdown = true"
            @mouseleave="showPhoneDropdown = false"
        >
          <a
              class="flex gap-2.5 items-center cursor-pointer hover:text-black/70 transition"
              :href="`tel:${$config.phoneNumber}`"
          >
            <p class="font-medium">
              {{ $config.phoneNumber }}
            </p>
            <IconPhone/>
          </a>

          <HeaderDropdown v-show="showPhoneDropdown"/>
        </div>
      </div>
    </div>
  </header>
</template>