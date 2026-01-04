import { agent } from '../llms/gpt/agent.js'
import dayjs from 'dayjs'
import { MAIN_PROMPT } from '../llms/prompts/main_prompt.js'

export const chat = async (message, signal, user = null) => {
  const messages = await MAIN_PROMPT.invoke({
    chat_history: getChatHistory(),
    user_context: formatUserData(user),
    current_date: dayjs().format('YYYY-MM-DD'),
    input: message,
  })

  return await agent.invoke(
    {
      messages: messages.toChatMessages()
    },
    { signal }
  )
}

const formatUserData = (user) => {
  const data = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    is_admin: user.is_admin,
  }

  return data
}

const getChatHistory = () => {
  return []
}


