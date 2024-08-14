<script setup>
import Slider from '@/components/Slider.vue';
import Products from '@/components/Products.vue';
import Promotion from '@/components/Promotion.vue';
import { onMounted } from 'vue';
import Carousel from '@/components/Carousel.vue';

const updatePageTitle = () => {
  document.title = 'PromoTech | Venda de Eletrônicos';
};

onMounted(() => {
  updatePageTitle()
})
</script>

<template>
  <Carousel/>
  <Slider/>
  <Promotion/>
  <Products/>
</template>