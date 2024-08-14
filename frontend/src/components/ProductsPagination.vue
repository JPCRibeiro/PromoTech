<script setup>
const props = defineProps({
  currentPage: {
    type: Number
  },
  totalPages: {
    type: Number
  },
  updatePage: {
    type: Function
  }
})

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    props.updatePage(props.currentPage + 1);
  }
}

const prevPage = () => {
  if (props.currentPage > 1) {
    props.updatePage(props.currentPage - 1);
  }
}

const setPage = (page) => {
  props.updatePage(page);
}
</script>

<template>
  <div class="text-center hidden media600:block mb-[40px]">
    <div class="w-fit mx-auto mt-9 rounded-[8px] [box-shadow:0_1px_2px_0_rgba(0,_0,_0,_.1)] inline-block whitespace-nowrap">
      <button @click="prevPage" :disabled="currentPage === 1" :class="{'hover:bg-[#f5f6f6]': currentPage !== 1, 'px-4 py-2 disabled:opacity-50 border-t-[1px] border-t-[#d5d9d9] border-b-[1px] border-b-[#d5d9d9] border-l-[1px] border-l-[#d5d9d9] rounded-tl-[8px] rounded-bl-[8px] h-[48px] text-[14px] min-w-[48px]}': true}">
        <font-awesome-icon icon="chevron-left" class="text-[14px] text-[black] mr-[2px] mb-[-1px]"/>
        Anterior
      </button>
      <button v-for="page in totalPages" :key="page" @click="setPage(page)" :class="{'border-[1px] border-[black] font-[600]': currentPage === page, 'border-x-[1px] border-x-[transparent] border-t-[1px] border-t-[#d5d9d9] border-b-[1px] border-b-[#d5d9d9] hover:bg-[#f5f6f6]': currentPage !== page}" class="px-4 py-2 h-[48px] text-[14px] min-w-[48px]">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" :class="{'hover:bg-[#f5f6f6]': currentPage !== totalPages, 'px-4 py-2 border-t-[1px] border-t-[#d5d9d9] border-b-[1px] border-b-[#d5d9d9] border-r-[1px] border-r-[#d5d9d9] rounded-tr-[8px] rounded-br-[8px] h-[48px] text-[14px] min-w-[48px] disabled:opacity-50': true}">
        Próximo
        <font-awesome-icon icon="chevron-right" class="text-[14px] text-[black] ml-[2px] mb-[-1px]"/>
      </button>
    </div>
  </div>
  <div class="text-center block media600:hidden">
    <div class="w-fit mx-auto mt-9 rounded-[8px] [box-shadow:0_1px_2px_0_rgba(0,_0,_0,_.1)] flex whitespace-nowrap">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 disabled:opacity-50 border-t-[1px] border-t-[#d5d9d9] border-b-[1px] border-b-[#d5d9d9] border-l-[1px] border-l-[#d5d9d9] rounded-tl-[8px] rounded-bl-[8px] h-[48px] text-[14px] min-w-[48px]">
        <font-awesome-icon icon="chevron-left" class="text-[14px] text-[black] mr-[2px] mb-[-1px]"/>
        Anterior
      </button>
      <span class="px-4 py-2 text-[14px] w-[66px] h-[48px] flex items-center justify-center border-[1px] border-[black]">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 disabled:opacity-50 border-t-[1px] border-t-[#d5d9d9] border-b-[1px] border-b-[#d5d9d9] border-r-[1px] border-r-[#d5d9d9] rounded-tr-[8px] rounded-br-[8px] h-[48px] text-[14px] min-w-[48px]">
        Próximo
        <font-awesome-icon icon="chevron-right" class="text-[14px] text-[black] ml-[2px] mb-[-1px]"/>
      </button>
    </div>
  </div>
</template>

