<template>
  <div class="flex items-start gap-2.5">
    <div class="flex flex-col gap-1 w-full">
      <div
        class="flex items-center gap-2" 
        :class="{
          'justify-end': type === 'human'
        }"
      >
        <span class="text-sm font-semibold text-gray-800">{{ name }}</span>
        <span class="text-sm font-normal text-gray-400">{{ dayjs(time).format('HH:mm') }}</span>
      </div>
      <div 
        class="flex flex-col p-4"
        :class="{
          'rounded-s-xl rounded-ee-xl bg-gray-300': type === 'human',
          'rounded-e-xl rounded-es-xl bg-indigo-500': type === 'ai'
        }"
      >
        <p 
          class="text-sm font-normal"
          :class="{
            'text-gray-50': type === 'ai',
            'text-gray-800': type === 'human' 
          }"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed } from 'vue'

const AI_NAME = 'Asystent AI'

const name = computed(() => {
  if (props.type === 'ai')
    return AI_NAME
  if (props.type === 'human') 
    return 'Ty'

  return 'Uknow'
})

const props = defineProps({
  type: {
    required: true,
    type: String,
    validator: (value) => {
      return ['human', 'ai'].includes(value)
    },
  },
  time: {
    required: true,
    type: [Date, String],
  },
  message: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
})
</script>

<style scoped>

</style>