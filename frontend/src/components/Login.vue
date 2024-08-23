<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import InputField from './inputField.vue';

const message = ref('')
const router = useRouter();
const formData = ref({
  email: '',
  password: '',
});
const inputErrors = ref({
  email: '',
  password: '',
});

const validateEmail = (email) => {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
  return regex.test(String(email).toLowerCase());
};

const login = async () => {
  if (!formData.value.email || !validateEmail(formData.value.email)) {
    inputErrors.value.email = 'Digite um e-mail válido';
  } else {
    inputErrors.value.email = '';
  }

  if (!formData.value.password) {
    inputErrors.value.password = 'A senha é obrigatória';
  } else {
    inputErrors.value.password = '';
  }

  if (inputErrors.value.email || inputErrors.value.password) {
    return;
  } else {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', {
        email: formData.value.email,
        password: formData.value.password
      });
      localStorage.setItem('token', response.data.token)
      router.push('/').then(() => {
        location.reload();
      });
    } catch (err) {
      message.value = err.response.data.error;
    } 
  }
};
</script>

<template>
  <section class="flex flex-col w-full h-full m-auto mt-[100px] mb-[50px] px-[20px] justify-center items-center">
    <RouterLink to="/" class="text-[42px] max-media480:text-[32px] font-bold text-primary-color italic flex items-center select-none w-fit mb-[20px]">
      PROMO
      <font-awesome-icon icon="tag" class="ml-[8px]"/>
      TECH
    </RouterLink>
    <form @submit.prevent="login" class="w-[450px] max-media480:w-full m-auto border-[1px] p-[20px] shadow-lg rounded-lg border-t-4 border-t-primary-color">
      <h2 class="relative text-[28px] font-[500] mb-[30px] w-fit after:absolute after:content-[''] after:left-0 after:bottom-0 after:w-[50%] after:border-[2px] after:border-primary-color">Fazer Login</h2>
      <InputField id="email" label="E-mail" v-model:title="formData.email" :error="inputErrors.email" type="text" autocomplete="email" :isLoginPage="true" icon="user"/>
      <InputField id="password" label="Senha" v-model:title="formData.password" :error="inputErrors.password" type="password" autocomplete="current-password" :isLoginPage="true" icon="lock"/>
      <button type="submit" class="py-[10px] px-[20px] mt-[10px] rounded-[999px] bg-primary-color text-[white] w-full mb-[10px]">Entrar</button>
    </form>
    <div class="mt-[40px] text-center">
      Ainda não possui uma conta?
      <RouterLink to="/cadastro" class="text-primary-color hover:underline font-[500]">
        Crie Agora
      </RouterLink>
    </div>
    <div class="mt-[40px] w-full h-[44px] bg-[linear-gradient(to_bottom,_rgba(0,_0,_0,_.14),_rgba(0,_0,_0,_.03)_3px,_transparent)] after:bg-[linear-gradient(to_right,_#fff,_rgba(255,_255,_255,_0),_#fff)] after:content-[''] after:w-full after:h-[44px] after:block"></div>
    <p class="text-[#555] text-[13px]">© 2024 PromoTech - Todos os direitos reservados</p>
  </section>
</template>