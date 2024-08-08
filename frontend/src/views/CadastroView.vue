<script setup>
import Cadastro from '@/components/Cadastro.vue';
import { onMounted } from 'vue';

const updatePageTitle = () => {
  document.title = 'Cadastro | PromoTech';
};

onMounted(() => {
  updatePageTitle()
})
</script>

<template>
  <Cadastro/>
</template>