import { inject, computed } from "vue"

export const useAuthUser = () => {
    const authUserData = inject('authUserData')
    const authUserDataRef = computed(() => authUserData.data)
    
    return authUserDataRef
}