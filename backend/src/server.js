import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import timeout from 'connect-timeout';
import { rateLimiterMiddleware } from './middleware/rateLimiterMiddleware.js'
import { appConcurrencyMiddleware } from './middleware/appConcurrencyMiddleware.js'
import { perIpConcurrencyMiddleware } from './middleware/perIpConcurrencyMiddleware.js'
import { loggingMiddleware } from './middleware/loggingMiddleware.js'
import chatRoutes from './routes/chatRoutes.js'
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5173'], 
    methods: 'GET,POST',
}));

app.use(express.json());
app.use(timeout(process.env.APP_TIMEOUT_MS));
app.use(rateLimiterMiddleware);
app.use(loggingMiddleware)
app.use(appConcurrencyMiddleware)
app.use('/api', perIpConcurrencyMiddleware, chatRoutes); 
app.use(errorHandlingMiddleware)

app.listen(PORT, () => {
    logger.info(`🤖 Chatbot API działa na porcie: ${PORT}`);
});