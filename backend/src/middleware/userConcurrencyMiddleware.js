import pLimit from 'p-limit';
import { ApiError } from '../utils/ApiError.js'; 
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { USER_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';

const userLimiters = new Map();
const CONCURRENCY_LIMIT = Number(process.env.USER_CONCURRENCY_LIMIT);

export const userConcurrencyMiddleware = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next();
  }

  const userId = req.user.id;

  if (!userLimiters.has(userId)) {
    userLimiters.set(userId, pLimit(CONCURRENCY_LIMIT));
  }

  const limiter = userLimiters.get(userId);

  if (limiter.activeCount >= CONCURRENCY_LIMIT) {
    return next(
      new ApiError(
        TOO_MANY_REQUEST_CODE,
        USER_CONCURRENCY_LIMIT_MESSAGE()
      )
    );
  }

  try {
    await limiter(() => {
      return new Promise((resolve) => {
        const onFinished = () => {
          if (
            limiter.activeCount === 0 &&
            limiter.pendingCount === 0
          ) {
            userLimiters.delete(userId);
          }
          resolve();
        };

        res.once('finish', onFinished);
        res.once('close', onFinished);

        next();
      });
    });
  } catch (err) {
    next(err);
  }
};
