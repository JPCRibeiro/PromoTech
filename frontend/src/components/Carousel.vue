<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import img1 from '../assets/images/background1.jpg'
import img2 from '../assets/images/background2.png'
import img3 from '../assets/images/background3.jpg'
import img4 from '../assets/images/background4.png'
import img5 from '../assets/images/background5.jpg'
import img6 from '../assets/images/background6.jpg'
import img7 from '../assets/images/background7.jpg'

const sliderRef = ref(null);
const carouselRef = ref(null);
const direction = ref(-1);
const width = ref(window.innerWidth);
const isUserInteracting = ref(false);

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7
];

const setDirection = (dir) => {
  direction.value = dir;
};

const setIsUserInteracting = (status) => {
  isUserInteracting.value = status;
};

const handlePrevClick = () => {
  if (direction.value === -1) {
    sliderRef.value.appendChild(sliderRef.value.firstElementChild);
    setDirection(1);
  }
  carouselRef.value.style.justifyContent = 'flex-end';
  sliderRef.value.style.transform = `translate(${width.value}px)`;
};

const handleNextClick = () => {
  if (!carouselRef.value || !sliderRef.value) {
    return;
  }
  
  if (direction.value === 1) {
    sliderRef.value.prepend(sliderRef.value.lastElementChild);
    setDirection(-1);
  }

  carouselRef.value.style.justifyContent = 'flex-start';
  sliderRef.value.style.transform = `translate(${-width.value}px)`;
};

const handleTransitionEnd = (event) => {
  if (event.propertyName !== 'transform') return;

  if (direction.value === -1) {
    sliderRef.value.appendChild(sliderRef.value.firstElementChild);
  } else if (direction.value === 1) {
    sliderRef.value.prepend(sliderRef.value.lastElementChild);
  }

  sliderRef.value.style.transition = 'none';
  sliderRef.value.style.transform = 'translate(0)';
  setTimeout(() => {
    sliderRef.value.style.transition = 'all 250ms ease-out 0s';
  });
};

const handleResize = () => {
  if (!sliderRef.value) {
    return;
  }

  sliderRef.value.style.transition = 'none';
  width.value = window.innerWidth;

  if (direction.value === -1) {
    sliderRef.value.style.transform = 'translate(0)';
  } else {
    sliderRef.value.prepend(sliderRef.value.lastElementChild);
    setDirection(-1);
    sliderRef.value.style.transform = 'translate(0)';
  }

  setTimeout(() => {
    sliderRef.value.style.transition = '250ms ease-out';
  }, 0);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);

  const interval = setInterval(() => {
    if (!isUserInteracting.value) {
      handleNextClick();
    }
  }, 5000);

  onBeforeMount(() => {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<template>
  <div class="mt-[70px] w-full relative z-0">
    <div class="h-[400px] w-full flex justify-start overflow-hidden relative" ref="carouselRef">
      <div class="w-full h-full absolute top-0 left-0 bg-[linear-gradient(to_right,rgb(0_0_0/40%),rgba(0,0,0,0),rgb(0_0_0/40%))]"></div>
      <ol ref="sliderRef" class="transition-all duration-[250ms] ease-out flex flex-shrink-0 h-full relative z-[-1]" @transitionend="handleTransitionEnd">
        <li v-for="(image, index) in images" :key="index" class="relative h-full flex">
          <img :width="width" :src="image" class="object-cover object-center"/>
        </li>
      </ol>
      <button class="absolute top-[50%] left-[3%] transform -translate-x-[3%] -translate-y-[50%] rounded-[100%] w-[32px] h-[32px] bg-primary-color flex items-center justify-center">
        <font-awesome-icon @click="handlePrevClick(); setIsUserInteracting(true)" icon="circle-chevron-left" class="text-white hover:text-[#C2D2E6] transition-[200ms] text-[40px] rounded-[100%] shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px]"/>
      </button>
      <button class="absolute top-[50%] right-[3%] transform -translate-x-[3%] -translate-y-[50%] rounded-[100%] w-[32px] h-[32px] bg-primary-color flex items-center justify-center">
        <font-awesome-icon @click="handleNextClick(); setIsUserInteracting(true)" icon="circle-chevron-right" class="text-white hover:text-[#C2D2E6] transition-[200ms] text-[40px] rounded-[100%] shadow-[rgba(0,_0,_0,_0.16)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.12)_0px_2px_10px_0px]"/>
      </button>
    </div>
  </div>
</template>