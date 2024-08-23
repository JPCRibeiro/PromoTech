<script setup>
import axios from 'axios';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { CartService } from '@/services/CartService';
import { OrderService } from '@/services/OrderService';

const cartService = new CartService();
const orderService = new OrderService();
const router = useRouter();
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

const comprarProduto = () => {
  orderService.saveOrder(produto.value, true);
  router.push('/checkout'); 
};

const adicionarAoCarrinho = () => {
  cartService.addToCart(produto.value);
  router.push('/carrinho');
};
</script>

<template>
  <section class="flex flex-col w-full h-full max-w-[1240px] mx-auto mt-[100px] mb-[50px] px-[20px]">
    <RouterLink class="flex items-center justify-center w-fit cursor-pointer" to="/">
      <font-awesome-icon icon="chevron-left" class="text-[30px] text-primary-color"/>
      <span class="text-[24px] font-bold ml-[8px]">Voltar</span>
    </RouterLink>
    <div v-if="!isLoading && !isError">
      <div class="flex mt-[40px] gap-[40px] flex-col media768:flex-row">
        <div class="min-w-[440px] max-media600:min-w-full bg-[#F7F8F8] flex items-center justify-center rounded-[5px]">
          <img :src="produto.imagem2" :alt="produto.produto" class="flex w-[440px] max-media600:w-full mix-blend-darken p-[10px] object-contain">
        </div>
        <div class="flex flex-col">
          <h2 class="text-[26px]">{{ produto.produto }}</h2>
          <p class="text-[36px] font-[600] my-[10px]">{{ formatoDinheiro(produto.valor) }}</p>
          <p class="text-[16px] text-[#565959]">À vista no Pix (10% off)</p>
          <p class="text-[18px] text-[#565959]">ou em até 12x de {{ formatoDinheiro(precoParcelado(produto.valor)) }} sem juros</p>
          <div class="flex flex-col w-full max-w-[400px]">
            <button @click="comprarProduto" class="bg-primary-color text-white hover:bg-[#093e7c] p-[10px] px-[20px] mt-[15px] rounded-[9999px] text-[20px] font-[600] transition-colors duration-200">
              Comprar agora
            </button>
            <button @click="adicionarAoCarrinho" class="text-primary-color bg-[#abc5e6] hover:bg-[#8dabd0] p-[10px] px-[20px] mt-[15px] rounded-[9999px] text-[20px] font-[600] transition-colors duration-200">
              Adicionar ao carrinho
            </button>
          </div>
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
              <th class="text-start font-normal py-[10px] px-[15px] border-r-[2px] border-primary-color bg-[#0b468b3b]">{{ key }}</th>
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