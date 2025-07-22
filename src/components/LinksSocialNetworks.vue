<script lang="ts" setup></script>
<template>
    <div class="tg_block margin-top-40">
        <div>Не подошли условия?</div>
<!--        <a href="https://t.me/zaym_help_bot" target="_blank"-->
<!--            class="tg_link tg_border">-->
<!--            <div style="position: relative;">-->
<!--                <img class="tg_logo" src="/src/icons/tg_logo.svg" />-->
<!--            </div>-->
<!--            <div class="tg_text">Займ через Telegram</div>-->
<!--        </a>-->

<!--        <a href="https://vk.me/finsos" target="_blank" class="tg_link vk_border">-->
<!--            <img class="tg_logo" src="/src/icons/vk_logo.svg" />-->
<!--            <div class="vk_text">Займ через Вконтакте</div>-->
<!--        </a>-->
    </div>
</template>
<style scoped>
.tg_link,
.tg_block {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
}

.tg_block {
    justify-content: center;
}

.tg_link {
    justify-content: flex-start;
}

.tg_border,
.vk_border {
    width: 250px;
    height: 65px;
    padding: 10px;
    border-radius: 16px;
}

.tg_border {
    border: 1px solid #0bb0ff;
}

.vk_border {
    border: 1px solid #0077FF;
}

.tg_logo {
    width: 40px;
    height: 40px;
}

.tg_text {
    color: #0bb0ff;
}

.vk_text {
    color: #0077FF;
}

.margin-top-40 {
    margin-top: 40px;
}

@media screen and (max-width: 700px) {
    .tg_block {
        flex-direction: column;
        gap: 10px;
    }
}

@media screen and (max-width: 1130px) {
    .tg_block {
        align-self: normal !important;
    }
}
</style>