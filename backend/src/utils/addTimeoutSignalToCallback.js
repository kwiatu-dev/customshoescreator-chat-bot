import { ApiError } from './ApiError.js';
import { REQUEST_TIMEOUT_CODE } from '../constants/httpCodes.js';
import { AI_TIMEOUT_MESSAGE } from '../constants/errors.js';

export const addTimeoutSignalToCallback = async (asyncAction, timeoutMs) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await asyncAction(controller.signal);
  } catch (err) {
    if (err.name === 'AbortError' || (err.message && err.message.includes('AbortError'))) {
      throw new ApiError(REQUEST_TIMEOUT_CODE, AI_TIMEOUT_MESSAGE(timeoutMs));
    }

    throw err;
  } finally {
    clearTimeout(timeout);
  }
};