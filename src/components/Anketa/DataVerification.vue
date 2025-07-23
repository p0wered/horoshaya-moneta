<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  const {leadId} = defineProps<{
    leadId: string;
  }>();

  const emit = defineEmits<{
    (e: 'verification-complete'): void;
  }>();

  const progressBarValue = ref(0);
  let intervalId: number | null = null;
  const verificationCompleteKey = 'dataVerificationCompleted';

  onMounted(() => {
    const wasCompleted = localStorage.getItem(verificationCompleteKey);
    if (wasCompleted === 'true') {
      progressBarValue.value = 100;
      emit('verification-complete');
      return;
    }

    intervalId = setInterval(() => {
      if (progressBarValue.value < 100) {
        progressBarValue.value += 1;
      } else {
        clearInterval(intervalId as number);
        intervalId = null;
        localStorage.setItem(verificationCompleteKey, 'true');
        emit('verification-complete');
      }
    }, 50);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<template>
  <div class="flex justify-between items-center mb-2">
    <h4 class="text-xl font-semibold">Проверяем ваши данные</h4>
    <p class="text-sm text-red">Ожидайте...</p>
  </div>

  <p class="text-black/50 mb-10">
    Рассмотрение заявки занимает от 10 секунд до 2-х минут. 95% наших клиентов получают одобрение
  </p>

  <div class="mb-4">
    <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
      <div
          class="progress-inner bg-red h-full"
          :style="{ width: progressBarValue + '%' }"
      />
    </div>

    <div class="flex justify-between">
      <p>Анализируем и принимаем решение</p>
      <p>{{ progressBarValue }}%</p>
    </div>
  </div>
</template>

<style scoped>
 .progress-inner{
   transition: .1s;
 }
</style>
