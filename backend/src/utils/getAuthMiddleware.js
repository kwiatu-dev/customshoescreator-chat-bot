import { authMiddleware } from "../middleware/authMiddleware.js";
import { mockAuthMiddleware } from "../middleware/mockAuthMiddleware.js";

export const getAuthMiddleware = () => {
    if (process.env.NODE_ENV === 'test') {
        return mockAuthMiddleware;
    }
    else {
        return authMiddleware;
    }
}