import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_MESSAGE } from '../constants/errors.js'
import { ApiError } from '../utils/ApiError.js'

export const rateLimitMiddleware = rateLimit({
  windowMs: process.env.RATE_WINDOW_MS,
  max: process.env.RATE_LIMIT,
  handler: (req, res, next) => {
    next(new ApiError(429, RATE_LIMIT_MESSAGE()));
  },
  standardHeaders: true,
  legacyHeaders: false,
});