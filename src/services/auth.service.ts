import { axiosAuth, axiosClassic } from '../api/axios'
import { getRefreshToken, saveAccessToken, saveRefreshToken } from './auth-token.service'

export enum EnumTokens {
    'ACCESS_TOKEN' = 'access_token',
    'REFRESH_TOKEN' = 'refresh_token',
}


export const AuthService = {


    async login(phone: string, password: string) {
        const response = await axiosClassic.post('/auth/login', { phone, password })
        const { accessToken, refreshToken } = response.data

        saveAccessToken(accessToken)
        saveRefreshToken(refreshToken)

        return response.data
    },

    async refresh() {
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('Отсутствует refresh token')

        const response = await axiosAuth.post('/auth/refresh-token', { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = response.data

        saveAccessToken(accessToken)
        saveRefreshToken(newRefreshToken)

        return response.data
    },

}