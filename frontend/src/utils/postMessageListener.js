import { requestAuth } from "@/utils/requestAuth.js"
import { authState, setAuth } from "@/store/authStore"

export const setupPostMessageListener = (app) => {
    const LARAVEL_APP_BASE_URL = import.meta.env.VITE_LARAVEL_APP_BASE_URL
    const RESPONSE_TYPE = 'AUTH_TOKEN'

    const handlePostMessage = (event) => {
        const data = event.data
        const origin = event.origin

        if (origin !== LARAVEL_APP_BASE_URL) return

        if (data && data.type === RESPONSE_TYPE && data.payload) {
            console.log(`Otrzymano postMessage ${RESPONSE_TYPE} od ${LARAVEL_APP_BASE_URL}`)
            setAuth(event.data.payload)
        }
    }

    window.addEventListener('message', handlePostMessage)
    app.provide('authStore', authState)
    requestAuth()

    return app
}
