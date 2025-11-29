import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { gpt, CHAT_TIMEOUT } from '../llms/gpt/chat.js'
import { FIELD_REQUIRED_MESSAGE, EMPTY_FIELD_MESSAGE, EXCEED_TOKENS_LIMIT_MESSAGE, TIMEOUT_MESSAGE } from '../constants/errors.js'
import { CHAT_MODEL, MAX_TOKENS  } from '../llms/gpt/chat.js'
import { countTokens } from '../utils/countTokens.js'

const prompt = new PromptTemplate({
  inputVariables: ['topic'],
  template: 'Opisz temat w maksymalnie trzech zadaniach. Temat: {topic}',
})

const chain = prompt.pipe(gpt).pipe(new StringOutputParser())

const validateMessage = (message) => {
  if (message === null) 
    throw new ApiError(400, FIELD_REQUIRED_MESSAGE('message'))

  if (message === '')
    throw new ApiError(400, EMPTY_FIELD_MESSAGE('message'))

  const tokens = countTokens(CHAT_MODEL, message)

  if (tokens > MAX_TOKENS) 
    throw new ApiError(400, EXCEED_TOKENS_LIMIT_MESSAGE(tokens, MAX_TOKENS))
}

export const chat = async (message) => {
  validateMessage(message)

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort(); 
  }, process.env.APP_TIMEOUT_MS);

  try {
    const result = await chain.invoke({ topic: message, signal: controller.signal });
  }
  catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(408, AI_TIMEOUT_MESSAGE(CHAT_TIMEOUT))
    }

    throw err
  }
  finally { 
    clearTimeout(timeout);
  }
}

