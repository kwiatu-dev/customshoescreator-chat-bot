import { authState } from '@/store/authStore';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UNDEFINED_ERROR_MESSAGE = 'Wystąpił błąd ale obiekt błędy nie został zwrócony'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, 
});

apiClient.interceptors.request.use((config) => {
  if (authState.token) {
    config.headers.Authorization = `Bearer ${authState.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return { result: response.data ?? null, error: null };
  },
  (error) => {
    return Promise.resolve({ result: null, error: error?.response?.data?.error ?? UNDEFINED_ERROR_MESSAGE });
  }
);

export default apiClient;