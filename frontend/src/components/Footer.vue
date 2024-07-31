<script setup>
import { faApplePay, faCcAmex, faCcDinersClub, faCcJcb, faCcMastercard, faCcVisa, faGooglePay, faPaypal, faPix } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <footer class="bg-[#012957] w-full mt-[auto]">
    <div class="max-w-[1240px] w-full m-auto p-[20px]">
      <div class="flex justify-center gap-[180px] mt-[20px] max-media768:flex-col max-media768:items-center max-media768:gap-[40px]">
        <div class="text-[white] max-w-[275.7px] w-fit flex flex-col gap-[10px] max-media768:text-center">
          <h2 class="text-[28px] font-bold italic flex items-center select-none max-media768:justify-center">
            PROMO
            <font-awesome-icon icon="tag" class="ml-[8px]"/>
            TECH
          </h2>
          <div>
            <p>(21) 99849-5577</p>
            <p>faleconosco@promotech.com.br</p>
          </div>
          <div>
            <p class="font-bold">Horário de atendimento:</p>
            <p>08:00 às 20:00 - Segunda a Sexta</p>
            <p>09:00 às 17:00 - Sábado</p>
          </div>
          <div class="flex gap-[5px]">
            <img src="../assets/images/android.svg" class="w-[140px] rounded-[10px]"/>
            <img src="../assets/images/apple.svg" class="w-[140px]"/>
          </div>
        </div>
        <div class="text-[white] max-w-[275.7px] w-fit flex flex-col gap-[10px] max-media768:text-center">
          <h2 class="text-[20px] font-bold">
            FORMAS DE PAGAMENTO
          </h2>
          <div class="flex gap-[20px] text-[32px] flex-wrap mt-[10px] max-media768:justify-center">
            <font-awesome-icon :icon="faCcVisa" />
            <font-awesome-icon :icon="faCcMastercard" />
            <font-awesome-icon :icon="faPix" />
            <font-awesome-icon :icon="faCcAmex" />
            <font-awesome-icon :icon="faCcJcb" />
            <font-awesome-icon :icon="faGooglePay" />
            <font-awesome-icon :icon="faCcDinersClub" />
            <font-awesome-icon :icon="faPaypal" />
            <font-awesome-icon :icon="faApplePay" />
          </div>
        </div>
      </div>
      <hr class="border-[1px] mt-[40px] mb-[20px]">
      <p class="text-center text-[white] text-[12px] uppercase">© 2024 PromoTech - Todos os direitos reservados</p>
      <a href="mailto:faleconosco@promotech.com.br" class="text-center text-[white] text-[12px] flex w-fit mx-auto">faleconosco@promotech.com.br</a>
    </div>
  </footer>
</template>