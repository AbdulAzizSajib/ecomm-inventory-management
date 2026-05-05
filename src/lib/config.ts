export const config = {
  apiBaseUrl: "http://192.168.90.51:3000",
} as const

export const env = config

export const AUTH_TOKEN_KEY = "hm_auth_token"
export const AUTH_USER_KEY = "hm_auth_user"
export const AUTH_COOKIE_MAX_AGE_DAYS = 1
