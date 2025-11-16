import { reactive } from "vue"

export const setupPostMessageListener = (app) => {
    const authUserData = reactive({
        data: null,
    })

    const handlePostMessage = (event) => {
        const data = event.data

        if (data && data.type === 'user_data' && data.payload) {
            authUserData.data = data.payload
            window.removeEventListener('message', handlePostMessage)
        }
    }

    window.addEventListener('message', handlePostMessage)
    app.provide('authUserData', authUserData)

    return app
}
