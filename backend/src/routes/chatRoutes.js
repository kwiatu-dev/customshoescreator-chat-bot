import { Router } from 'express';
import { chat } from '../services/chatService.js';
import { ApiResult } from '../utils/ApiResult.js'
import { CHAT_TIMEOUT } from '../llms/gpt/chat.js';
import { addTimeoutSignalToCallback } from '../utils/addTimeoutSignalToCallback.js';
import { validateMessage } from '../validator/validateInput.js';
import { getActiveConversation, deactivateConversation } from '../services/conversationService.js';

const router = Router();

router.post('/chat', async (req, res) => {
    const sessionId = req.body.sessionId
    const message = req.body.message

    if (!res.headersSent) {
        validateMessage(message)
        
        const result = await addTimeoutSignalToCallback(async (signal) => await chat(sessionId, message, signal, req.user), CHAT_TIMEOUT);

        return res.json(ApiResult.success(result));
    }
});

router.get('/conversation', async (req, res) => {
    const authHeader = req.headers.authorization;

    const { data } = await getActiveConversation(authHeader);

    return res.json(ApiResult.success(data));
});

router.delete('/conversation', async (req, res) => {
    const authHeader = req.headers.authorization;

    const { data } = await deactivateConversation(authHeader);

    return res.json(ApiResult.success(data));
});

export default router;