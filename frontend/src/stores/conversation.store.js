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

    setMessages(response.result.messages)

    isLoaded.value = true
    isLoading.value = false
  }

  const addUserMessage = (message) => {
    messages.value.push({ type: 'human', content: message, created_at: new Date().toISOString() })
  }

  const addAssistantMessage = (message) => {
    messages.value.push({ type: 'ai', content: message, created_at: new Date().toISOString() })
  }

  const sendMessage = async (message) => {
    addUserMessage(message)
    isLoading.value = true

    const response = await apiClient.post('/chat', {
        sessionId: sessionId.value,
        message: message,
    });

    isLoading.value = false

    const answer = response?.result?.answer;

    if (response.error === null) {
        addAssistantMessage(answer)
    }

    return response
  };

  const setMessages = async (conversation) => {
    if (!conversation) return []
    if (!Array.isArray(conversation)) return []

    messages.value = conversation.map(item => ({ type: item.message.type, content: item.message.content, created_at: item.created_at }));
  }

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
