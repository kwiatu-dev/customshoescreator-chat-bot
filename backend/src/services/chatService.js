import { agent } from '../llms/gpt/agent.js'
import dayjs from 'dayjs'
import { MAIN_PROMPT } from '../llms/prompts/main_prompt.js'
import { createMemory } from '../llms/memory/memory.js'

export const chat = async (sessionId, message, signal, user = null) => {
  const memory = createMemory(sessionId)
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
    { output: result.answer } //zastanowic sie czy zapisac tools_cools i inne parametry do bazy danych
  )

  return result
}

const formatUserData = (user) => ({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
})

const processMessages = (messages) => {
  if (!messages) return;
  if (!Array.isArray(messages) || messages.length === 0) return;

  const answer = getAnswer(messages)
  const artifacts = getArtifacts(messages)

  return { answer, artifact: artifacts.pop() }
}

const getAnswer = (messages) => {
  const lastMessage = messages[messages.length - 1];

  return lastMessage.content ?? null;
}

const getArtifacts = (messages) => {
  const artifacts = []

  for (const message of messages) {
    const artifact = message?.artifact

    if (artifact) {
      artifacts.push(artifact)
    }
  }

  return artifacts
}


