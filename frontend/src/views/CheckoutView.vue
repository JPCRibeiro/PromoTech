<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { OrderService } from '@/services/OrderService';
import axios from 'axios';
import InputField from '@/components/inputField.vue';

const orderService = new OrderService();
const user = inject('user');
const router = useRouter();
const cepInput = ref('');
const numeroInput = ref('');
const complementoInput = ref('');
const cepData = ref({})

const order = computed(() => orderService.getOrder());

const handleDecrease = (item) => {
  if (item.quantity > 1) {
    orderService.updateProductQuantity(order.value.products ? order.value.products.indexOf(item) : 0, item.quantity - 1);
  }
};

const handleIncrease = (item) => {
  orderService.updateProductQuantity(order.value.products ? order.value.products.indexOf(item) : 0, item.quantity + 1);
  if (item.quantity === 5) {
    return
  }
};

const precoOriginal = (value) => value / 0.9;

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).trim();
};

const updatePageTitle = () => {
  document.title = 'Compra | PromoTech';
};

const getCep = async () => {
  if (cepData.value.cep && cepData.value.cep === cepInput.value) {
    return;
  }

  if (cepInput.value !== '') {
    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cepInput.value}`)
      if (response.data) {
        cepData.value = {
          cep: response.data.cep,
          state: response.data.state,
          city: response.data.city,
          neighborhood: response.data.neighborhood,
          street: response.data.street,
          service: response.data.service,
        };
        console.log(cepData.value)
      } 
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
    }
  } 
};


onMounted(() => {
  if (!user.value) {
    router.replace('/login');
  } else if (!order.value) {
    router.replace('/');
  }

  updatePageTitle()
});
</script>

<template>
  <section v-if="user" class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div class="flex gap-[32px] max-media1024:flex-col"> 
      <div class="flex-1">
        <div class="pb-[16px] border-b-[1px] border-b-[#DDD]">
          <h2 class="text-[28px] font-[700] flex justify-between leading-[24px]">Finalizar Compra</h2>
        </div>
        <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[26px] pb-[16px]">Produtos</h2>
        <div v-if="order && order.product" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px]">
          <img :src="order.product.imagem" :alt="order.product.produto" class="object-contain"/>
          <div class="flex flex-col gap-[8px]">
            <h2 class="font-bold">{{ order.product.produto }}</h2>
            <div class="text-[14px] text-[#565959]">
              <p>Com desconto no PIX: <span class="font-bold">{{ formatoDinheiro(order.product.valor) }}</span></p>
              <p>Parcelado em até 12x sem juros: <span class="font-bold">{{ formatoDinheiro(precoOriginal(order.product.valor)) }}</span></p>
            </div>
          </div>
          <div class="flex h-fit justify-between gap-[8px]">
            <div class="flex flex-col gap-[8px]">
              <div class="flex w-full justify-center">
                <button @click="handleDecrease(order)" :disabled="order.quantity === 1" class="disabled:opacity-50">
                  <font-awesome-icon icon="chevron-left" class="text-primary-color"/>
                </button>
                <div class="font-bold max-w-[40px] text-center w-[40px]">
                  {{ order.quantity }}
                </div>
                <button @click="handleIncrease(order)" :disabled="order.quantity === 5" class="disabled:opacity-50">
                  <font-awesome-icon icon="chevron-right" class="text-primary-color"/>
                </button>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <p class="font-bold">{{ formatoDinheiro(order.product.valor * order.quantity) }}</p> 
            </div> 
          </div>
        </div>
        <div v-else-if="order && order.products">
          <div v-for="item in order.products" :key="item.product.id" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px]">
            <img :src="item.product.imagem" :alt="item.product.produto"/>
            <div class="flex flex-col gap-[8px]">
              <h2 class="font-bold">{{ item.product.produto }}</h2>
              <div class="text-[14px] text-[#565959]">
                <p>Com desconto no PIX: <span class="font-bold">{{ formatoDinheiro(item.product.valor) }}</span></p>
                <p>Parcelado em até 12x sem juros: <span class="font-bold">{{ formatoDinheiro(precoOriginal(item.product.valor)) }}</span></p>
              </div>
            </div>
            <div class="flex h-fit justify-between gap-[8px]">
              <div class="flex flex-col gap-[8px]">
                <div class="flex w-full justify-center">
                  <button @click="handleDecrease(item)" :disabled="item.quantity === 1" class="disabled:opacity-50">
                    <font-awesome-icon icon="chevron-left" class="text-primary-color"/>
                  </button>
                  <div class="font-bold max-w-[40px] text-center w-[40px]">
                    {{ item.quantity }}
                  </div>
                  <button @click="handleIncrease(item)" :disabled="item.quantity === 5" class="disabled:opacity-50">
                    <font-awesome-icon icon="chevron-right" class="text-primary-color"/>
                  </button>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <p class="font-bold">{{ formatoDinheiro(item.product.valor * item.quantity) }}</p> 
              </div> 
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[20px] pb-[16px]">Endereço de Entrega</h2>
          <div class="flex flex-col pt-[16px]">
            <InputField :focusout="getCep" id="cep" v-model:title="cepInput" label="CEP" type="text" :isCheckoutPage="true"/>
            <InputField id="endereco" v-model:title="cepData.street" label="Endereço" type="text" :isCheckoutPage="true" :disabled="true"/>
            <InputField id="numero" v-model:title="numeroInput" label="Número" type="text" :isCheckoutPage="true"/>
            <InputField id="complemento" v-model:title="complementoInput" label="Complemento" type="text" :isCheckoutPage="true"/>
            <InputField id="bairro" v-model:title="cepData.neighborhood" label="Bairro" type="text" :isCheckoutPage="true" :disabled="true"/>
            <InputField id="cidade" v-model:title="cepData.city" label="Cidade" type="text" :isCheckoutPage="true" :disabled="true"/>
            <InputField id="estado" v-model:title="cepData.state" label="Estado" type="text" :isCheckoutPage="true" :disabled="true"/>
          </div>
        </div>
        <div>
          <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[30px] pb-[16px]">Método de Pagamento</h2>
        </div>
      </div>
      <div class="flex-[0_4_300px]">
        <div class="pb-[16px]">
          <h2 class="text-[28px] font-[700] leading-[24px]">Resumo</h2>
        </div>
        <div class="flex flex-col">
          <p class="flex justify-between border-y-[1px] border-y-[#DDD] py-[14px]">
            Total: <span class="font-bold">{{ formatoDinheiro(order.totalPrice) }}</span>
          </p>
          <p class="flex justify-between py-[14px]">
            Frete:<span class="font-bold">Grátis</span>
          </p>
          <button class="bg-primary-color text-white w-full p-[7px] rounded-[99px] font-[600] flex justify-center">Finalizar pedido</button>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div class="mt-[100px] flex flex-col justify-center items-center">
      <p class="text-[28px] font-bold text-center">
        Sessão expirada
      </p>
      <RouterLink to="/login" class="text-white bg-primary-color hover:bg-[#012957] rounded-[999px] px-6 py-3 mt-4 font-[600] transition-[200ms]">
        Faça login novamente
      </RouterLink>
    </div>
  </section>
</template>