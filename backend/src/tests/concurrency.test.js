const { default: app } = await import('../app.js');

import request from 'supertest';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

import { CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';


const CONCURRENCY_LIMIT = parseInt(process.env.GLOBAL_CONCURRENCY_LIMIT);

describe('Global Concurrency Middleware Test', () => {
    beforeAll(() => {
        app.get('/test-concurrency-slow', async (req, res) => {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!res.headersSent) {
                res.status(200).json({ message: 'done' });
            }
        });
    });

    it(`powinien zablokować żądanie po przekroczeniu limitu (${CONCURRENCY_LIMIT}), a następnie odblokować po zwolnieniu zasobów`, async () => {
        const pendingRequests = [];

        for (let i = 0; i < CONCURRENCY_LIMIT + 1; i++) {
            pendingRequests.push(request(app).get(`/test-concurrency-slow?number=${i}`));
        }

        Promise.all(pendingRequests);
        await new Promise(resolve => setTimeout(resolve, 500));

        const blockedResponse = await request(app).get(`/test-concurrency-slow?block`);
        const completedResponses = await Promise.all(pendingRequests);

        expect(blockedResponse.status).toBe(TOO_MANY_REQUEST_CODE);
        expect(blockedResponse.body).toHaveProperty('error');        
        expect(blockedResponse.body.error.message).toBe(CONCURRENCY_LIMIT_MESSAGE());

        completedResponses.forEach(response => {
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('done');
        });

        const freshResponse = await request(app).get('/test-concurrency-slow?should-work');
        expect(freshResponse.status).toBe(200);
        expect(freshResponse.body.message).toBe('done');
    });
});