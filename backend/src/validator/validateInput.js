//import { countTokens } from '../utils/countTokens.js'
import { gpt, CHAT_MODEL, MAX_TOKENS, CHAT_TIMEOUT  } from '../llms/gpt/chat.js'
import { FIELD_REQUIRED_MESSAGE, EMPTY_FIELD_MESSAGE, EXCEED_TOKENS_LIMIT_MESSAGE, AI_TIMEOUT_MESSAGE } from '../constants/errors.js'
import { ApiError } from '../utils/ApiError.js'
import { BAD_REQUEST_CODE, REQUEST_TIMEOUT_CODE } from '../constants/httpCodes.js'

export const validateMessage = (message) => {
  if (message === null) 
    throw new ApiError(BAD_REQUEST_CODE, FIELD_REQUIRED_MESSAGE('message'))

  if (message === '')
    throw new ApiError(BAD_REQUEST_CODE, EMPTY_FIELD_MESSAGE('message'))

  //TODO Zrób poprawne liczenie tokenów na podstawie konwersacji i nowej wiadomości
  //Zachowuj informacje o zuzytych tokenach 
  //const tokens = countTokens(CHAT_MODEL, message)
  const tokens = 0

  if (tokens > MAX_TOKENS) 
    throw new ApiError(BAD_REQUEST_CODE, EXCEED_TOKENS_LIMIT_MESSAGE(tokens, MAX_TOKENS))
}