<script setup>
import { CartService } from '@/services/CartService';
import { OrderService } from '@/services/OrderService';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const cartService = new CartService();
const orderService = new OrderService();
const router = useRouter();
const cart = computed(() => cartService.getCart());

const handleRemove = (cartItem) => {
  cartService.removeFromCart(cartItem.product.id);
};

const handleDecrease = (cartItem) => {
  if (cartItem.quantity > 1) {
    cartService.changeQuantity(cartItem.product.id, cartItem.quantity - 1);
  }
};

const handleIncrease = (cartItem) => {
  cartService.changeQuantity(cartItem.product.id, cartItem.quantity + 1);
  if (cartItem.quantity === 5) {
    return
  }
};

const precoOriginal = (value) => value / 0.9;

const formatoDinheiro = (value) => {
  value = parseFloat(value);
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).trim();
};

const fecharPedido = () => {
  const cartItems = cartService.getCart();
  if (cartItems.items.length) {
    orderService.saveOrder(cartItems); 
    router.push('/checkout'); 
  } else {
    console.error('O carrinho está vazio!');
  }
};

const updatePageTitle = () => {
  document.title = 'Carrinho | PromoTech';
};

onMounted(() => {
  updatePageTitle()
})
</script>

<template>
  <section class="max-w-[1240px] w-full mx-auto p-[20px] mt-[100px]">
    <div v-if="cart.items.length" class="flex gap-[32px] max-media1024:flex-col">
      <div class="flex-1">
        <div class="pb-[16px]">
          <h2 class="text-[28px] font-[700] flex justify-between leading-[24px]">Carrinho</h2>
        </div>
        <div v-for="item in cart.items" :key="item.product.id" class="grid grid-cols-[150px_2fr_1fr] gap-[16px] py-[16px] border-t-[1px] border-t-[#DDD]">
          <RouterLink :to="`/produto/${item.product.slug}`" class="flex">
            <img :src="item.product.imagem" :alt="item.product.produto" class="object-contain"/>
          </RouterLink>
          <div class="flex flex-col gap-[8px]">
            <RouterLink :to="`/produto/${item.product.slug}`" class="flex h-fit w-fit hover:underline">
              <h2 class="font-bold">{{ item.product.produto }}</h2>
            </RouterLink>
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
                <div class="font-bold max-w-[40px] text-center w-full">
                  {{ item.quantity }}
                </div>
                <button @click="handleIncrease(item)" :disabled="item.quantity === 5" class="disabled:opacity-50">
                  <font-awesome-icon icon="chevron-right" class="text-primary-color"/>
                </button>
              </div>
              <div @click="handleRemove(item)" class="text-[red] font-[600] cursor-pointer flex items-center gap-[6px]">
                <svg width="12" viewBox="0 0 24 32" fill="none" xmlns="https://www.w3.org/2000/svg" class="IconTrash"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.6154 4H22.1538C23.2615 4 24 4.8 24 6V8H0V6C0 4.8 0.923077 4 1.84615 4H7.38462C7.75385 1.8 9.78461 0 12 0C14.2154 0 16.2462 1.8 16.6154 4ZM9.23077 4H14.7692C14.4 2.8 13.1077 2 12 2C10.8923 2 9.6 2.8 9.23077 4ZM1.84615 10H22.1538L20.4923 30.2C20.4923 31.2 19.5692 32 18.6462 32H5.35385C4.43077 32 3.69231 31.2 3.50769 30.2L1.84615 10Z" fill="#e72626"></path></svg>
                <span class="mt-[2px]">Remover</span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <p class="font-bold">{{ formatoDinheiro((item.product.valor * item.quantity)) }}</p> 
            </div> 
          </div>   
        </div>
      </div>
      <div class="flex-[0_4_300px]">
        <div class="pb-[16px]">
          <h2 class="text-[28px] font-[700] leading-[24px]">Subtotal</h2>
        </div>
        <div class="flex flex-col">
          <p class="flex justify-between border-t-[1px] border-t-[#DDD] py-[14px]">
            Valor total: 
            <span class="font-bold">{{ formatoDinheiro(cart.totalPrice) }}</span>
          </p>
          <button @click="fecharPedido" class="bg-primary-color text-white w-full p-[7px] rounded-[99px] font-[600] flex justify-center">Continuar</button>
        </div>
      </div>
    </div>
    <div v-else class="mt-[100px] flex flex-col justify-center items-center">
      <p class="text-[28px] font-bold text-center">
        Seu carrinho está vazio.
      </p>
      <RouterLink to="/" class="text-white bg-primary-color hover:bg-[#012957] rounded-[999px] px-6 py-3 mt-4 font-[600] transition-[200ms]">
        Continuar comprando
      </RouterLink>
    </div>
  </section>
</template>