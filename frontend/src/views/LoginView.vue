<script setup>
import Login from '@/components/Login.vue';
import { onMounted } from 'vue';

const updatePageTitle = () => {
  document.title = 'Login | PromoTech';
};

onMounted(() => {
  updatePageTitle()
})
</script>

<template>
  <Login/>
</template>