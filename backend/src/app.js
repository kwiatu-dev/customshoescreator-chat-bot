import express from 'express';
import cors from 'cors';
import timeout from 'connect-timeout';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js'
import { appConcurrencyMiddleware } from './middleware/appConcurrencyMiddleware.js'
import { perIpConcurrencyMiddleware } from './middleware/perIpConcurrencyMiddleware.js'
import { loggingMiddleware } from './middleware/loggingMiddleware.js'
import { errorHandlingMiddleware } from './middleware/errorHandlingMiddleware.js'
import chatRoutes from './routes/chatRoutes.js'

const app = express();
const TIMEOUT_MS = process.env.APP_TIMEOUT_MS;

app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5173'], 
    methods: 'GET,POST',
}));

app.use(express.json());
app.use(timeout(TIMEOUT_MS));
app.use(loggingMiddleware)
app.use(rateLimitMiddleware);
app.use(appConcurrencyMiddleware)
app.use(perIpConcurrencyMiddleware)
app.use('/api', chatRoutes); 
app.use(errorHandlingMiddleware)


export default app;