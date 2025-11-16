import { Router } from 'express';

const router = Router();

router.post('/chat', async (req, res) => {
    if (req.body.message) {
        return res.json({ message: 'Otrzymana wiadomość to: ' + req.body.message });
    } else {
        return res.status(400).json({ 
            error: 'Brak pola "message" w ciele żądania.' 
        });
    }
});

export default router;