import { Router } from 'express';
import { chat } from '../services/chatService.js';
import { ApiResult } from '../utils/ApiResult.js'

import { CHAT_TIMEOUT } from '../llms/gpt/chat.js';
import { addTimeoutSignalToCallback } from '../utils/addTimeoutSignalToCallback.js';
import { validateMessage } from '../validator/validateInput.js';

const router = Router();

router.post('/chat', async (req, res) => {
    const message = req.body.message

    if (!res.headersSent) {
        validateMessage(message)
        
        const result = await addTimeoutSignalToCallback(async (signal) => await chat(message, signal, req.user), CHAT_TIMEOUT);

        return res.json(ApiResult.success(result));
    }
        
});

export default router;