<script setup lang="ts">
  import ApplyFooterSection from "@/components/FooterHome/ApplyFooterSection.vue";
  import CreditorsList from "@/components/FooterHome/CreditorsList.vue";
  import IconFooterVisa from "@/assets/icons/IconFooterVisa.vue";
  import IconFooterMasterCard from "@/assets/icons/IconFooterMasterCard.vue";
  import IconFooterMir from "@/assets/icons/IconFooterMir.vue";
  import router from "@/router";

  const domain = window.location.origin;
</script>

<template>
  <div class="bg-black-void">
    <div class="container ">
      <footer class="mx-auto px-5 md:px-20 text-white">

        <section class="
          flex
          justify-center
          items-center
          border-b border-gray-dark
          py-10
          flex-col-reverse
          md:flex-row
          gap-8"
        >
          <div class="flex gap-4 flex-wrap justify-between">
            <button
                class="border border-gray-border-dark rounded-lg px-3 sm:px-7 py-3 text-sm cursor-pointer"
                @click="router.push('/unsubscribe')"
            >
              Отписаться от услуг
            </button>
          </div>
        </section>

        <section class="flex justify-between max-w-4xl m-auto mt-8">
          <div class="flex items-center justify-center bg-white w-[100px] h-[70px] rounded-md">
            <IconFooterVisa/>
          </div>
          <div class="flex items-center justify-center bg-white w-[100px] h-[70px] rounded-md">
            <IconFooterMasterCard/>
          </div>
          <div class="flex items-center justify-center bg-white w-[100px] h-[70px] rounded-md">
            <IconFooterMir/>
          </div>
        </section>

        <section class="
          flex
          justify-between
          items-center
          border-b border-gray-dark
          py-10
          flex-col
          md:flex-row
          gap-6
      "
        >
          <div class="text-center md:text-left">
            <p class="text-sm text-white/50">Телефон для связи</p>
            <a
              :href="`tel:${$config[domain].phoneNumber}`"
              class="
              mt-2
              text-[22px]
              bg-clip-text
              text-transparent
              bg-gradient-to-b
            from-red
            to-red-light
          ">{{ $config[domain].phoneNumber }}</a>
          </div>

          <div class="text-center md:text-right">
            <p class="text-sm text-white/50 md:text-left">E-mail</p>
            <a
              :href="`mailto:${$config[domain].email}`"
              class="
              mt-2
              text-[22px]
              bg-clip-text
              text-transparent
              bg-gradient-to-b
              from-red
              to-red-light
          ">{{ $config[domain].email }}</a>
          </div>
        </section>

        <section class="py-10 text-white/50 text-xs">
          <p>
            {{ $config[domain].type }} {{ $config[domain].legalEntity }},

            ОГРНИП
            {{ $config[domain].individualEntrepreneurNumber }},

            ИНН
            {{ $config[domain].inn }}
          </p>
          <p>Юридический адрес: {{ $config[domain].address }}</p>

          <p class="mt-4">
            {{ $config[domain].type }} {{ $config[domain].legalEntity }}

            является оператором персональных данных под номером
            {{ $config[domain].rknNumber }}

            Приказ
            {{ $config[domain].order }}.

            Выдача займов у партнеров осуществляется в российских рублях, на банковский счет, наличными или на карту,
            гражданам Российской Федерации. Сервис не относится к финансовым учреждениям, не является кредитором или банком
            и не несет ответственности за заключенные впоследствии клиентами и партерами договоры кредитования. Доступные
            суммы займов: от 5 000 рублей до 100 000 рублей. Срок займа: от 61 до 365 дней включительно, при процентной
            ставке: от 0% до 365% годовых.
          </p>

          <h4 class="font-bold mt-4">Требования к заемщику:</h4>

          <p class="mt-4">
            Возраст от 18 до 75 лет; Постоянная прописка в любом регионе РФ; Любая кредитная история.
          </p>

          <h4 class="font-bold mt-4">Условия выдачи займа:</h4>

          <p class="mt-4">
            Займы предоставляются на сумму от 5 000 до 100 000 рублей включительно на срок от 61 дня до 365 дней.
            Максимальная процентная ставка по займу составляет 1% в день, а минимальная 0%.Проценты за пользование займом
            составляют от 0 до 365 процентов годовых. Расчетная сумма (основной долг и проценты) к возврату от 20 000 до
            202 400 рублей. Условия актуальны на 03.05.2023. Пример расчета общей стоимости займа: заем на 15 000 рублей и
            сроком 10 недель: процент за весь период составят 5 000 рублей. Итого: ПСК 264,392%
          </p>

          <h4 class="font-bold mt-4">Последствия невыплаты заёмных средств:</h4>

          <p class="mt-4">
            В случае невозвращения в условленный срок суммы займа или суммы процентов за пользование заёмными средствами
            кредитор вынуждено начислит штраф за просрочку платежа. Большинство кредиторов идут на уступки и дают 3
            дополнительных рабочих дня для оплаты. Они предусмотрены на случай, к примеру, если банковский перевод занял
            больше времени, чем обычно. Однако, в случае неполучения от Вас какой-либо реакции в течение продолжительного
            времени, будет начислен штраф за просрочку срока погашения размером в среднем 0,10% от первоначальной суммы для
            займов. При несоблюдении Вами условий по погашению займов, данные о Вас могут быть переданы в реестр должников
            или БКИ, что негативно может сказаться на Вашей кредитной истории и рейтинге кредитоспособности. Задолженность
            может быть передана коллекторскому агентству для взыскания займа. При допуске просрочки продление займа
            невозможно. О всех приближающихся сроках платежа кредитор своевременно информирует Вас по СМС или электронной
            почте. Рекомендуем Вам вносить платеж в день получения данных напоминаний. Погашая задолженность в срок, Вы
            формируете хорошую кредитную историю, что повышает Ваш рейтинг кредитоспособности и шансы в дальнейшем получить
            займ на более выгодных условиях. Предложение не является оффертой. Конечные условия уточняйте при прямом общении
            с кредиторами.
          </p>

          <h4 class="font-bold mt-4">
            * У пользователей сервиса есть возможность получить займ с минимальной процентной ставкой одобренной МФО.
          </h4>

          <h4 class="font-bold mt-4">
            Подробности при выборе персонального предложения. Информация о полной стоимости займа и пример расчета:
          </h4>

          <p class="mt-4">
            Займ в размере 10 000 рублей выдан на 8 недель с пролонгацией. В году 365 дней, 0.56% в неделю (годовая ставка,
            соответственно будет равна 29.2%). Сумма процентов за год составляет 2 920 руб. (10 000*29.2% = 12 920), за 1
            неделю 56 руб. (2920/52 = 56), за 8 недель соответственно 448 руб. (8*56 = 448). Общая сумма платежа составляет
            10 488 руб. (10 000 руб. основной долг + 488 руб. проценты).
          </p>

          <h4 class="font-bold mt-4">
            ПСК (полная стоимость кредита) в процентах составляет 29.2% >
          </h4>

          <h4 class="font-bold mt-4">
            Внимание!
          </h4>

          <h4 class="font-bold mt-1">
            Услуги по договору оплачиваются в размере не более 3000 руб. в месяц. Оплата производится частями от 99 руб. до
            3000 руб. каждые 30 дней, с регулярностью попыток списания 1 раз в день. Подробная информация в указана в
            договоре. Для отказа от продления деактивируйте карту в личном кабинете сайта. Активация сервиса не гарантирует
            вам получение займа. Для отключения СМС уведомлений напишите на почту {{ $config[domain].email }}.
          </h4>

          <p class="font-bold mt-4">
            Минимальный и максимальный период погашения займа составляет от 65 дней, до 365 дней. Максимальная годовая
            процентная ставка, включающая ссудный процент, а также все остальные комиссии и расходы за год, или аналогичная
            ставка, рассчитанная соответственно местному законодательству, составляет 36% годовых. Взыскание долгов
            осуществляется посредством телефонных звонков, уведомлений по SMS и электронной почте, как Заемщика, так и
            контактного лица. Минимальный и максимальный период погашения займа составляет от 65 дней/8 недель, до 365
            дней/ 52 недель. В случае просрочки по выплатам, со следующего дня после истечения срока займа, Вам будет
            ежедневно начисляться пеня в размере 0,05 — 1% в день от суммы кредита. Также будет продолжаться ежедневное
            начисление процентов за пользование займом по договору и возможно начисление фиксированной комиссии.
          </p>

          <CreditorsList/>

          <ApplyFooterSection>
            <template #title>
          <span class="text-white/50 text-xs">
            Совершая любые действия на сайте, вы даете свое согласие на:
          </span>
            </template>

            <ul class="doc-links text-xs leading-6">
              <li>
                <a
                  href="/docs/personal-agreement"
                  target="_blank"
                  class="text-red">
                  Согласие на обработку персональных данных
                </a>
              </li>

              <li>
                <a
                  href="/docs/ad-agreement"
                  target="_blank"
                  class="text-red">
                  Соглашение о хранении учётных данных владельца карты
                </a>
              </li>

              <li>
                <a
                  href="/docs/ad-agreement"
                  target="_blank"
                  class="text-red">
                  Соглашение на применение Рекуррентных платежей
                </a>
              </li>

              <li>
                <a
                  href="/docs/ad-agreement"
                  target="_blank"
                  class="text-red">
                  Соглашение на оформление платной подписки
                </a>
              </li>
            </ul>
          </ApplyFooterSection>

          <ApplyFooterSection>
            <template #title>
          <span class="text-white/50 text-xs">
            Вы ознакомились и соглашаетесь с:
          </span>
            </template>

            <ul class="doc-links text-xs leading-6">
              <li>
                <a
                  href="/docs/pricing"
                  target="_blank"
                  class="text-red">
                  Политикой обработки персональных данных
                </a>
              </li>

              <li>
                <a
                  href="/docs/pricing"
                  target="_blank"
                  class="text-red">
                  Договором публичной оферты
                </a>
              </li>
            </ul>
          </ApplyFooterSection>
        </section>
      </footer>
    </div>
  </div>
</template>
