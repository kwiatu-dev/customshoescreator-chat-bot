<template>
     <div class="flex flex-col p-4 gap-4" v-if="conversationStore.messages.length > 0">
        <ChatBubble v-for="(message, index) in conversationStore.messages" :key="index"
            :type="message.type"
            :time="message.created_at"
            :message="message.content"
            status="Delivered"
        />
        <ChatBubble v-if="conversationStore.isLoading"
            type="ai"
            :time="new Date()"
            message="Wczytuję odpowiedź..."
            status="Pending"
        />
    </div>
    <div v-else class="flex flex-col p-4 gap-4 text-gray-800">
        <ChatBubble 
            type="ai" 
            :time="new Date()" 
            message="Cześć! Jestem Asystentem AI. Jak mogę Ci pomóc?" 
            status="Delivered"/>
    </div>
</template>

<script setup>
import ChatBubble from '@/components/Chat/Message/ChatBubble.vue'
import { useConversationStore } from '@/stores/conversation.store.js'
import { onMounted } from 'vue';

const conversationStore = useConversationStore()

onMounted(async () => {
    conversationStore.loadConversationOnce()
})
</script>