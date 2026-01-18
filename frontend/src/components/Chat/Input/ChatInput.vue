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
import { useConversationStore } from '@/stores/conversation.store.js'
import { redirectToRoute } from '@/utils/redirectToRoute';
import { requestAuth } from '@/utils/requestAuth';
import { sendDataToPrefill } from '@/utils/sendDataToPrefill';
import { debounce } from 'lodash';
import { ref } from 'vue';

const DEBOUNCE_TIME = 5000

const messageInput = ref(`Dodaj projekt o tytule 'Ślubne' przypisz go do realizacji przez test2@example.com dla klienta wkonieczny@example.com. Projekt jest do zrealizowania do przyszłego miesiąca. Biorąc pod uwagę, że będzie realizowany około 3 tygodnie ustaw odpowiednią datę rozpoczęcia. Koszt wializacji 50 zł oraz koszt zlecenia 500 zł.`)
const errorStatus = ref(null)
const errorMessage = ref(null)
const isLoading = ref(null)

const conversationStore = useConversationStore()

// const handleSendMessage = async () => {
//   await redirectToRoute('projects.create', null)
//   const test = await sendDataToPrefill({ title: 'test', type_id: 1, created_by_user_id: 1, client_id: 1 })
// }

const handleSendMessage = debounce(
  async () => {
    isLoading.value = true
    const { result, error } = await conversationStore.sendMessage(messageInput.value)

    errorStatus.value = error?.status
    errorMessage.value = error?.message

    if (result)
      messageInput.value = null

    isLoading.value = false
  }, 
  DEBOUNCE_TIME,
  { leading: true, trailing: true }
);

const renewAuth = () => {
  requestAuth()
  errorMessage.value = null
  errorStatus.value = null
}

</script>

<style scoped>

</style>