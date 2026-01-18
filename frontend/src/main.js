import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupPostMessageListener } from './utils/postMessageListener'
import { setupFontawesome } from './utils/setupFontawesome'
import ChatWidget from '@/components/Chat/ChatWidget.vue'

createApp(ChatWidget)
  .use(createPinia())
  .use(setupFontawesome)
  .use(setupPostMessageListener)
  .mount('#app')
