import { INTERNAL_SERVER_ERROR_CODE } from "../constants/httpCodes.js"
import { ApiError } from "../utils/ApiError.js"
import axios from 'axios'

export const getActiveConversation = async (authHeader) => {
    try {
        const { data } = await axios.get(
            `${process.env.LARAVEL_API_URL}/api/chat/conversation`,
            {
                headers: {
                    Authorization: authHeader,
                }
            }
        )

        return data
    }
    catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR_CODE, err?.message)
    }
}

export const deactivateConversation = async (authHeader) => {
    try {
        const { data } = await axios.delete(
            `${process.env.LARAVEL_API_URL}/api/chat/conversation`,
            {
                headers: {
                    Authorization: authHeader,
                }
            }
        )

        return data
    }
    catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR_CODE, err?.message)
    }
}