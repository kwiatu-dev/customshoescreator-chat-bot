import { ApiError } from '../utils/ApiError.js'
import { UNAUTHORIZED } from '../constants/httpCodes.js'
import { UNAUTHORIZED_MESSAGE, INVALID_TOKEN_MESSAGE } from '../constants/errors.js'
import axios from 'axios'

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(UNAUTHORIZED, UNAUTHORIZED_MESSAGE())
    }

    try {
        const { data } = await axios.get(
            `${process.env.LARAVEL_API_URL}/api/chat/check_token`,
            {
                headers: {
                    Authorization: authHeader,
                }
            }
        )
        
        req.user = data
        next()
    }
    catch(err) {
        throw new ApiError(UNAUTHORIZED, INVALID_TOKEN_MESSAGE())
    }
}