const { default: app } = await import('../app.js');
const { errorHandlingMiddleware } = await import('../middleware/errorHandlingMiddleware.js');

import request from 'supertest';
import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { RATE_LIMIT_MESSAGE } from '../constants/errors.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';

const LIMIT = parseInt(process.env.RATE_LIMIT);
const WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS);

describe('Rate Limit Middleware Test', () => {
    beforeAll(() => {
        app.get('/test-ratelimit', (req, res) => {
            res.status(200).json({ message: 'ok', userId: req.user.id });
        });

        app.use(errorHandlingMiddleware)
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('powinien dodawać nagłówki RateLimit do odpowiedzi (standardHeaders: true)', async () => {
        const response = await request(app).get('/test-ratelimit');
        
        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty('ratelimit-limit');
        expect(response.headers).toHaveProperty('ratelimit-remaining');
        expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it(`powinien zablokować żądania po przekroczeniu limitu (${LIMIT}) i zwrócić poprawny błąd`, async () => {
        for (let i = 0; i < LIMIT; i++) {
            const res = await request(app).get('/test-ratelimit');
            expect(res.status).toBe(200);
        }

        const blocked = await request(app).get('/test-ratelimit');
        expect(blocked.status).toBe(TOO_MANY_REQUEST_CODE);
        expect(blocked.body.error.message).toBe(RATE_LIMIT_MESSAGE());
    });


    it('powinien odblokować żądania po upływie czasu okna (RATE_WINDOW_MS)', async () => {
        jest.useFakeTimers();

        const requests = [];

        for (let i = 0; i < LIMIT; i++) {
            requests.push(request(app).get('/test-ratelimit'));
        }

        await Promise.all(requests);
        const blocked = await request(app).get('/test-ratelimit');
        expect(blocked.status).toBe(TOO_MANY_REQUEST_CODE);

        jest.advanceTimersByTime(WINDOW_MS + 1000);

        const success = await request(app).get('/test-ratelimit');
        expect(success.status).toBe(200);

        jest.useRealTimers();
    });
});