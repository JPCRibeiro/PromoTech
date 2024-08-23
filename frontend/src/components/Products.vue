<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import ProductsPagination from "./ProductsPagination.vue";

const produtos = ref([]);
const itemsPerPage = 12;
const currentPage = ref(localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 1);

onMounted(async () => {
  try {
    const response = await axios.get("/api/produtos");
    produtos.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error);
  }
});

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).trim();
};

const precoOriginal = (value) => value / 0.9;

const precoParcelado = (value) => precoOriginal(value) / 12;

const totalPages = computed(() => 
  Math.ceil(produtos.value.length / itemsPerPage)
);

const paginatedProdutos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return produtos.value.slice(start, end);
});

const updatePage = (page) => {
  currentPage.value = page;
  localStorage.setItem("currentPage", currentPage.value);
};
</script>

<template>
  <section class="max-w-[1240px] m-[0_auto] p-[20px] mt-[20px]">
    <h2 class="text-[40px] font-[600] text-center">Nossos Produtos</h2>
    <hr class="w-[11%] border-[2px] border-primary-color m-auto" />
    <div class="flex flex-wrap justify-center mt-[40px] gap-[10px]">
      <RouterLink v-for="produto in paginatedProdutos" :key="produto.id" :to="`/produto/${produto.slug}`" class="relative bg-white w-[265px] rounded-[4px] hover:cursor-pointer border-[1px] border-[#f5f5f5]">
        <div>
          <div class="w-full h-[190px] relative flex items-center justify-center bg-[#F7F8F8] rounded-[3px]">
            <img :src="produto.imagem" :alt="produto.produto" :title="produto.produto" class="object-contain absolute w-full h-full mix-blend-darken p-[10px]"/>
          </div>
          <div class="flex flex-col gap-[12px] py-[22px] px-[16px]">
            <h2 class="text-[#0f1111] text-[18px] line-clamp-2">
              {{ produto.produto }}
            </h2>
            <div>
              <div class="flex items-baseline gap-[5px]">
                <span class="text-[22px] font-[600]">{{ formatoDinheiro(produto.valor) }}</span>
                <span class="relative text-[#565959] after:border-t-[1px] after:border-t-[#565959] after:absolute after:content-[''] after:top-[47%] after:right-0 after:left-0">{{ formatoDinheiro(precoOriginal(produto.valor)) }}</span>
              </div>
              <p class="text-[14px] text-[#565959]">
                À vista no Pix ou em até 12x de
                {{ formatoDinheiro(precoParcelado(produto.valor)) }} sem juros
              </p>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
    <ProductsPagination :currentPage="currentPage" :totalPages="totalPages" :updatePage="updatePage"/>
  </section>
</template>
