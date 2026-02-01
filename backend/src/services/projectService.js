import axios from 'axios'

export const findProjectStatusByName = async (name, authHeader) => {
    try {
        const { data } = await axios.get(
            `${process.env.LARAVEL_API_URL}/api/project-statuses/find`,
            {
                params: {
                    name: name 
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

export const findProjectTypeByName = async (name, authHeader) => {
    try {
        const { data } = await axios.get(
            `${process.env.LARAVEL_API_URL}/api/project-types/find`,
            {
                params: {
                    name: name 
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