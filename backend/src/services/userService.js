import axios from 'axios'

export const findUserByEmail = async (email, authHeader) => {
    try {
        const { data } = await axios.get(
            `${process.env.LARAVEL_API_URL}/api/users/find`,
            {
                params: {
                    email: email 
                },
                headers: {
                    Authorization: authHeader,
                }
            }
        )

        return data
    }
    catch (err) {
        return null
    }
}