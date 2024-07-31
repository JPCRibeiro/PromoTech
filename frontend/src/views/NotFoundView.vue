<script setup>
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { onMounted } from 'vue';

const updatePageTitle = () => {
  document.title = 'Página não encontrada | PromoTech';
};

onMounted(() => {
  updatePageTitle();
})
</script>

<template>
  <section class="flex flex-col w-full h-full max-w-[1240px] m-auto mt-[150px] mb-[50px] px-[20px] items-center text-center">
    <font-awesome-icon :icon="faFaceFrown" class="text-[60px] mb-4"/>
    <h1 class="text-6xl font-bold mb-4">Página Não Encontrada</h1>
    <p class="text-xl mb-5">Pesquise novamente ou volte para a página inicial</p>
    <RouterLink to="/" class="text-white bg-primary-color hover:bg-[#012957] rounded-[999px] px-6 py-3 mt-4">Voltar</RouterLink>
  </section>
</template>