<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import NotFoundView from '@/views/NotFoundView.vue';

const route = useRoute();
const slug = route.params.slug;
const produto = ref({});
const isLoading = ref(true);
const fichas = ref([]);
const isError = ref(false);

const updatePageTitle = (produto) => {
  document.title = `${produto.produto} | PromoTech`;
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/produtos/${slug}`);
    if (response.data) {
      produto.value = response.data;
      updatePageTitle(produto.value);
      const fichasResponse = await axios.get(`/api/fichas/${produto.value.id}`);
      if (fichasResponse.data) {
        fichas.value = fichasResponse.data;
      }
    } else {
      isError.value = true; 
    }
  } catch (error) {
    console.error('Error fetching produto', error);
    isError.value = true; 
  } finally {
    isLoading.value = false;
  }
});

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).trim();
};

const precoOriginal = (value) => value / 0.9;

const precoParcelado = (value) => precoOriginal(value) / 12;
</script>

<template>
  <section class="flex flex-col w-full h-full max-w-[1240px] m-auto mt-[100px] mb-[50px] px-[20px]">
    <RouterLink class="flex items-center justify-center w-fit cursor-pointer" to="/">
      <font-awesome-icon icon="chevron-left" class="text-[30px] text-primary-color"/>
      <span class="text-[24px] font-bold ml-[8px]">Voltar</span>
    </RouterLink>
    <div v-if="!isLoading && !isError">
      <div class="flex mt-[40px] gap-[40px] flex-col media768:flex-row">
        <div class="min-w-[440px] bg-[#F7F8F8] flex items-center justify-center rounded-[5px]">
          <img :src="produto.imagem2" :alt="produto.produto" class="flex w-[440px] mix-blend-darken p-[10px] object-contain">
        </div>
        <div>
          <h2 class="text-[26px]">{{ produto.produto }}</h2>
          <p class="text-[36px] font-[600] my-[10px]">{{ formatoDinheiro(produto.valor) }}</p>
          <p class="text-[16px] text-[#565959]">À vista no Pix e boleto (10% off)</p>
          <p class="text-[18px] text-[#565959]">ou em até 12x de {{ formatoDinheiro(precoParcelado(produto.valor)) }} sem juros</p>
          <!--
            <button class="bg-primary-color text-[white] p-[10px] px-[20px] mt-[15px] rounded-[9999px] text-[20px] font-[600] hover:bg-[#025177] transition-colors duration-200">Comprar</button>
          -->
        </div>
      </div>
      <div class="mt-[40px]">
        <h3 class="font-[500] text-[24px] border-b-[4px] border-primary-color w-fit">Descrição</h3>
        <p class="mt-[20px] text-[18px]">O menor preço encontrado no Brasil para {{ produto.produto }} atualmente é {{ formatoDinheiro(produto.valor) }}.</p>
        <p v-if="produto.descricao" class="text-[18px] mt-[14px]">{{ produto.descricao }}</p>
        <h3 class="font-[500] text-[24px] mt-[15px] border-b-[4px] border-primary-color w-fit">Detalhes Técnicos</h3>
        <table v-for="ficha in fichas" :key="ficha.id" class="mt-[24px] text-[18px] w-full media600:w-[60%] border-[2px] border-primary-color rounded-[5px]">
          <tbody class="rounded-[5px]">
            <tr class="border-b-[2px] border-primary-color" v-for="(value, key) in ficha.dados" :key="key">
              <th class="text-start font-normal py-[10px] px-[15px] border-r-[2px] border-primary-color bg-[#bcd5e1]">{{ key }}</th>
              <td class="py-[10px] px-[15px] border-l-[2px] border-primary-color">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="isError">
      <NotFoundView /> 
    </div>
  </section>
</template>