<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isScrolled = ref(false);
const props = defineProps(['user'])
const route = useRoute();
const router = useRouter();

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

const isActiveLink = (routePath) => {
  return route.path === routePath;
};

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/').then(() => {
    location.reload();
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header :class="['w-full h-[70px] fixed top-0 z-[999] transition-colors duration-200 max-media768:bg-primary-color max-media768:shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px] max-media768:bg-none',
    { 'bg-primary-color': (!isActiveLink('/') || (isActiveLink('/') && isScrolled)),
      'bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0.7)_-40%,_transparent)]': !isScrolled && isActiveLink('/'),
      'shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px]': (!isActiveLink('/') || (isActiveLink('/') && isScrolled))}]">
    <div class="max-w-[1240px] w-full h-full mx-auto flex items-center justify-between px-[20px]">
      <span class="invisible" aria-hidden="true"></span>
      <RouterLink to="/" class="text-[28px] font-bold text-white italic flex items-center select-none">
        PROMO
        <font-awesome-icon icon="tag" class="ml-[8px]"/>
        TECH
      </RouterLink>
      <div v-if="user" class="relative group">
        <div class="flex items-center gap-[10px] cursor-default">
          <span class="text-white group-hover:opacity-[0.6] duration-200">{{ user.username }}</span>
          <font-awesome-icon icon="user-astronaut" class="text-[30px] text-white group-hover:opacity-[0.6] duration-200"/>
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
      <RouterLink to="/login" v-if="!user" class="bg-white rounded-[999px] py-[6px] px-[14px] text-primary-color font-[600] hover:opacity-[0.6] transition duration-200">Login</RouterLink>
    </div>
  </header>
</template>