<template>
  <div 
  class="flex flex-col justify-start"
    :class="[
      'bg-gray-100 rounded-2xl shadow-lg flex flex-col overflow-hidden text-white popup',
      show ? 'show' : 'hide'
    ]"
  >
    <div style="height: 80px;">
      <ChatHeader/>
    </div>
    <ChatMessages class="overflow-y-auto scrollbar-hidden chatbox-messages" />
    <ChatInput style="height: 64px;"/>
  </div>
</template>

<script setup>
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatMessages from '@/components/Chat/ChatMessages.vue'
import ChatInput from '@/components/Chat/Input/ChatInput.vue'

const props = defineProps({
  show: {
    required: true,
    type: Boolean,
  },
})

const close = () => {
  emit('close')
}

const emit = defineEmits(['close'])
</script>

<style scoped>
.chatbox-size {
    width: 400px;
    height: 600px;
}

.chatbox-messages {
  height: calc(100vh - 80px - 64px - 55px - 0.5rem - 40px);
}

@media (max-width: 1024px) {
  .chatbox-size {
    width: calc(100% - 2rem);
    height: 80vh;
  }


}

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

.popup {
  transform-origin: bottom right;
  opacity: 0;
  transform: scale(0);
  transition: transform 0.4s ease, opacity 0.4s ease;
  pointer-events: none;
}

.popup.show {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

.popup.hide {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
</style>