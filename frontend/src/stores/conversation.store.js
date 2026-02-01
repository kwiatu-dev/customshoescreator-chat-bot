import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/apiClient'
import { authState } from '@/stores/authStore.js'

export const useConversationStore = defineStore('conversation', () => {
  const sessionId = ref(null)
  const messages = ref([])
  const isLoaded = ref(false)
  const isLoading = ref(false)

  const loadConversation = async () => {
    if (isLoaded.value) return

    await authState.authPromise

    const response = await apiClient.get('/conversation')

    if (response.error) {
      return
    }

    sessionId.value = response.result.session_id

    setMessages(response.result.messages)

    isLoaded.value = true
  }

  const deleteConversation = async () => {
    await apiClient.delete('/conversation')
  }

  const resetConversation = async () => {
    await deleteConversation()

    sessionId.value = null
    messages.value = []
    isLoaded.value = false

    await loadConversation()
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
    loadConversationOnce: loadConversation,
    addUserMessage,
    addAssistantMessage,
    sendMessage,
    resetConversation,
    deleteConversation,
  }
})
