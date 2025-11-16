import apiClient from '@/api/apiClient.js';

export const sendMessage = async (message) => {
    const response = await apiClient.post('/chat', {
        message: message 
    });
        
    return response.data; 
};