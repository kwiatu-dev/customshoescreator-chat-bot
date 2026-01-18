import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/apiClient'
import { authState } from '@/stores/authStore.js'

export const useConversationStore = defineStore('conversation', () => {
  const sessionId = ref(null)
  const messages = ref([])
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const loadConversationOnce = async () => {
    if (isLoaded.value || isLoading.value) return

    isLoading.value = true
    error.value = null

    await authState.authPromise

    const response = await apiClient.get('/conversation')

    if (response.error) {
      error.value = error
      return
    }

    sessionId.value = response.result.session_id
    messages.value = response.result.messages || []
    isLoaded.value = true
    isLoading.value = false
  }

  const addUserMessage = (message) => {
    messages.value.push({})
  }

  const addAssistantMessage = (message) => {
    messages.value.push({})
  }

  const sendMessage = async (message) => {
    const response = await apiClient.post('/chat', {
        sessionId: sessionId.value,
        message: message,
    });

    if (response.error === null) {
        //this.addUserMessage(message)
        //this.addAssistantMessage(data.reply)
    }

    return response
};

  return {
    sessionId,
    messages,
    isLoaded,
    isLoading,
    error,
    loadConversationOnce,
    addUserMessage,
    addAssistantMessage,
    sendMessage
  }
})
