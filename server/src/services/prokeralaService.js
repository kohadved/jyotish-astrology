const axios = require('axios');

class ProkeralaService {
    constructor() {
        this.baseUrl = 'https://api.prokerala.com/v2';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    // Get OAuth2 access token
    async getAccessToken() {
        // Return cached token if still valid
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post('https://api.prokerala.com/token', {
                grant_type: 'client_credentials',
                client_id: process.env.PROKERALA_CLIENT_ID,
                client_secret: process.env.PROKERALA_CLIENT_SECRET
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            // Set expiry 5 minutes before actual expiry
            this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

            return this.accessToken;
        } catch (error) {
            console.error('Prokerala token error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with astrology service');
        }
    }

    // Make authenticated API request
    async makeRequest(endpoint, params) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.get(`${this.baseUrl}${endpoint}`, {
                params,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Prokerala API error:', error.response?.data || error.message);
            throw error;
        }
    }

    // Get birth chart (Kundli)
    async getKundli(dateTime, latitude, longitude, timezone = 'Asia/Kolkata') {
        return this.makeRequest('/astrology/kundli', {
            datetime: dateTime,
            coordinates: `${latitude},${longitude}`,
            ayanamsa: 1, // Lahiri
            la: 'en' // language
        });
    }

    // Get planetary positions
    async getPlanetPositions(dateTime, latitude, longitude, timezone = 'Asia/Kolkata') {
        return this.makeRequest('/astrology/planet-position', {
            datetime: dateTime,
            coordinates: `${latitude},${longitude}`,
            ayanamsa: 1
        });
    }

    // Get daily horoscope
    async getDailyHoroscope(zodiacSign) {
        const signMap = {
            'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
            'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
            'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
        };

        return this.makeRequest('/horoscope/daily', {
            sign: signMap[zodiacSign] || 1,
            datetime: new Date().toISOString().split('T')[0]
        });
    }

    // Get Panchang
    async getPanchang(date, latitude, longitude, timezone = 'Asia/Kolkata') {
        return this.makeRequest('/astrology/panchang', {
            datetime: date,
            coordinates: `${latitude},${longitude}`,
            ayanamsa: 1
        });
    }
}

module.exports = new ProkeralaService();
