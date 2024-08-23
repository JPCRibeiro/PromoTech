<script setup>
import { computed, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const user = inject('user');
const router = useRouter();

const orders = computed(() => user.value?.orders || []);

const updatePageTitle = () => {
  document.title = 'Minhas Compras | PromoTech';
};

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).trim();
};

onMounted(() => {
  if (!user.value) {
    router.replace('/login');
  }

  updatePageTitle()
})
</script>

<template>
  <section v-if="user" class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div class="pb-[16px] border-b-[1px] border-b-[#DDD]">
      <h2 class="text-[28px] font-[700] flex justify-between leading-[24px]">Minhas Compras</h2>
    </div>
    <div v-if="orders.length === 0" class="text-center mt-[70px] text-[28px] font-bold">
      <p>Você ainda não realizou nenhuma compra.</p>
    </div>
    <div v-else>
      <div v-for="order in orders" :key="order.id">
        <h3 class="text-[20px] text-[#565959] font-[700] gap-[8px] flex justify-between leading-[24px] mt-[16px] mb-[8px] pb-[8px] border-b-[3px] border-b-primary-color w-fit">
          <p>Pedido: </p> 
          <span class="font-[500]">
            #{{ order.id }} - {{ new Date(order.created).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}
          </span>
        </h3>
        <div class="pb-[16px]">
          <div v-for="produto in order.produtos" :key="produto.produto_id" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px] border-b-[1px] border-b-[#DDD] last:border-none">
            <div class="flex items-center">
              <img :src="produto.imagem" :alt="produto.nome" class="w-[150px] h-[150px] object-contain"/>
            </div>
            <div class="flex flex-col gap-[10px]">
              <h4 class="text-[18px] font-bold">{{ produto.produto }}</h4>
              <p class="text-[14px] text-[#565959]">Quantidade: <span class="font-[600]">{{ produto.quantidade }}</span></p>
            </div>
            <div class="flex justify-end">
              <p class="text-[18px] font-bold">{{ formatoDinheiro(produto.valor * produto.quantidade) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div class="mt-[100px] flex flex-col justify-center items-center">
      <p class="text-[28px] font-bold text-center">
        Sessão expirada!
      </p>
      <RouterLink to="/login" class="text-white bg-primary-color hover:bg-[#012957] rounded-[999px] px-6 py-3 mt-4 font-[600] transition-[200ms]">
        Faça login novamente
      </RouterLink>
    </div>
  </section>
</template>