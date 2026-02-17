<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { OrderService } from '@/services/OrderService';
import axios from 'axios';
import InputField from '@/components/inputField.vue';
import { faPix } from '@fortawesome/free-brands-svg-icons';

const orderService = new OrderService();
const user = inject('user');
const router = useRouter();
const cepData = ref({})
const selectedPayment = ref('');
const compraRealizada = ref(false)

const formData = ref({
  cepInput: '',
  cepNumeroInput: '',
  complementoInput: '',
  ccNumeroInput: '',
  ccNomeInput: '',
  ccCvvInput: '',
});
const inputErrors = ref({
  cepErro: '',
  cepNumeroErro: '',
  selectedPaymentErro: '',
  ccNumeroErro: '',
  ccNomeErro: '',
  ccCvvErro: '',
});

const order = computed(() => orderService.getOrder());

const handleDecrease = (item) => {
  if (item.quantity > 1) {
    orderService.changeQuantity(order.value.products ? order.value.products.indexOf(item) : 0, item.quantity - 1);
  }
};

const handleIncrease = (item) => {
  orderService.changeQuantity(order.value.products ? order.value.products.indexOf(item) : 0, item.quantity + 1);
  if (item.quantity === 5) {
    return
  }
};

const precoOriginal = (value) => (value / 0.9).toFixed(2);

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).trim();
};

const updatePageTitle = () => {
  document.title = 'Compra | PromoTech';
};

