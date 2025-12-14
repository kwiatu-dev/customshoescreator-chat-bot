import dotenv from 'dotenv';
dotenv.config({ path: '.env.test'});

import { jest, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { mockUser } from '../middleware/mockAuthMiddleware.js';
const { rateLimitMiddleware } = await import('../middleware/rateLimitMiddleware.js');

beforeEach(() => {
  rateLimitMiddleware.resetKey(mockUser.id.toString());
  rateLimitMiddleware.resetKey('127.0.0.1');
  rateLimitMiddleware.resetKey('::ffff:127.0.0.1');
});

afterEach(() => {
  rateLimitMiddleware.resetKey(mockUser.id.toString());
});


const silenceConsole = () => {
  if (global.console._stdout) {
    delete global.console._stdout;
  }
  if (global.console._stderr) {
    delete global.console._stderr;
  }

  const methods = ['log', 'info', 'warn', 'error'];
  
  methods.forEach((method) => {
    if (!jest.isMockFunction(console[method])) {
      jest.spyOn(console, method).mockImplementation(() => {});
    } else {
      console[method].mockImplementation(() => {});
    }
  });
};

silenceConsole();

beforeEach(() => {
  silenceConsole();
});