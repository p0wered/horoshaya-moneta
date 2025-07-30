<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';

  const props = defineProps<{
    leadId: string;
    agreementAccepted: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'verification-complete'): void;
  }>();

  const progressBarValue = ref(0);
  let intervalId: number | null = null;

  const startProgress = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      if (progressBarValue.value < 100) {
        progressBarValue.value += 1;
      } else {
        clearInterval(intervalId as number);
        intervalId = null;
        emit('verification-complete');
      }
    }, 50);
  };

  const stopProgress = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  watch(() => props.agreementAccepted, (newValue) => {
    if (newValue) {
      startProgress();
    } else {
      stopProgress();
      progressBarValue.value = 0;
    }
  });

  onMounted(() => {
    if (props.agreementAccepted) {
      startProgress();
    }
  });

  onUnmounted(() => {
    stopProgress();
  });
</script>

<template>
  <div class="flex justify-between items-center mb-2">
    <h4 class="text-xl font-semibold">Проверяем ваши данные</h4>
    <p class="text-sm text-red">{{ agreementAccepted ? 'Ожидайте...' : 'Ознакомьтесь с документами' }}</p>
  </div>

  <p class="text-black/50 mb-10">
    {{ agreementAccepted
      ? 'Рассмотрение заявки занимает от 10 секунд до 2-х минут. 95% наших клиентов получают одобрение'
      : 'Для продолжения необходимо ознакомиться и принять соглашения'
    }}
  </p>

  <div class="mb-4">
    <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
      <div
          class="progress-inner bg-red h-full"
          :style="{ width: progressBarValue + '%' }"
      />
    </div>

    <div class="flex justify-between">
      <p>{{ agreementAccepted ? 'Анализируем и принимаем решение' : 'Ожидаем принятия соглашений' }}</p>
      <p>{{ progressBarValue }}%</p>
    </div>
  </div>
</template>

<style scoped>
  .progress-inner{
    transition: .1s;
  }
</style>
