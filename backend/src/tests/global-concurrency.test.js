const { default: app } = await import('../app.js');

import request from 'supertest';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

import { GLOBAL_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
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

        for (let i = 1; i <= CONCURRENCY_LIMIT; i++) {
            pendingRequests.push(request(app).get(`/test-concurrency-slow?number=${i}`).set('x-user-id', `global-user-${i}`));
        }

        Promise.all(pendingRequests);
        await new Promise(resolve => setTimeout(resolve, 50));

        const blockedResponse = await request(app).get(`/test-concurrency-slow?block`).set('x-user-id', `global-user-${CONCURRENCY_LIMIT + 1}`);
        const completedResponses = await Promise.all(pendingRequests);

        expect(blockedResponse.status).toBe(TOO_MANY_REQUEST_CODE);
        expect(blockedResponse.body).toHaveProperty('error');        
        expect(blockedResponse.body.error.message).toBe(GLOBAL_CONCURRENCY_LIMIT_MESSAGE());

        completedResponses.forEach(response => {
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('done');
        });

        const freshResponse = await request(app).get('/test-concurrency-slow?should-work');
        expect(freshResponse.status).toBe(200);
        expect(freshResponse.body.message).toBe('done');
    });
});