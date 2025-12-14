import { reactive } from 'vue';

export const authState = reactive({
  token: null,
  user: null,
  isAuthenticated: false,
});

export const setAuth = ({ token, user }) => {
  authState.token = token;
  authState.user = user;
  authState.isAuthenticated = true;
};

export const clearAuth = () => {
  authState.token = null;
  authState.user = null;
  authState.isAuthenticated = false;
};
