import { agent } from '../llms/gpt/agent.js'
import dayjs from 'dayjs'
import { MAIN_PROMPT } from '../llms/prompts/main_prompt.js'
import { createChatMemory } from '../llms/memory/memory.js'
import { AIMessage, ToolMessage } from 'langchain'

export const chat = async (sessionId, message, signal, user = null) => {
  const chatMemory = createChatMemory(sessionId)
  const chatHistory = await chatMemory.getMessages();

  const prompt = await MAIN_PROMPT.invoke({
    chat_history: chatHistory,
    user_context: formatUserData(user),
    current_date: dayjs().format('YYYY-MM-DD'),
    input: message,
  })

  const chatMessages = prompt.toChatMessages();

  console.log(chatMessages.length, 'messages sent to LLM');

  try {
    const response = await agent.invoke(
      {
        messages: chatMessages
      },
      { 
        signal,
        configurable: {
          authUser: user,
        }
      }
    )

    console.log('LLM response received');

    return await processMessages(chatMemory, response.messages.slice(chatMessages.length - 1))
  }
  catch (err) {
    throw err;
  }
}

const formatUserData = (user) => ({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
})

const processMessages = async (chatMemory, messages) => {
  if (!messages) return;
  if (!Array.isArray(messages) || messages.length === 0) return;

  updateAiMessagesWithToolContent(messages);
  
  await saveContext(chatMemory, messages)

  const answer = getAnswer(messages)
  const artifact = getArtifact(messages)

  return { answer, artifact }
}

const getAnswer = (messages) => {
  const lastMessage = messages[messages.length - 1];

  return lastMessage.content;
}

const getArtifact = (messages) => {
  const lastMessage = messages[messages.length - 1];

  if (lastMessage instanceof ToolMessage) { 
    return lastMessage?.artifact;
  }

  return null
}

const saveContext = async (chatMemory, messages) => { 
  for (const message of messages) {
    await chatMemory.addMessage(message)
  }
}

const updateAiMessagesWithToolContent = (messages) => {
  for (const message of messages) {
    if (message instanceof ToolMessage) {
      const tool_call_id = message.tool_call_id;

      const aiMessage = messages.find(
        (msg) => msg instanceof AIMessage && msg.tool_calls && msg.tool_calls.some(tc => tc.id === tool_call_id)
      );

      if (aiMessage) {
        aiMessage.content = message.content;
      }
    }
  }
}


