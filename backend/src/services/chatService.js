import { agent } from '../llms/gpt/agent.js'
import dayjs from 'dayjs'
import { MAIN_PROMPT } from '../llms/prompts/main_prompt.js'
import { createMemory } from '../llms/memory/memory.js'

export const chat = async (message, signal, user = null) => {
  const memory = createMemory(conversationId)
  const { chat_history } = await memory.loadMemoryVariables({});

  const prompt = await MAIN_PROMPT.invoke({
    chat_history,
    user_context: formatUserData(user),
    current_date: dayjs().format('YYYY-MM-DD'),
    input: message,
  })

  const response = await agent.invoke(
    {
      messages: prompt.toChatMessages()
    },
    { signal }
  )

  const result = processMessages(response.messages)

  await memory.saveContext(
    { input: message },
    { output: result.answer }
  )

  return result
  //TODO: 
  // 1. dodać schemat przechowujacy konwersacje zgodny z langchain do bazy danych
  // 2. utworzyć tablicę przechowująca aktywną konwersacje użytkownika
  // 3. frontend wysyła conversationId
  // 4.
}

const formatUserData = (user) => ({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
})

const processMessages = (messages) => {
  if (!messages) return;
  if (!Array.isArray(messages) && !messages.length) return;

  const answer = getAnswer(messages)
  const artifacts = getArtifacts(messages)

  return { answer, artifact: artifacts.pop() }
}

const getAnswer = (messages) => {
  return messages[messages.length - 1]?.kwargs?.content
}

const getArtifacts = (messages) => {
  const artifacts = []

  for (const message of messages) {
    const kwargs = message.kwargs
    const artifact = kwargs?.artifact

    if (artifact) {
      artifacts.push(artifact)
    }
  }

  return artifacts
}


