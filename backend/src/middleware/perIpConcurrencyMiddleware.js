import pLimit from 'p-limit';
import { ApiError } from '../utils/ApiError.js'; 
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { USER_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';

const ipLimiters = new Map();
const CONCURRENCY_LIMIT = parseInt(process.env.USER_CONCURRENCY_LIMIT);

export const perIpConcurrencyMiddleware = () => async (req, res, next) => {
  const ip = req.ip;

  if (!ipLimiters.has(ip)) {
    ipLimiters.set(ip, pLimit(CONCURRENCY_LIMIT));
  }
  const limiter = ipLimiters.get(ip);


  if (limiter.activeCount >= CONCURRENCY_LIMIT && limiter.pendingCount > 0) {
      throw new ApiError(TOO_MANY_REQUEST_CODE, USER_CONCURRENCY_LIMIT_MESSAGE());
  }

  try {
    await limiter(() => {
      return new Promise((resolve, reject) => {
        const onFinished = () => {
          if (limiter.activeCount <= 1 && limiter.pendingCount === 0) {
            ipLimiters.delete(ip);
          }
          resolve(); 
        };

        res.on('finish', onFinished);
        res.on('close', onFinished);
        res.on('error', (err) => {
            onFinished();
        });

        try {
            next();
        } catch (error) {
            reject(error);
        }
      });
    });
  } catch (err) {
    next(err);
  }
};