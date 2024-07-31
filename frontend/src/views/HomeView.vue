<script setup>
import Hero from '@/components/Hero.vue';
import Products from '@/components/Products.vue';
import Slider from '@/components/Slider.vue';
import { onMounted } from 'vue';

const updatePageTitle = () => {
  document.title = 'PromoTech | Venda de Eletrônicos';
};

onMounted(() => {
  updatePageTitle()
})
</script>

<template>
  <Hero/>
  <Slider/>
  <Products/>
</template>