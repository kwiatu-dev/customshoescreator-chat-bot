import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { FIELD_REQUIRED_MESSAGE, EMPTY_FIELD_MESSAGE, EXCEED_TOKENS_LIMIT_MESSAGE, AI_TIMEOUT_MESSAGE } from '../constants/errors.js'
import { gpt, CHAT_MODEL, MAX_TOKENS, CHAT_TIMEOUT  } from '../llms/gpt/chat.js'
import { countTokens } from '../utils/countTokens.js'
import { ApiError } from '../utils/ApiError.js'
import { BAD_REQUEST_CODE, REQUEST_TIMEOUT_CODE } from '../constants/httpCodes.js'

const prompt = new PromptTemplate({
  inputVariables: ['topic'],
  template: 'Opisz temat w maksymalnie trzech zadaniach. Temat: {topic}',
})

const chain = prompt.pipe(gpt).pipe(new StringOutputParser())

const validateMessage = (message) => {
  if (message === null) 
    throw new ApiError(BAD_REQUEST_CODE, FIELD_REQUIRED_MESSAGE('message'))

  if (message === '')
    throw new ApiError(BAD_REQUEST_CODE, EMPTY_FIELD_MESSAGE('message'))

  const tokens = countTokens(CHAT_MODEL, message)

  if (tokens > MAX_TOKENS || true) 
    throw new ApiError(BAD_REQUEST_CODE, EXCEED_TOKENS_LIMIT_MESSAGE(tokens, MAX_TOKENS))
}

export const chat = async (message) => {
  validateMessage(message)

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort(); 
  }, CHAT_TIMEOUT);

  try {
    return await chain.invoke({ topic: message, signal: controller.signal });
  }
  catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(REQUEST_TIMEOUT_CODE, AI_TIMEOUT_MESSAGE(CHAT_TIMEOUT))
    }

    throw err
  }
  finally { 
    clearTimeout(timeout);
  }
}

