<template>
  <div
    class="flex flex-row"  
  >
    <input 
      type="text" 
      v-model="messageInput" 
      placeholder="Wpisz wiadomość..." 
      @keyup.enter="handleSendMessage"
      class="h-full flex-1 bg-gray-300 p-4 text-gray-950 rounded-l-md !rounded-t-none inset-shadow-2xs outline-0 focus:shadow-xs"
    />
    <button 
      @click="handleSendMessage"
      class="bg-indigo-500 rounded-r-md h-full w-32 cursor-pointer hover:bg-indigo-500 !rounded-t-none"
    >
      Wyślij
    </button>
  </div>
</template>

<script setup>
import { sendMessage } from '@/api/chatService';
import { ref } from 'vue';

const messageInput = ref(null)

const handleSendMessage = async () => {
  const data = await sendMessage('witaj')
}

/** todo
 * 1. Zabezpieczenie przed wysyłaniem zbyt długich zapytań (liczenie tokenów)
 * 2. Wyświetlanie błedów
 * 3. Zabezpieczenie przed wysyłaniem zbyt dużej ilości zapytań w krótkim czasie
 * 4. Oczyszczenie z danych osobowych przed wysłaniem do OpenAI
 */
</script>

<style scoped>

</style>