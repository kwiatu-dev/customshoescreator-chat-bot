import pLimit from 'p-limit';
import { CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js'
import { CONCURRENCY_INFO_MESSAGE } from '../constants/info.js'

const appConcurrencyLimit = pLimit(process.env.APP_CONCURRENCY ?? 10); 

export const appConcurrencyMiddleware = (handler) => async (req, res, next) => {
    try {
        await appConcurrencyLimit(async () => {
            const active = appConcurrencyLimit.activeCount;
            const max = appConcurrencyLimit.concurrency;
            logger.info(CONCURRENCY_INFO_MESSAGE(active, max))
            await next()
        });
    }
    catch (err) {
        throw new ApiError(429, CONCURRENCY_LIMIT_MESSAGE())
    }
};