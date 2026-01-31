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
import { requestAuth } from '@/utils/requestAuth';
import { debounce } from 'lodash';
import { ref } from 'vue';
import { redirectToRoute } from '@/utils/redirectToRoute';
import { sendDataToPrefill } from '@/utils/sendDataToPrefill';

const DEBOUNCE_TIME = 5000

const messageInput = ref(`Dodaj projekt personalizacji butów o tytule 'Ślubne' przypisz go do realizacji przez test2@example.com dla klienta wkonieczny@example.com. Projekt rozpocznę w przyszłym tygodniu i będę go realizować około 3 tygodnie. Koszt wializacji 50 zł oraz koszt zlecenia 500 zł. Klient prosił o dodanie grawerunku na podeszwie.`)
const errorStatus = ref(null)
const errorMessage = ref(null)

const conversationStore = useConversationStore()

// const handleSendMessage = async () => {
//   await redirectToRoute('projects.create', null)
//   const test = await sendDataToPrefill({ title: 'test', type_id: 1, created_by_user_id: 1, client_id: 1 })
// }

const handleArtifact = async (artifact) => {
  if (!artifact) return
  if (!Array.isArray(artifact.actions)) return

  for (const action of artifact.actions) {
    if (action === 'REDIRECT_TO_ROUTE') {
      await redirectToRoute(artifact.payload.redirect.route, artifact.payload.redirect.params)
    } else if (action === 'PREFILL_FORM') {
      await sendDataToPrefill(artifact.payload.prefill_with_data)
    }
  }
}

const handleSendMessage = debounce(
  async () => {
    const { result, error } = await conversationStore.sendMessage(messageInput.value)

    messageInput.value = null
    errorStatus.value = error?.status
    errorMessage.value = error?.message
      
    await handleArtifact(result?.artifact)
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