<script setup lang="ts">
  const {show} = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['close', 'changeTariff', 'unsubscribe']);

  const closeModal = () => {
    emit('close');
  };

  const handleChangeTariff = () => {
    emit('changeTariff');
  };

  const handleUnsubscribe = () => {
    emit('unsubscribe');
  };
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#A6A6A6" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="modal-body">
          <p class="modal-title">
            Вы уверены, что хотите отписаться? Вы можете заново активировать подписку за 299 руб.
            с базовым функционалом сервиса и получить:
          </p>
          <div class="desc-layout">
            <p class="modal-desc">Витрину с 5 займами с вероятностью одобрения 99%</p>
            <p class="modal-desc">Витрину с двумя новыми займами</p>
            <p class="modal-desc">СМС-информирование о новых предложениях</p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn primary" @click="handleChangeTariff">
              Сменить тариф
            </button>
            <button class="modal-btn secondary" @click="handleUnsubscribe">
              Да, отписаться
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal-dialog {
    position: relative;
    width: 100%;
    max-width: 530px;
    margin: 0 20px;
  }

  .modal-content {
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1;
  }

  .modal-body {
    padding: 36px 24px 24px 24px;
  }

  .modal-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: black;
    margin: 0 0 14px;
  }

  .desc-layout{
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .modal-desc{
    color: black;
    font-size: 18px;
  }

  .modal-footer {
    display: flex;
    gap: 12px;
  }

  .modal-btn {
    flex: 1;
    padding: 16px 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .modal-btn.primary {
    background-color: var(--color-red);
    color: white;
  }

  .modal-btn.primary:hover {
    background-color: var(--color-red);
    opacity: 0.8;
  }

  .modal-btn.secondary {
    background-color: #F5F5F5;
    color: black;
  }

  .modal-btn.secondary:hover {
    background-color: #E8E8E8;
  }

  @media screen and (max-width: 740px) {
    .modal-body {
      padding: 24px;
    }

    .modal-footer {
      flex-direction: column;
    }

    .modal-title {
      font-size: 16px;
      margin-bottom: 14px;
    }

    .modal-desc {
      font-size: 16px;
    }
  }
</style>