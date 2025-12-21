// Token storage keys
const ACCESS_TOKEN_KEY = 'rewear_admin_access_token'
const REFRESH_TOKEN_KEY = 'rewear_admin_refresh_token'

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Set both tokens
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

// Clear all tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken()
}