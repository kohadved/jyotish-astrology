import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('melooha_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('melooha_token')
            // Optionally redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

// API methods
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data)
}

export const astrologyAPI = {
    getZodiac: () => api.get('/astrology/zodiac'),
    getKundli: () => api.get('/astrology/kundli'),
    getDailyHoroscope: () => api.get('/astrology/daily-horoscope'),
    getPanchang: () => api.get('/astrology/panchang')
}

export const guidanceAPI = {
    getDailyGuidance: () => api.get('/guidance/daily'),
    chat: (message) => api.post('/guidance/chat', { message }),
    getChatHistory: (params) => api.get('/guidance/chat/history', { params }),
    clearChatHistory: () => api.delete('/guidance/chat/history')
}

export default api
