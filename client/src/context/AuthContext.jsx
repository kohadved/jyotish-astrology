import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

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

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('melooha_token')
            if (token) {
                try {
                    const response = await api.get('/auth/me')
                    setUser(response.data.user)
                } catch (err) {
                    console.error('Auth check failed:', err)
                    localStorage.removeItem('melooha_token')
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        try {
            setError(null)
            const response = await api.post('/auth/login', { email, password })
            const { token, user: userData } = response.data

            localStorage.setItem('melooha_token', token)
            setUser(userData)

            return { success: true }
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed'
            setError(message)
            return { success: false, error: message }
        }
    }

    const register = async (userData) => {
        try {
            setError(null)
            const response = await api.post('/auth/register', userData)
            const { token, user: newUser } = response.data

            localStorage.setItem('melooha_token', token)
            setUser(newUser)

            return { success: true }
        } catch (err) {
            const message = err.response?.data?.error || 'Registration failed'
            setError(message)
            return { success: false, error: message }
        }
    }

    const logout = () => {
        localStorage.removeItem('melooha_token')
        setUser(null)
    }

    const updateProfile = async (updates) => {
        try {
            setError(null)
            const response = await api.put('/auth/me', updates)
            setUser(response.data.user)
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.error || 'Update failed'
            setError(message)
            return { success: false, error: message }
        }
    }

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError: () => setError(null)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
