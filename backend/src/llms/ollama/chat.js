import { ChatOllama } from '@langchain/ollama'

export const ollama = new ChatOllama({
  model: 'gpt-oss:latest',
  temperature: 0,
})