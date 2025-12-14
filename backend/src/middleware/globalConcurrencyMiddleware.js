import pLimit from 'p-limit';
import { GLOBAL_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { ApiError } from '../utils/ApiError.js'; 

const GLOBAL_CONCURRENCY_LIMIT = Number(process.env.GLOBAL_CONCURRENCY_LIMIT);
const globalLimiter = pLimit(GLOBAL_CONCURRENCY_LIMIT);

export const globalConcurrencyMiddleware = async (req, res, next) => {
  if (globalLimiter.activeCount >= GLOBAL_CONCURRENCY_LIMIT) {
    return next(
      new ApiError(
        TOO_MANY_REQUEST_CODE,
        GLOBAL_CONCURRENCY_LIMIT_MESSAGE()
      )
    );
  }

  try {
    await globalLimiter(() => {
      return new Promise((resolve) => {
        const release = () => resolve();

        res.once('finish', release);
        res.once('close', release);

        next();
      });
    });
  } catch (err) {
    next(err);
  }
};
