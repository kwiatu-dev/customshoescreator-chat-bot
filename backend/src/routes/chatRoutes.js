import { Router } from 'express';
import { chat } from '../services/chatService.js';
import { ApiResult } from '../utils/ApiResult.js'

const router = Router();

router.post('/chat', async (req, res) => {
    const message = req.body.message

    if (!res.headersSent)
        return res.json(ApiResult.success(await chat(message)));
});

export default router;