import request from 'supertest';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

import { USER_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';

const { default: app } = await import('../app.js');

const USER_CONCURRENCY_LIMIT = parseInt(process.env.USER_CONCURRENCY_LIMIT);

describe('User Concurrency Middleware Test', () => {
  beforeAll(() => {
    app.get('/test-user-concurrency-slow', async (req, res) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!res.headersSent) {
        res.status(200).json({ message: 'done', userId: req.user.id });
      }
    });
  });

  it(
    `powinien zablokować żądanie po przekroczeniu limitu (${USER_CONCURRENCY_LIMIT}) dla jednego użytkownika`,
    async () => {
      const pendingRequests = [];

      for (let i = 0; i < USER_CONCURRENCY_LIMIT; i++) {
        pendingRequests.push(
          request(app)
            .get('/test-user-concurrency-slow')
            .set('x-user-id', 'user-1')
        );
      }

      Promise.all(pendingRequests);
      await new Promise(resolve => setTimeout(resolve, 50));

      const blockedResponse = await request(app)
        .get('/test-user-concurrency-slow')
        .set('x-user-id', 'user-1');

      const completedResponses = await Promise.all(pendingRequests);

      expect(blockedResponse.status).toBe(TOO_MANY_REQUEST_CODE);
      expect(blockedResponse.body).toHaveProperty('error');
      expect(blockedResponse.body.error.message).toBe(
        USER_CONCURRENCY_LIMIT_MESSAGE()
      );

      completedResponses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('done');
        expect(response.body.userId).toBe('user-1');
      });

      const freshResponse = await request(app)
        .get('/test-user-concurrency-slow')
        .set('x-user-id', 'user-1');

      expect(freshResponse.status).toBe(200);
      expect(freshResponse.body.message).toBe('done');
    }
  );

  it('nie powinien współdzielić limitu między różnymi użytkownikami', async () => {
    const user1Requests = [];
    const user2Requests = [];

    for (let i = 0; i < USER_CONCURRENCY_LIMIT; i++) {
      user1Requests.push(
        request(app)
          .get('/test-user-concurrency-slow')
          .set('x-user-id', 'user-1')
      );

      user2Requests.push(
        request(app)
          .get('/test-user-concurrency-slow')
          .set('x-user-id', 'user-2')
      );
    }

    const responses = await Promise.all([
      ...user1Requests,
      ...user2Requests,
    ]);

    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('done');
    });
  });
});
