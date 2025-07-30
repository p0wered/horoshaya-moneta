<script setup lang="ts">
  import { computed, ref, nextTick, watch } from 'vue';
  import { configProxy } from "@/config.ts";
  import router from "@/router";
  import axios from 'axios'
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";

  const recurr_payments_agreement = ref('')
  const sogl_podpiska = ref('')
  const modalBody = ref<HTMLElement | null>(null);
  const scrolledToBottom = ref(false);
  const isLoading = ref(true);

  const userCredentials = {
    passportData: localStorage.getItem('passportSeriesAndNumber'),
    passportDateIssue: localStorage.getItem('passportIssueDate'),
    passportDepCode: localStorage.getItem('passportDepCode'),
    first_name: localStorage.getItem('first_name'),
    last_name: localStorage.getItem('last_name'),
    patronymic: localStorage.getItem('patronymic'),
    phone: localStorage.getItem('phone'),
  };

  const { last_name, first_name, patronymic } = userCredentials;
  const fullName = (last_name && first_name && patronymic)
      ? `${last_name} ${first_name} ${patronymic}`
      :  localStorage.getItem('full_name');

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['accept']);

  const documentStyles = `
    .info-doc { text-align: right; margin-bottom: 20px; }
    .position-right { text-align: right; }
    .position-center { text-align: center; }
    .signature-table { margin-left: auto; }
    .seal-img, .signature-img { display: inline-block; }
    .signature-text { text-align: right; }
    .info-item { margin: 2px 0; }
    .pd-date { margin: 2px 0; }
    h1 { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; }
    p { margin: 8px 0; line-height: 1.4; }
    body { font-family: Arial, sans-serif; font-size: 12px; }
  `;

  const createDocument = (content: string, title: string) => `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${documentStyles}</style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  const document1 = computed(() =>
      createDocument(recurr_payments_agreement.value, "Соглашение на рекуррентные платежи")
  );

  const document2 = computed(() =>
      createDocument(sogl_podpiska.value, "Соглашение на оформление платной подписки")
  );

  const loadDocuments = async () => {
    isLoading.value = true;
    try {
      const response = await axios.post('https://docs.infg.tech/get/render/template', {
        slug: ["sogl_podpiska", "recurr_payments_agreement"],
        sites: [configProxy.siteId],
        add_data: {
          ...userCredentials,
          full_name: fullName
        }
      });

      const { recurr_payments_agreement: recurr, sogl_podpiska: sogl } = response.data.result;
      recurr_payments_agreement.value = recurr;
      sogl_podpiska.value = sogl;
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const checkScrollPosition = () => {
    if (!modalBody.value) return;

    const { scrollTop, scrollHeight, clientHeight } = modalBody.value;
    const threshold = 10;
    scrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - threshold;
  };

  const onScroll = () => checkScrollPosition();

  const checkScrollRequirement = () => {
    nextTick(() => {
      if (modalBody.value) {
        const { scrollHeight, clientHeight } = modalBody.value;
        scrolledToBottom.value = scrollHeight <= clientHeight;
      }
    });
  };

  const handleAccept = () => {
    if (!modalBody.value) return;

    const { scrollTop, clientHeight, scrollHeight } = modalBody.value;
    const threshold = 10;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (!isAtBottom) {
      modalBody.value.scrollBy({
        top: 9999,
        behavior: 'smooth'
      });
    } else {
      emit('accept');
    }
  };

  watch(() => props.show, (newValue) => {
    if (newValue) {
      scrolledToBottom.value = false;
    }
  });

  watch(
      [recurr_payments_agreement, sogl_podpiska],
      ([val1, val2]) => {
        if (props.show && val1 && val2) {
          checkScrollRequirement();
        }
      }
  );

  watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        scrolledToBottom.value = false;
        loadDocuments();
      }
    }
  );
</script>

<template>
  <div v-if="props.show" class="modal-overlay">
    <div class="modal-container">
      <div v-if="!scrolledToBottom" class="scroll-hint-border">
        Пролистайте вниз, чтобы активировать кнопку
      </div>

      <div class="modal-body" ref="modalBody" @scroll="onScroll">
        <div v-if="isLoading" class="loading-block">
          <LoadingSpinner size="48px" color="#f91e45"/>
        </div>

        <div v-else class="documents-wrapper">
          <div class="document" v-html="document1"/>
          <div class="document" v-html="document2"/>
        </div>
      </div>

      <div class="modal-footer">
        <ButtonSecondary
          class="bg-gray-200 text-black/70 text-[14px] w-full py-4"
          :is-loading="isLoading"
          @click="router.push('/')"
          label="Отказываюсь"
        />
        <ButtonPrimary
          class="text-[14px]"
          @click="handleAccept"
          :is-loading="isLoading"
          :label="!scrolledToBottom ? 'Ознакомиться' : 'Принимаю'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(15px);
  }

  .modal-container {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 840px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .modal-header h2 {
    margin: 0;
    color: #333;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .loading-block{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .documents-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .document {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 20px;
  }

  .document :deep(h1) {
    color: black;
    margin-top: 0;
  }

  .document :deep(p) {
    color: black;
    font-size: 12px;
    line-height: 1.4;
  }

  .document :deep(strong) {
    font-weight: bold;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding: 20px;
    border-top: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    .modal-container {
      width: 95%;
      max-height: 95vh;
    }

    .modal-body,
    .modal-footer {
      padding: 15px;
    }

    .documents-wrapper {
      gap: 30px;
    }

    .document {
      padding: 15px;
    }

    .modal-footer {
      flex-direction: column;
    }
  }

  .scroll-hint-border {
    text-align: center;
    padding: 10px 15px;
    background-color: rgba(247, 30, 68, 0.25);
    color: #f71e44;
    font-size: 14px;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }
</style>