const getCep = async () => {
  if (cepData.value.cep && cepData.value.cep === formData.value.cepInput) {
    return;
  }

  if (formData.value.cepInput !== '') {
    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${formData.value.cepInput}`)
      if (response.data) {
        cepData.value = {
          cep: response.data.cep,
          state: response.data.state,
          city: response.data.city,
          neighborhood: response.data.neighborhood,
          street: response.data.street,
          service: response.data.service,
        };
        inputErrors.value.cepErro = ''
      } 
    } catch (error) {
      if (error.response.data) {
        inputErrors.value.cepErro = 'CEP inválido'
      }
    }
  } 
};

const finalizarPedido = async () => {
  let produtos;

  if (Array.isArray(order.value.products)) {
    produtos = order.value.products.map(item => ({
      id: item.product.id,
      quantidade: item.quantity,
      valor: selectedPayment.value === 'cartao' ? precoOriginal(item.product.valor) : item.product.valor,
    }));
  } else {
    produtos = [{
      id: order.value.product.id,
      quantidade: order.value.quantity,
      valor: selectedPayment.value === 'cartao' ? precoOriginal(order.value.product.valor) : order.value.product.valor,
    }];
  }

  const pedido = {
    email: user.value.email,
    produtos: produtos,
  };

  if (!formData.value.cepInput) {
    inputErrors.value.cepErro = 'CEP inválido'
  } else {
    inputErrors.value.cepErro = ''
  }

  if (!formData.value.cepNumeroInput) {
    inputErrors.value.cepNumeroErro = 'Preencha o campo acima'
  } else {
    inputErrors.value.cepNumeroErro = ''
  }

  if (!selectedPayment.value) {
    inputErrors.value.selectedPaymentErro = 'método não selecionado'
  } else {
    inputErrors.value.selectedPaymentErro = ''
  }
  
  if (selectedPayment.value === 'cartao' && !formData.value.ccNumeroInput) {
    inputErrors.value.ccNumeroErro = 'Preencha o campo acima'
  } else {
    inputErrors.value.ccNumeroErro = ''
  }

  if (selectedPayment.value === 'cartao' && !formData.value.ccNomeInput) {
    inputErrors.value.ccNomeErro = 'Preencha o campo acima'
  } else {
    inputErrors.value.ccNomeErro = ''
  }

  if (selectedPayment.value === 'cartao' && !formData.value.ccCvvInput) {
    inputErrors.value.ccCvvErro = 'Preencha o campo acima'
  } else {
    inputErrors.value.ccCvvErro = ''
  }
  
  if (inputErrors.value.selectedPaymentErro || inputErrors.value.cepErro || inputErrors.value.ccNumeroErro || inputErrors.value.ccNomeErro || inputErrors.value.ccCvvErro) {
    return;
  } else {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/order', pedido)
      if (response.status === 201) {
        compraRealizada.value = true
      }
    } catch (error) {
      console.log('Erro ao finalizar o pedido:', error)
    }
  }
}

onMounted(() => {
  if (!order.value) {
    router.replace('/');
  }
  updatePageTitle()
});
</script>

<template>
  <section class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div v-if="compraRealizada === false">
      <div class="flex gap-[32px] max-media1024:flex-col mb-[60px]"> 
        <div class="flex-1">
          <div class="pb-[16px] border-b-[1px] border-b-[#DDD]">
            <h2 class="text-[28px] font-[700] flex justify-between leading-[24px]">Finalizar Compra</h2>
          </div>
          <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[16px] mb-[8px] pb-[8px] border-b-[3px] border-b-primary-color w-fit">Produtos</h2>
          <div v-if="order && order.product" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px] ">
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
            <div v-for="item in order.products" :key="item.product.id" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px] border-b-[1px] border-b-[#DDD] last:border-none">
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
            <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[20px] mb-[8px] pb-[8px] border-b-[3px] border-b-primary-color w-fit">Endereço de Entrega</h2>
            <div class="flex flex-col pt-[16px]">
              <InputField :focusout="getCep" id="cep" v-model:title="formData.cepInput" label="CEP" type="number" :error="inputErrors.cepErro" :isCheckoutPage="true"/>
              <InputField id="endereco" v-model:title="cepData.street" label="Endereço" type="text" :isCheckoutPage="true" :disabled="true"/>
              <InputField id="numero" v-model:title="formData.cepNumeroInput" label="Número" type="number" :error="inputErrors.cepNumeroErro" :isCheckoutPage="true"/>
              <InputField id="complemento" v-model:title="formData.complementoInput" label="Complemento" type="text" :isCheckoutPage="true"/>
              <InputField id="bairro" v-model:title="cepData.neighborhood" label="Bairro" type="text" :isCheckoutPage="true" :disabled="true"/>
              <InputField id="cidade" v-model:title="cepData.city" label="Cidade" type="text" :isCheckoutPage="true" :disabled="true"/>
              <InputField id="estado" v-model:title="cepData.state" label="Estado" type="text" :isCheckoutPage="true" :disabled="true"/>
            </div>
          </div>
          <div>
            <h2 class="text-[24px] font-[700] flex justify-between leading-[24px] mt-[30px] mb-[16px] pb-[8px] border-b-[3px] border-b-primary-color w-fit">Método de Pagamento</h2>
            <div class="flex flex-col gap-[12px]">
              <div>
                <div :class="['flex items-center justify-between border-[#777777] p-[12px] cursor-pointer', selectedPayment === 'pix' ? 'border-b-none border-x-[1px] border-t-[1px] rounded-ee-[0px] rounded-ss-[8px] rounded-se-[8px]' : 'border-[1px] rounded-[8px]']" @click="selectedPayment = 'pix'">
                  <div class="flex items-center gap-[10px]">
                    <input type="radio" id="pix" v-model="selectedPayment" name="pagamento" value="pix" class="w-[20px] h-[20px] cursor-pointer"/>
                    <label for="pix" class="font-[500] cursor-pointer text-[#777777]">PIX</label>
                  </div>
                  <font-awesome-icon :icon="faPix" class="text-[#777777] text-[20px]"/>
                </div>
                <div :class="['overflow-hidden max-h-0 transition-[max-height] duration-200 ease-out', selectedPayment === 'pix' ? 'max-h-[80px] border-[1px] border-[#777777] rounded-ss-[0px] rounded-se-[0px] rounded-[8px]' : 'max-h-0']">
                  <p class="p-[12px]">Até 10% de desconto com aprovação imediata que torna a expedição mais rápida do pedido.</p>
                </div>
              </div>
              <div>
                <div :class="['flex items-center justify-between border-[#777777] p-[12px] cursor-pointer', selectedPayment === 'cartao' ? 'border-b-none border-x-[1px] border-t-[1px] rounded-ee-[0px] rounded-ss-[8px] rounded-se-[8px]' : 'border-[1px] rounded-[8px]']" @click="selectedPayment = 'cartao'">
                  <div class="flex items-center gap-[10px]">
                    <input type="radio" id="cartao" v-model="selectedPayment" name="pagamento" value="cartao" class="w-[20px] h-[20px] cursor-pointer"/>
                    <label for="cartao" class="font-[500] cursor-pointer text-[#777777]">Cartão de Crédito</label>
                  </div>
                  <font-awesome-icon icon="credit-card" class="text-[#777777] text-[20px]"/>
                </div>
                <div :class="['overflow-hidden max-h-0 transition-[max-height] duration-200 ease-out', selectedPayment === 'cartao' ? 'max-h-[400px] border-[1px] border-[#777777] rounded-ss-[0px] rounded-se-[0px] rounded-[8px]' : 'max-h-0']">
                  <div class="p-[16px_12px_16px]">
                    <InputField id="numeroCartao" v-model:title="formData.ccNumeroInput" type="number" label="Número do cartão" :error="inputErrors.ccNumeroErro" :isCheckoutPage="true"/>
                    <InputField id="nomeCartao" v-model:title="formData.ccNomeInput" type="text" label="Nome no cartão" :error="inputErrors.ccNomeErro" :isCheckoutPage="true"/>
                    <InputField id="cvv" v-model:title="formData.ccCvvInput" type="number" label="CVV" :error="inputErrors.ccCvvErro" :isCheckoutPage="true"/>
                  </div>
                </div>
                <div v-if="inputErrors.selectedPaymentErro && !selectedPayment" class="text-[red] mt-[6px] text-[14px] font-[600]">
                  <font-awesome-icon icon="exclamation" class="text-[red] mr-[5px] text-[16px]"/>
                  Selecione um pagamento
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-[0_4_300px] relative">
          <div class="fixed w-[300px]">
            <div class="pb-[16px]">
              <h2 class="text-[28px] font-[700] leading-[24px]">Resumo</h2>
            </div>
            <div class="flex flex-col">
              <p class="flex justify-between py-[14px] border-y-[1px] border-y-[#DDD]">
                Frete:<span class="font-bold">Grátis</span>
              </p>
              <p class="flex justify-between py-[14px]">
                Total: <span class="font-bold">{{ formatoDinheiro(order.totalPrice) }}</span>
              </p>
              <button @click="finalizarPedido" class="bg-primary-color text-white w-full p-[7px] rounded-[99px] font-[600] flex justify-center">Finalizar pedido</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="max-w-[1240px] w-full mx-auto p-[20px]">
      <div class="mt-[100px] flex flex-col justify-center items-center">
        <p class="text-[28px] font-bold text-center">
          Compra realizada
        </p>
        <RouterLink to="/compras" class="text-white bg-primary-color hover:bg-[#012957] rounded-[999px] px-6 py-3 mt-4 font-[600] transition-[200ms]"> 
          Ver sua compra
        </RouterLink>
      </div>
    </div>
  </section>
  <section class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
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