import { logger } from '../utils/logger.js';
import { ApiResult } from '../utils/ApiResult.js';
import { ApiError } from '../utils/ApiError.js';
import { GLOBAL_ERROR_MESSAGE, TIMEOUT_MESSAGE } from '../constants/errors.js'
import { INTERNAL_SERVER_ERROR_CODE, REQUEST_TIMEOUT_CODE } from '../constants/httpCodes.js';

const TIMEOUT_MS = process.env.APP_TIMEOUT_MS

export const errorHandlingMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ApiError) {
        return res.status(err.status).json(
            ApiResult.failed(err));
    }

    if (req.timeout || err.code === 'ETIMEDOUT') {
        return res.status(REQUEST_TIMEOUT_CODE).json(
            ApiResult.failed(new ApiError(REQUEST_TIMEOUT_CODE, TIMEOUT_MESSAGE(TIMEOUT_MS)))
        );
    }

    logger.error('Wystąpił nieznany błąd:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        body: req.body,
        message: err.message,
        stack: err.stack,
    });

    return res.status(INTERNAL_SERVER_ERROR_CODE).json(
        ApiResult.failed(
            new ApiError(INTERNAL_SERVER_ERROR_CODE, GLOBAL_ERROR_MESSAGE())));
};
