import { ChatOpenAI } from '@langchain/openai'

export const CHAT_MODEL = 'gpt-4'
export const CHAT_TIMEOUT = 30000;
export const MAX_TOKENS = 200;

export const gpt = new ChatOpenAI({
  model: CHAT_MODEL,
  streaming: false,
  temperature: 0,
})