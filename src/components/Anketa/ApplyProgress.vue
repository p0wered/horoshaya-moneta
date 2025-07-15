<script setup lang="ts">
  import { computed } from 'vue';
  import { useUtmSource } from '@/utils/utm.ts';

  interface ApplyProgress {
    step: number;
  }

  const props = defineProps<ApplyProgress>();
  const { hasUtmSource } = useUtmSource();

  const maxStep = computed(() => (hasUtmSource.value ? 2 : 3));

  const stepInfo = [
    { label: 'первый', percent: '+40%' },
    { label: 'второй', percent: '+24%' },
    { label: 'третий', percent: '+35%' },
  ];

  const currentInfo = computed(() => {
    return stepInfo[props.step - 1] ?? { label: '', percent: '' };
  });

  const fillWidth = computed(() =>
      `${((props.step / maxStep.value) * 100) - 2}%`
  );
</script>

<template>
  <div class="mb-6">
    <p class="text-black/50 text-sm mb-3">
      Шаг {{ props.step }} из {{ maxStep }}.
      Получите {{ currentInfo.percent }} к одобрению,
      заполнив {{ currentInfo.label }} шаг
    </p>
    <div class="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
      <div
        class="progress-inner bg-red h-full"
        :style="{ width: fillWidth }"
      />
    </div>
  </div>
</template>

<style scoped>
 .progress-inner {
   background-image:
       linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%,
       transparent 25%, transparent 50%,
       rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%,
       transparent 75%, transparent);
   background-size: 1rem 1rem;
 }
</style>
