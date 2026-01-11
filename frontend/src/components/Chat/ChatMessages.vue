<template>
     <div class="flex flex-col p-4 gap-4">
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
    </div>
</template>

<script setup>
import apiClient from '@/api/apiClient';
import ChatBubble from '@/components/Chat/Message/ChatBubble.vue'
import { authState } from '@/store/authStore';
import { onMounted } from 'vue';

onMounted(async () => {
    await authState.authPromise
    const { result, error } = await apiClient.get('/conversation')

    console.log(result)
    console.log(error)
})


//** todo
// 1. wyświetlić instrukcje, jeżeli nie rozpoczęto konwersacji */
// 2. Załaduj konwersacje
</script>