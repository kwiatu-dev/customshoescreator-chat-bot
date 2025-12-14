import pLimit from 'p-limit';
import { CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { ApiError } from '../utils/ApiError.js'; 

const GLOBAL_CONCURRENCY_LIMIT = parseInt(process.env.GLOBAL_CONCURRENCY_LIMIT);
const globalConcurrencyLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

export const globalConcurrencyMiddleware = async (req, res, next) => {
    if (globalConcurrencyLimit.activeCount >= GLOBAL_CONCURRENCY_LIMIT && globalConcurrencyLimit.pendingCount > 0) {
        throw new ApiError(TOO_MANY_REQUEST_CODE, CONCURRENCY_LIMIT_MESSAGE());
    }

    try {
        await globalConcurrencyLimit(() => {
            return new Promise((resolve) => {
                res.on('finish', resolve);
                res.on('close', resolve);
                
                next();
            });
        });
    } catch (err) {
        next(err);
    }
};