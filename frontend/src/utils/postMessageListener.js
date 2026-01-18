import { requestAuth } from "@/utils/requestAuth.js"
import { authState, setAuth } from "@/stores/authStore.js"

export const setupPostMessageListener = (app) => {
    const LARAVEL_APP_BASE_URL = import.meta.env.VITE_LARAVEL_APP_BASE_URL
    const AUTH_TOKEN = 'AUTH_TOKEN'

    const handlePostMessage = (event) => {
        const data = event.data
        const origin = event.origin

        if (origin !== LARAVEL_APP_BASE_URL) return

        if (data && data.type === AUTH_TOKEN && data.payload) {
            console.log(`Otrzymano postMessage ${AUTH_TOKEN} od ${LARAVEL_APP_BASE_URL}`)
            setAuth(event.data.payload)
        }
    }

    window.addEventListener('message', handlePostMessage)
    app.provide('authStore', authState)
    requestAuth()

    return app
}
