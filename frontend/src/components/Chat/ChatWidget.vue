<template>
  <div 
    class="fixed bottom-4 right-4 rounded-full 
    bg-indigo-500 text-white 
    z-50 w-14 h-14 text-2xl cursor-pointer
    transform transition-transform duration-200 hover:scale-105
    overflow-hidden
    shadow-indigo-400/80 shadow-lg"
    @click="toggleChat"
  >
    <div 
      v-if="!isOpen"
      class="absolute inset-0 -z-10 rounded-full bg-gradient-to-r 
      from-pink-500 via-indigo-500 to-blue-500
      blur-xl
      animate-gradient"
    />
    <div
      style="height: 200%;"
      class="w-full flex flex-col
            absolute left-1/2 top-0
            transform -translate-x-1/2 -translate-y-0
            transition-all duration-200 ease-in-out"
      :class="isOpen ? '!-top-full' : 'top-0'"
    >
      <div class="w-full h-1/2 flex flex-row justify-center items-center">
        <font-awesome-icon 
          :icon="['fas', 'comment-dots']" 
        />
      </div>
      <div class="w-full h-1/2 flex flex-row justify-center items-center">
        <font-awesome-icon
          :icon="['fas', 'xmark']"
        />
      </div>
    </div>
  </div>
  <ChatBox :show="isOpen" @close="toggleChat" />
</template>

<script setup>
import ChatBox from '@/components/Chat/ChatBox.vue'
import { ref } from 'vue'

const isOpen = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}
</style>
