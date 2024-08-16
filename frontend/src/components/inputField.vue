<script setup>
const title = defineModel('title')

const props = defineProps({
  isRegisterPage: {
    type: Boolean,
    default: false
  },
  isLoginPage: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
  },
  modelValue: {
    type: String,
  },
  error: {
    type: String,
    default: ''
  },
  check: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
  },
  type: {
    type: String,
  },
  autocomplete: {
    type: String,
  },
  icon: {
    type: String
  }
});
</script>

<template>
    <div v-if="isRegisterPage" class="mb-[20px]">
      <div class="flex items-center relative">
        <div class="input-box register-input-box w-full">
          <input :id="id" v-model="title" :type="type" placeholder="" :autocomplete="autocomplete" :class="['border-[1px]', error ? 'border-[red] focus:border-[red]' : 'border-[#DEE0E4] focus:border-primary-color', check ? 'check-pad' : 'input-pad']"/>
          <label :for="id" :class="error ? 'input-error' : ''">{{ label }}</label>
        </div>
        <font-awesome-icon v-if="check" icon="check" class="text-[#21bd21] absolute right-[12px]"/>
      </div>
      <div v-if="error" class="text-[red] mt-[6px] text-[14px] font-[600]">
        <font-awesome-icon icon="exclamation" class="text-[red] mr-[5px] text-[16px]"/>
        {{ error }}
      </div>
    </div>
    <div v-if="isLoginPage" class="mb-[20px]">
      <div class="input-box login-input-box">
        <font-awesome-icon :icon="icon"/>
        <input :id="id" v-model="title" :type="type" placeholder="" :autocomplete="autocomplete" :class="['border-[1px]', error ? 'border-[red] focus:border-[red]' : 'border-[#DEE0E4] focus:border-primary-color']"/>
        <label :for="id" :class="error ? 'input-error' : ''">{{ label }}</label>
      </div>
      <div v-if="error" class="text-[red] mt-[6px] text-[14px] font-[600]">
        <font-awesome-icon icon="exclamation" class="text-[red] mr-[5px] text-[16px]"/>
        {{ error }}
      </div>
    </div>
</template>
