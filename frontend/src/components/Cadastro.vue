<script setup>
import { ref } from 'vue';
import axios from 'axios';
import inputField from './inputField.vue';

const registered = ref(false);
const formData = ref({
  username: '',
  email: '',
  password: '',
});
const inputErrors = ref({
  username: '',
  email: '',
  password: '',
});
const inputChecks = ref({
  username: false,
  email: false,
  password: false,
});

const validateEmail = (email) => {
  const regex = /[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
  return regex.test(String(email).toLowerCase());
};

const handleSubmit = async () => {
  if (!formData.value.username) {
    inputErrors.value.username = 'Informe um nome de usuário';
    inputChecks.value.username = false;
  } else {
    inputErrors.value.username = '';
    inputChecks.value.username = true;
  }

  if (!formData.value.email || !validateEmail(formData.value.email)) {
    inputErrors.value.email = 'Digite um e-mail válido';
    inputChecks.value.email = false;
  } else {
    inputErrors.value.email = '';
    inputChecks.value.email = true;
  }

  if (!formData.value.password) {
    inputErrors.value.password = 'A senha é obrigatória';
    inputChecks.value.password = false;
  } else {
    inputErrors.value.password = '';
    inputChecks.value.password = true;
  }

  if (inputErrors.value.username || inputErrors.value.email || inputErrors.value.password) {
    return;
  } else {
      try {
        await axios.post('/api/registro', {
          username: formData.value.username,
          email: formData.value.email,
          password: formData.value.password
        });
        registered.value = true;
      } catch (error) {
        const errors = error.response.data.error;
        
        if (errors.includes('Email já cadastrado')) {
            inputErrors.value.email = 'Email já cadastrado';
        }
        if (errors.includes('Nome de usuário já cadastrado')) {
            inputErrors.value.username = 'Nome de usuário já cadastrado';
        }
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
    <div v-if="!registered" class="w-full">
      <form @submit.prevent="handleSubmit" class="w-[450px] max-media480:w-full m-auto border-[1px] p-[20px] shadow-lg rounded-lg border-t-4 border-t-primary-color">
        <h2 class="relative text-[28px] font-[500] mb-[30px] w-fit after:absolute after:content-[''] after:left-0 after:bottom-0 after:w-[50%] after:border-[2px] after:border-primary-color">Criar Conta</h2>
        <inputField id="username" v-model:title="formData.username" label="Nome de usuário" :error="inputErrors.username" :check="inputChecks.username" type="text" autocomplete="autocomplete" :isRegisterPage="true"/>
        <inputField id="email" v-model:title="formData.email" label="E-mail" :error="inputErrors.email" :check="inputChecks.email" type="text" autocomplete="autocomplete" :isRegisterPage="true"/>
        <inputField id="password" v-model:title="formData.password" label="Senha" :error="inputErrors.password" :check="inputChecks.password" type="password" :isRegisterPage="true"/>
        <button type="submit" class="py-[10px] px-[20px] mt-[10px] rounded-[999px] bg-primary-color text-[white] w-full mb-[10px]">Criar</button>
      </form>
      <div class="mt-[40px] text-center">
        Já possui uma conta?
        <RouterLink to="/login" class="text-primary-color hover:underline font-[500]">
          Fazer login
        </RouterLink>
      </div>
    </div>
    <div v-if="registered" class="text-center">
      <p class="text-primary-color font-[600] text-[32px]">
        Conta cadastrada com sucesso!
      </p>
      <div class="text-[24px] mt-[20px]">
        Vá para a página de <RouterLink to="/login" class="underline text-primary-color font-[500]">Login</RouterLink> para entrar com sua conta.
      </div>
    </div>
    <div class="mt-[40px] w-full h-[44px] bg-[linear-gradient(to_bottom,_rgba(0,_0,_0,_.14),_rgba(0,_0,_0,_.03)_3px,_transparent)] after:bg-[linear-gradient(to_right,_#fff,_rgba(255,_255,_255,_0),_#fff)] after:content-[''] after:w-full after:h-[44px] after:block"></div>
    <p class="text-[#555] text-[13px]">© 2024 PromoTech - Todos os direitos reservados</p>
  </section>
</template>