<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <header :class="['w-full h-[70px] fixed top-0 z-[999] transition-colors duration-200',
    { 'bg-primary-color': (!isActiveLink('/') || (isActiveLink('/') && isScrolled)),
      'bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0.7)_10%,_transparent)]': !isScrolled && isActiveLink('/'),
      'shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px]': (!isActiveLink('/') || (isActiveLink('/') && isScrolled))}]">
    <div class="max-w-[1240px] w-full h-full mx-auto flex items-center justify-center px-[20px]">
      <RouterLink to="/" class="text-[28px] font-bold text-[white] italic flex items-center select-none">
        PROMO
        <font-awesome-icon icon="tag" class="ml-[8px]"/>
        TECH
      </RouterLink>
    </div>
  </header>
</template>
