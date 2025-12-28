<template>
  <div
    class="flex flex-row relative"  
  >
    <input 
      type="text" 
      v-model="messageInput" 
      placeholder="Wpisz wiadomość..." 
      class="h-full flex-1 bg-gray-300 p-4 text-gray-950 rounded-l-md !rounded-t-none inset-shadow-2xs outline-0 focus:shadow-xs"
    />
    <button 
      @click="handleSendMessage"
      class="bg-indigo-500 rounded-r-md h-full w-32 cursor-pointer hover:bg-indigo-500 !rounded-t-none"
    >
      Wyślij
    </button>
    <div v-if="errorMessage" 
      class="absolute text-md w-full p-2 bg-rose-300 text-white text-sm bottom-full"
    >
      {{ errorMessage }}
      <button v-if="errorStatus === 401" class="underline cursor-pointer" @click="renewAuth">Kliknij, aby odświeżyć sesje!</button>
    </div>
  </div>
</template>

<script setup>
import { sendMessage } from '@/api/chatService';
import { redirectToRoute } from '@/utils/redirectToRoute';
import { requestAuth } from '@/utils/requestAuth';
import { sendDataToPrefill } from '@/utils/sendDataToPrefill';
import { debounce } from 'lodash';
import { ref } from 'vue';

const DEBOUNCE_TIME = 5000

const messageInput = ref(null)
const errorStatus = ref(null)
const errorMessage = ref(null)
const isLoading = ref(null)

const handleSendMessage = async () => {
  await redirectToRoute('projects.create', null)
  const test = await sendDataToPrefill({ title: 'test', type_id: 1, created_by_user_id: 1, client_id: 1 })
}

// const handleSendMessage = debounce(
//   async () => {
//     isLoading.value = true
//     const { result, error } = await sendMessage(messageInput.value)

//     errorStatus.value = error?.status
//     errorMessage.value = error?.message

//     if (result)
//       messageInput.value = null

//     isLoading.value = false
//   }, 
//   DEBOUNCE_TIME,
//   { leading: true, trailing: true }
// );

const renewAuth = () => {
  requestAuth()
  errorMessage.value = null
  errorStatus.value = null
}

/** todo
 * 1. Zabezpieczenie przed wysyłaniem zbyt długich zapytań (liczenie tokenów)
 * 4. Oczyszczenie z danych osobowych przed wysłaniem do OpenAI
 */
</script>

<style scoped>

</style>