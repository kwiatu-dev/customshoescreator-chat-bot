import apiClient from '@/api/apiClient.js';

export const sendMessage = async (message) => {
    return await apiClient.post('/chat', {
        message: message 
    });
};