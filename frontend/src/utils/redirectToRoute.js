const LARAVEL_APP_BASE_URL = import.meta.env.VITE_LARAVEL_APP_BASE_URL
const REDIRECT_TO_ROUTE = 'REDIRECT_TO_ROUTE'
const REDIRECT_SUCCESS = 'REDIRECT_SUCCESS'
const REDIRECT_FAILED = 'REDIRECT_FAILED'

export const redirectToRoute = (routeName, params) => {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36).substring(2, 9);

    const responseHandler = (event) => {
      if (event.data.requestId === requestId) {
        window.removeEventListener('message', responseHandler);
        
        if (event.data.type === REDIRECT_SUCCESS) {
          resolve(event.data.payload);
        } else if (event.data.type === REDIRECT_FAILED) {
          reject(new Error('Redirect failed'));
        }
      }
    };

    window.addEventListener('message', responseHandler);

    window.parent.postMessage({
      type: REDIRECT_TO_ROUTE,
      payload: { routeName, params },
      requestId 
    }, LARAVEL_APP_BASE_URL);
  });
};