<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from './components/Footer.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, onMounted, provide, ref } from 'vue';
import axios from 'axios';

const route = useRoute();
const hideLayout = computed(() => route.meta.hideLayout);
const user = ref(null)

provide('user', user);

const userLogged = async () => {
  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    user.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    userLogged();
  }
});
</script>

<template>
    <Navbar v-if="!hideLayout"/>
    <RouterView/>
    <Footer v-if="!hideLayout"/>
</template>