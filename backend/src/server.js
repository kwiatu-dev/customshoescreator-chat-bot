import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5173'], 
    methods: 'GET,POST',
}));

app.use(express.json());
app.use('/api', chatRoutes); 

app.listen(PORT, () => {
    console.log(`🤖 Chatbot API działa na porcie: ${PORT}`);
});