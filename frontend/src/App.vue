<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from './components/Footer.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, onMounted, provide, ref } from 'vue';
import axios from 'axios';

const route = useRoute();
const hideLayout = computed(() => route.meta.hideLayout);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);

provide('user', user);

const userLogged = async () => {
  try {
    const response = await axios.get('http://produtos-ambiente-env-1.eba-njrz2a2f.sa-east-1.elasticbeanstalk.com/api/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    user.value = response.data;
    localStorage.setItem('user', JSON.stringify(user.value));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      user.value = null;
    }
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    userLogged();
  } else {
    localStorage.removeItem('user');
    user.value = null;
  }
});
</script>

<template>
    <Navbar v-if="!hideLayout"/>
    <RouterView/>
    <Footer v-if="!hideLayout"/>
</template>