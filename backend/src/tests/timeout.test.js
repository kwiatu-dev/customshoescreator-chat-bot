const { default: app } = await import('../app.js');
const { errorHandlingMiddleware } = await import('../middleware/errorHandlingMiddleware.js');

import request from 'supertest';
import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { TIMEOUT_MESSAGE } from '../constants/errors.js';

const TIMEOUT_MS = parseInt(process.env.APP_TIMEOUT_MS);

describe('Timeout Middleware Test', () => {
  jest.setTimeout(TIMEOUT_MS + 10000); 
  const timers = []

  afterAll(() => {
    timers.forEach((timer) => timer.unref())
  })

  it('powinien zwrócić błąd timeout (408) gdy żądanie trwa zbyt długo', async () => {
    app.get('/test-timeout-simulation', (req, res) => {
      const timer = setTimeout(() => {
        if (!res.headersSent) {
          res.json({ message: "To nie powinno się udać" });
        }
      }, TIMEOUT_MS + 5000);

      timers.push(timer);
    });

    app.use(errorHandlingMiddleware)

    const response = await request(app)
      .get('/test-timeout-simulation');

    expect(response.status).toBeOneOf([408]);
    expect(response.body).toHaveProperty('error')

    if (response.body.error) {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error.message).toBe(TIMEOUT_MESSAGE(TIMEOUT_MS));
    }
  });

  it('powinien obsłużyć zapytania mieszczące się w limicie (czas trwania: timeout - 1s)', async () => {
    app.get('/quick-test', (req, res) => {
      const duration = Math.max(0, TIMEOUT_MS - 1000);
      
      const timer = setTimeout(() => {
        res.status(200).send('ok');
      }, duration);
      
      timers.push(timer)
    });
    
    app.get('/quick-test', (req, res) => res.status(200).send('ok'));

    const response = await request(app).get('/quick-test');
    expect(response.status).toBe(200);
  });
});

expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});