<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const email = ref();
const emailError = ref('');
const password = ref('');
const passwordError = ref('');
const message = ref('')
const router = useRouter();

const validateEmail = (email) => {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
  return regex.test(String(email).toLowerCase());
};

const login = async () => {
  if (!email.value || !validateEmail(email.value)) {
    emailError.value = 'Digite um e-mail válido';
  } else {
    emailError.value = '';
  }

  if (!password.value) {
    passwordError.value = 'A senha é obrigatória';
  } else {
    passwordError.value = '';
  }

  if (emailError.value || passwordError.value) {
    return;
  }

  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', response.data.token)
    const token = localStorage.getItem('token');
    console.log(token)
    router.push('/').then(() => {
      location.reload();
    });
  } catch (err) {
    message.value = err.response.data.error;
    console.log(message.value)
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
    <form @submit.prevent="login" class="w-[400px] max-media480:w-full m-auto border-[1px] p-[20px] shadow-lg rounded-lg border-t-4 border-t-primary-color">
      <h2 class="relative text-[28px] font-[500] mb-[30px] w-fit after:absolute after:content-[''] after:left-0 after:bottom-0 after:w-[50%] after:border-[2px] after:border-primary-color">Fazer Login</h2>
      <div class="mb-[20px]">
        <div class="input-box">
          <font-awesome-icon icon="user"/>
          <input id="email" v-model="email" type="text" autocomplete="email" placeholder="" :class="['border-[1px]', 
            { 'border-red-500': emailError, 'border-[#DEE0E4]': !emailError }]"/>
          <label for="email">E-mail</label>
        </div>
        <div v-if="emailError" class="text-red-500 mt-[6px] text-[14px]">{{ emailError }}</div>
      </div>
      <div class="mb-[20px]">
        <div class="input-box">
          <font-awesome-icon icon="lock"/>
          <input id="password" v-model="password" type="password" placeholder="" :class="['border-[1px]', 
            { 'border-[red]': passwordError, 'border-[#DEE0E4]': !passwordError }]" />
          <label for="password">Senha</label>
        </div>
        <div v-if="passwordError" class="text-[red] mt-[6px] text-[14px]">{{ passwordError }}</div>
      </div>
      <button type="submit" class="p-[10px_20px] rounded-[999px] bg-primary-color text-[white] w-full mb-[10px]">Entrar</button>
    </form>
    <div class="mt-[40px] text-center">
      Ainda não possui uma conta?
      <RouterLink to="/cadastro" class="text-primary-color hover:underline font-[500]">
        Criar Agora
      </RouterLink>
    </div>
    <div class="mt-[40px] w-full h-[44px] bg-[linear-gradient(to_bottom,_rgba(0,_0,_0,_.14),_rgba(0,_0,_0,_.03)_3px,_transparent)] after:bg-[linear-gradient(to_right,_#fff,_rgba(255,_255,_255,_0),_#fff)] after:content-[''] after:w-full after:h-[44px] after:block"></div>
    <p class="text-[#555] text-[13px]">© 2024 PromoTech - Todos os direitos reservados</p>
  </section>
</template>