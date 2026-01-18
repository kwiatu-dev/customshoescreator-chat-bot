import { reactive } from 'vue';

let resolveAuthPromise = null;

export const authState = reactive({
  token: null,
  user: null,
  authPromise: null,
});

const initAuthPromise = () => {
  authState.authPromise = new Promise((resolve) => {
    resolveAuthPromise = resolve;
  });
};

export const setAuth = ({ token, user }) => {
  authState.token = token;
  authState.user = user;

  if (resolveAuthPromise) {
    resolveAuthPromise();
  }
};

export const clearAuth = () => {
  authState.token = null;
  authState.user = null;
};

initAuthPromise();
