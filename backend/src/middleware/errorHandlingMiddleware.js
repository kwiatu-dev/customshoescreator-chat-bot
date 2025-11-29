import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { GLOBAL_ERROR_MESSAGE, TIMEOUT_MESSAGE } from '../constants/errors.js'

export const errorHandlingMiddleware = (err, req, res, next) => {
    logger.error('Error occurred', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        body: req.body,
        message: err.message,
        stack: err.stack,
    });

    if (req.timedout) {
        return res.status(408).json({ 
            error: TIMEOUT_MESSAGE(process.env.APP_TIMEOUT_MS)
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            result: null,
            error: { message: err.message },
        });
    }

    return res.status(500).json({
        result: null,
        error: { message: GLOBAL_ERROR_MESSAGE() },
    });
};
