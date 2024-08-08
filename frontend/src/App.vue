<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from './components/Footer.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

const route = useRoute();
const hideLayout = computed(() => route.meta.hideLayout);
const user = ref(null)

const userLogged = async () => {
  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    user.value = response.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    userLogged();
  }
});
</script>

<template>
    <Navbar v-if="!hideLayout" :user="user"/>
    <RouterView/>
    <Footer v-if="!hideLayout" />
</template>