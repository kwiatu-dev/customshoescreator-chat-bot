export const requestAuth = () => {
    const LARAVEL_APP_BASE_URL = import.meta.env.VITE_LARAVEL_APP_BASE_URL
    const REQUEST_TYPE = 'REQUEST_AUTH'

    window.parent.postMessage(
        { type: REQUEST_TYPE },
        LARAVEL_APP_BASE_URL
    )

    console.log(`Wysłano postMessage ${REQUEST_TYPE} do ${LARAVEL_APP_BASE_URL}`)
}