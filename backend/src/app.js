import express from 'express';
import cors from 'cors';
import timeout from 'connect-timeout';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js'
import { globalConcurrencyMiddleware } from './middleware/globalConcurrencyMiddleware.js'
import { userConcurrencyMiddleware } from './middleware/userConcurrencyMiddleware.js'
import { loggingMiddleware } from './middleware/loggingMiddleware.js'
import { errorHandlingMiddleware } from './middleware/errorHandlingMiddleware.js'
import chatRoutes from './routes/chatRoutes.js'
import { getAuthMiddleware } from './utils/getAuthMiddleware.js';

const app = express();
const TIMEOUT_MS = process.env.APP_TIMEOUT_MS;

app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5173'], 
    methods: 'GET,POST',
}));

app.use(express.json());
app.use(timeout(TIMEOUT_MS));
app.use(loggingMiddleware);
//app.use(getAuthMiddleware());
app.use(rateLimitMiddleware);
app.use(globalConcurrencyMiddleware)
app.use(userConcurrencyMiddleware)
app.use('/api', chatRoutes); 
app.use(errorHandlingMiddleware)

export default app;