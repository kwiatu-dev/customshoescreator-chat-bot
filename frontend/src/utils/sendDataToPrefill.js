const LARAVEL_APP_BASE_URL = import.meta.env.VITE_LARAVEL_APP_BASE_URL
const FILL_PARENT_FORM = 'FILL_PARENT_FORM';
const FILL_PARENT_FORM_SUCCESS = 'FILL_PARENT_FORM_SUCCESS';

export const sendDataToPrefill = async (formData) => {
    const maxAttempts = 10; 
    const delayBetweenAttempts = 100; 
    const timeoutPerAttempt = 100; 

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substring(2, 9);

            const timer = setTimeout(() => {
                window.removeEventListener('message', responseHandler);
                reject(new Error('Timeout: Parent not responding'));
            }, timeoutPerAttempt);

            const responseHandler = (event) => {
            if (event.data.requestId === requestId) {
                window.removeEventListener('message', responseHandler);
                
                if (event.data.type === FILL_PARENT_FORM_SUCCESS) {
                    clearTimeout(timer);
                    resolve(event.data.payload);
                } else {
                    reject(new Error('Failed to fill the form'));
                }
            }
            };

            window.addEventListener('message', responseHandler);

            window.parent.postMessage({
                type: FILL_PARENT_FORM,
                payload: { 
                    data: formData, 
                },
                requestId 
                }, LARAVEL_APP_BASE_URL);
            });

            return result
        }
        catch(error) {
            if (attempt === maxAttempts) {
                throw error;
            }

            await new Promise(r => setTimeout(r, delayBetweenAttempts));
        }
    }
};