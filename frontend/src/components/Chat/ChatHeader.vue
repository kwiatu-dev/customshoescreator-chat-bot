<template>
    <div 
      class="relative w-full h-full
      bg-indigo-500 p-4 
      flex flex-row justify-between items-center 
      overflow-hidden"
    >
      <div 
        class="absolute inset-0 rounded-full bg-gradient-to-r 
        from-pink-500 via-indigo-500 to-blue-500
        blur-xl
        animate-gradient"
      />
      <div 
        class="flex flex-row items-center gap-2 z-10"
      >
        <div 
          class="relative w-9 h-9"
        >
          <img 
            :src="Logo" 
            class="w-full h-full rounded-full"
          />
          <div 
            class="
            w-2 h-2 bg-green-300 rounded-full 
            absolute top-0 right-0 
            border border-solid border-white"
          />
        </div>
        <div 
          class="text-lg flex flex-row items-center font-bold"
        >
          Chat
        </div>
      </div>
      <button 
        class="text-md
        w-4 h-4 p-4 rounded-full
        hover:bg-gray-50/10 
        flex flex-row justify-center items-center
        z-10" 
      >
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
      </button>
    </div>
</template>

<script setup>
import Logo from '@/images/logo.webp'
</script>