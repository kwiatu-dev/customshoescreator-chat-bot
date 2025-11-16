import './assets/main.css'

import { createApp } from 'vue'
import { setupPostMessageListener } from './utils/postMessageListener'
import { setupFontawesome } from './utils/setupFontawesome'
import ChatWidget from '@/components/Chat/ChatWidget.vue'

createApp(ChatWidget)
  .use(setupFontawesome)
  .use(setupPostMessageListener)
  .mount('#app')
