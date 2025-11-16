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
import ChatBubble from '@/components/Chat/Message/ChatBubble.vue'


//** todo
// 1. wyświetlić instrukcje, jeżeli nie rozpoczęto konwersacji */
</script>