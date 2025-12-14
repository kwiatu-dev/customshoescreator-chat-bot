import { authMiddleware } from "../middleware/authMiddleware";
import { mockAuthMiddleware } from "../middleware/mockAuthMiddleware";

export const getAuthMiddleware = () => {
    if (process.env.NODE_ENV === 'test') {
        return mockAuthMiddleware;
    }
    else {
        return authMiddleware;
    }
}