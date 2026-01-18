<template>
     <div class="flex flex-col p-4 gap-4">
        <!-- <ChatBubble 
            type="llm"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        />
        <ChatBubble 
            type="human"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        />
        <ChatBubble 
            type="llm"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        />
        <ChatBubble 
            type="human"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        />
        <ChatBubble 
            type="llm"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        />
        <ChatBubble 
            type="human"
            :time="new Date()"
            message="That's awesome. I think our users will really appreciate the improvements."
            status="Delivered"
        /> -->
        <div class="text-black">SessionId: {{ conversationStore.sessionId }}</div>
        <div class="text-black">
            {{ conversationStore.messages }}
        </div>
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

//** todo
// 1. wyświetlić instrukcje, jeżeli nie rozpoczęto konwersacji */
// 2. Załaduj konwersacje
</script>