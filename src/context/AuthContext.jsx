/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/endpoints'
import { setTokens, clearTokens, isAuthenticated } from '../utils/tokenStorage'
import { getErrorMessage } from '../utils/helpers'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await authAPI.getProfile()
          setUser(response.data.data)
        } catch (err) {
          console.error('Auth check failed:', err)
          clearTokens()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, access_token, refresh_token } = response.data.data

      // Check if user is admin
      if (userData.user_type !== 'admin') {
        throw new Error('Access denied. Admin privileges required.')
      }

      // Save tokens
      setTokens(access_token, refresh_token)

      // Set user
      setUser(userData)

      return { success: true }
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearTokens()
      setUser(null)
    }
  }

  // Update user profile
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }))
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}