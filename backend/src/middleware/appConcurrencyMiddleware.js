import pLimit from 'p-limit';
import { CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
import { CONCURRENCY_INFO_MESSAGE } from '../constants/info.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { ApiError } from '../utils/ApiError.js'; 
import { logger } from '../utils/logger.js'; 

const APP_CONCURRENCY_LIMIT = parseInt(process.env.APP_CONCURRENCY_LIMIT);
const appConcurrencyLimit = pLimit(APP_CONCURRENCY_LIMIT);

export const appConcurrencyMiddleware = async (req, res, next) => {
    if (appConcurrencyLimit.activeCount >= APP_CONCURRENCY_LIMIT && appConcurrencyLimit.pendingCount > 0) {
        throw new ApiError(TOO_MANY_REQUEST_CODE, CONCURRENCY_LIMIT_MESSAGE());
    }

    try {
        await appConcurrencyLimit(() => {
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