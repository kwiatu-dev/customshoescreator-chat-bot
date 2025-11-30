import { jest, beforeEach } from '@jest/globals';

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