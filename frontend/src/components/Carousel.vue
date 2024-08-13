<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import img1 from '../assets/images/background1.jpg'
import img2 from '../assets/images/background2.png'
import img3 from '../assets/images/background3.jpeg'
import img4 from '../assets/images/background4.png'
import img5 from '../assets/images/background5.jpg'
import img6 from '../assets/images/background6.jpg'

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
  img6
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
      
      <div class="visible z-10 max-h-[250px] w-[80px] absolute top-0 h-full left-0">
        <button @click="handlePrevClick(); setIsUserInteracting(true)" class="absolute inset-0 outline-none rounded-[5px] bg-none border-none cursor-pointer">
          <i class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-no-repeat bg-[url('../../assets/slide.png')] bg-[length:68px_52px] w-[34px] h-[52px] outline-none"></i>
        </button>
      </div>

      <ol ref="sliderRef" class="transition-all duration-[250ms] ease-out flex flex-shrink-0 h-full relative" @transitionend="handleTransitionEnd">
        <li v-for="(image, index) in images" :key="index" class="relative h-full flex">
          <img :width="width" :src="image" class="object-cover object-center"/>
        </li>
      </ol>

      <div class="visible z-10 max-h-[250px] w-[80px] absolute top-0 h-full right-0">
        <button @click="handleNextClick(); setIsUserInteracting(true)" class="absolute inset-0 outline-none rounded-[5px] bg-none border-none cursor-pointer">
          <i class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-no-repeat bg-[url('../../assets/slide.png')] bg-[length:68px_52px] w-[34px] h-[52px] outline-none"></i>
        </button>
      </div>

    </div>
  </div>
</template>