import pLimit from 'p-limit';
import { ApiError } from '../utils/ApiError.js';
import { CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';

const ipLimiters = new Map(); 

export const perIpConcurrencyPerIpMiddleware = () => async (req, res, next) => {
  const ip = req.ip;

  if (!ipLimiters.has(ip)) {
    ipLimiters.set(ip, pLimit(process.env.USER_CONCURRENCY_LIMIT));
  }

  const limiter = ipLimiters.get(ip);

  try {
    await limiter(async () => {
      const active = limiter.activeCount;
      const max = limiter.concurrency;
      logger.info(CONCURRENCY_INFO_MESSAGE(active, max))
      await next()
    });
  } catch (err) {
    throw new ApiError(429, CONCURRENCY_LIMIT_MESSAGE());
  } 
  finally {
    if (limiter.activeCount === 0) {
      ipLimiters.delete(ip);
    }
  }
};