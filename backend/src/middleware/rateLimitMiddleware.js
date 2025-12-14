import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { RATE_LIMIT_MESSAGE } from '../constants/errors.js'
import { ApiError } from '../utils/ApiError.js'
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';

const RATE_WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS);
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT);

export const rateLimitMiddleware = rateLimit({
  windowMs: RATE_WINDOW_MS,
  max: RATE_LIMIT,
  keyGenerator: (req, res) => {
    if (req.user && req.user.id) return req.user.id.toString();
    return ipKeyGenerator(req);
  },
  handler: (req, res, next) => {
    next(new ApiError(TOO_MANY_REQUEST_CODE, RATE_LIMIT_MESSAGE()));
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => req.method === 'OPTIONS',
});