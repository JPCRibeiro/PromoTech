<script setup>
import { CartService } from '@/services/CartService';
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const user = inject('user');
const router = useRouter();
const cartService = new CartService();

const cart = computed(() => cartService.getCart());

const totalItemsInCart = computed(() => 
  cart.value.items.reduce((total, item) => total + item.quantity, 0)
);

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/').then(() => {
    location.reload();
  });
};
</script>

<template>
  <header class='w-full h-[70px] fixed top-0 z-[999] shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px] bg-primary-color'>
    <div class="max-w-[1240px] w-full h-full mx-auto flex items-center justify-between px-[20px]">
      <RouterLink to="/" class="text-[28px] font-bold text-white italic flex items-center select-none">
        PROMO
        <font-awesome-icon icon="tag" class="ml-[8px]"/>
        TECH
      </RouterLink>
      <div class="flex items-center gap-[20px]">
        <div v-if="user" class="relative group">
          <div class="flex items-center gap-[10px] cursor-default">
            <span class="text-white group-hover:opacity-[0.6] duration-200">{{ user.username }}</span>
            <font-awesome-icon icon="user-astronaut" class="text-[24px] text-white group-hover:opacity-[0.6] duration-200"/>
          </div>
          <div class="absolute top-0 right-0 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 ease-in-out group-hover:transform z-[50] min-w-[200px] transform">
            <div class="relative top-[24px] p-[12px] bg-white rounded-xl shadow-xl w-full">
              <div class="w-10 h-10 bg-white transform rotate-45 absolute top-0 right-[25%] translate-x-[25%] z-[0] translate-y-[100px] transition-transform group-hover:translate-y-[0] duration-300 ease-in-out rounded-sm"></div>
              <div class="relative z-[100] flex flex-col">
                <RouterLink to="/" class="block px-[16px] py-[8px] rounded-lg hover:bg-[#EFF4FF] transition duration-200 text-gray-800 font-semibold hover:text-[#4062e5] select-none">Meus pedidos</RouterLink>
                <RouterLink to="/" class="block px-[16px] py-[8px] rounded-lg hover:bg-[#EFF4FF] transition duration-200 text-gray-800 font-semibold hover:text-[#4062e5] select-none">Meus favoritos</RouterLink>
                <RouterLink to="/" @click="handleLogout" class="block px-[16px] py-[8px] rounded-lg hover:bg-[#EFF4FF] transition duration-200 text-gray-800 font-semibold hover:text-[#4062e5] select-none">Sair</RouterLink>
              </div>
            </div>
          </div>
        </div>
        <RouterLink to="/login" v-if="!user" class="bg-white rounded-[999px] py-[6px] px-[14px] text-primary-color font-[600] hover:opacity-[0.6] transition duration-200">
          Login
        </RouterLink>
        <RouterLink to="/carrinho" class="relative mt-[2px]">
          <span v-if="totalItemsInCart !== 0" class="absolute bg-[#abc5e6] pt-[1px] text-primary-color w-[22px] h-[22px] flex items-center justify-center rounded-[100%] text-[13px] font-[700] -top-[14px] -right-[12px] border-[2px] border-primary-color">{{ totalItemsInCart }}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg" class="IconHeaderCart" aria-hidden="true"><g><path d="M7.19975 19.2C5.8798 19.2 4.81184 20.28 4.81184 21.6C4.81184 22.92 5.8798 24 7.19975 24C8.51971 24 9.59967 22.92 9.59967 21.6C9.59967 20.28 8.51971 19.2 7.19975 19.2ZM0 0V2.4H2.39992L6.71977 11.508L5.09982 14.448C4.90783 14.784 4.79984 15.18 4.79984 15.6C4.79984 16.92 5.8798 18 7.19975 18H21.5993V15.6H7.70374C7.53574 15.6 7.40375 15.468 7.40375 15.3L7.43974 15.156L8.51971 13.2H17.4594C18.3594 13.2 19.1513 12.708 19.5593 11.964L23.8552 4.176C23.9542 3.99286 24.004 3.78718 23.9997 3.57904C23.9955 3.37089 23.9373 3.16741 23.8309 2.98847C23.7245 2.80952 23.5736 2.66124 23.3927 2.55809C23.2119 2.45495 23.0074 2.40048 22.7992 2.4H5.05183L3.92387 0H0ZM19.1993 19.2C17.8794 19.2 16.8114 20.28 16.8114 21.6C16.8114 22.92 17.8794 24 19.1993 24C20.5193 24 21.5993 22.92 21.5993 21.6C21.5993 20.28 20.5193 19.2 19.1993 19.2Z" fill="white"></path></g></svg>
        </RouterLink>
      </div>
    </div>
  </header>
</template>