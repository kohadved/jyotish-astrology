const prokeralaService = require('../services/prokeralaService');

// Zodiac sign information database
const zodiacInfo = {
    Aries: {
        element: 'Fire',
        rulingPlanet: 'Mars',
        symbol: '♈',
        dates: 'March 21 - April 19',
        traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic'],
        compatibility: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
        luckyNumbers: [1, 8, 17],
        luckyColors: ['Red', 'Scarlet'],
        description: 'Aries is the first sign of the zodiac, symbolizing new beginnings and bold action. Those born under this sign are natural leaders, full of energy and enthusiasm.'
    },
    Taurus: {
        element: 'Earth',
        rulingPlanet: 'Venus',
        symbol: '♉',
        dates: 'April 20 - May 20',
        traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible'],
        compatibility: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
        luckyNumbers: [2, 6, 9, 12, 24],
        luckyColors: ['Green', 'Pink'],
        description: 'Taurus is an earth sign represented by the bull. Taureans are known for their reliability, practicality, and devotion to those they love.'
    },
    Gemini: {
        element: 'Air',
        rulingPlanet: 'Mercury',
        symbol: '♊',
        dates: 'May 21 - June 20',
        traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick learner'],
        compatibility: ['Libra', 'Aquarius', 'Aries', 'Leo'],
        luckyNumbers: [5, 7, 14, 23],
        luckyColors: ['Light Green', 'Yellow'],
        description: 'Gemini is an air sign symbolized by the twins. Geminis are known for their versatility, communication skills, and intellectual curiosity.'
    },
    Cancer: {
        element: 'Water',
        rulingPlanet: 'Moon',
        symbol: '♋',
        dates: 'June 21 - July 22',
        traits: ['Tenacious', 'Highly imaginative', 'Loyal', 'Emotional', 'Persuasive'],
        compatibility: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
        luckyNumbers: [2, 3, 15, 20],
        luckyColors: ['White', 'Silver'],
        description: 'Cancer is a water sign symbolized by the crab. Those born under this sign are deeply intuitive and sentimental, valuing home and family above all.'
    },
    Leo: {
        element: 'Fire',
        rulingPlanet: 'Sun',
        symbol: '♌',
        dates: 'July 23 - August 22',
        traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
        compatibility: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
        luckyNumbers: [1, 3, 10, 19],
        luckyColors: ['Gold', 'Orange', 'Yellow'],
        description: 'Leo is a fire sign symbolized by the lion. Leos are natural-born leaders with a flair for drama and creativity.'
    },
    Virgo: {
        element: 'Earth',
        rulingPlanet: 'Mercury',
        symbol: '♍',
        dates: 'August 23 - September 22',
        traits: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
        compatibility: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
        luckyNumbers: [5, 14, 15, 23, 32],
        luckyColors: ['Grey', 'Beige', 'Pale Yellow'],
        description: 'Virgo is an earth sign known for its attention to detail and methodical approach to life. Virgos are deeply caring and always strive for perfection.'
    },
    Libra: {
        element: 'Air',
        rulingPlanet: 'Venus',
        symbol: '♎',
        dates: 'September 23 - October 22',
        traits: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
        compatibility: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
        luckyNumbers: [4, 6, 13, 15, 24],
        luckyColors: ['Pink', 'Blue'],
        description: 'Libra is an air sign symbolized by the scales. Librans are known for their love of balance, harmony, and justice.'
    },
    Scorpio: {
        element: 'Water',
        rulingPlanet: 'Pluto, Mars',
        symbol: '♏',
        dates: 'October 23 - November 21',
        traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'True friend'],
        compatibility: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
        luckyNumbers: [8, 11, 18, 22],
        luckyColors: ['Scarlet', 'Rust', 'Red'],
        description: 'Scorpio is a water sign known for its intensity and passion. Scorpios are resourceful, determined, and fiercely loyal.'
    },
    Sagittarius: {
        element: 'Fire',
        rulingPlanet: 'Jupiter',
        symbol: '♐',
        dates: 'November 22 - December 21',
        traits: ['Generous', 'Idealistic', 'Great sense of humor', 'Adventurous', 'Optimistic'],
        compatibility: ['Aries', 'Leo', 'Libra', 'Aquarius'],
        luckyNumbers: [3, 7, 9, 12, 21],
        luckyColors: ['Blue', 'Purple'],
        description: 'Sagittarius is a fire sign symbolized by the archer. Sagittarians are known for their love of freedom, adventure, and philosophical thinking.'
    },
    Capricorn: {
        element: 'Earth',
        rulingPlanet: 'Saturn',
        symbol: '♑',
        dates: 'December 22 - January 19',
        traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers', 'Ambitious'],
        compatibility: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
        luckyNumbers: [4, 8, 13, 22],
        luckyColors: ['Brown', 'Black', 'Grey'],
        description: 'Capricorn is an earth sign symbolized by the sea-goat. Capricorns are known for their ambition, determination, and practical approach to life.'
    },
    Aquarius: {
        element: 'Air',
        rulingPlanet: 'Uranus, Saturn',
        symbol: '♒',
        dates: 'January 20 - February 18',
        traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
        compatibility: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
        luckyNumbers: [4, 7, 11, 22, 29],
        luckyColors: ['Blue', 'Blue-green', 'Grey'],
        description: 'Aquarius is an air sign symbolized by the water-bearer. Aquarians are known for their progressive thinking and humanitarian values.'
    },
    Pisces: {
        element: 'Water',
        rulingPlanet: 'Neptune, Jupiter',
        symbol: '♓',
        dates: 'February 19 - March 20',
        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
        compatibility: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
        luckyNumbers: [3, 9, 12, 15, 18, 24],
        luckyColors: ['Mauve', 'Lilac', 'Purple', 'Violet', 'Sea green'],
        description: 'Pisces is a water sign symbolized by two fish. Pisceans are known for their empathy, artistic talents, and deep emotional sensitivity.'
    }
};

// @desc    Get user's zodiac sign info
// @route   GET /api/astrology/zodiac
// @access  Private
exports.getZodiacInfo = async (req, res) => {
    try {
        const userZodiac = req.user.zodiacSign;

        if (!userZodiac || !zodiacInfo[userZodiac]) {
            return res.status(400).json({ error: 'Zodiac sign not found for user' });
        }

        res.json({
            zodiacSign: userZodiac,
            ...zodiacInfo[userZodiac]
        });
    } catch (error) {
        console.error('Get zodiac info error:', error);
        res.status(500).json({ error: 'Failed to get zodiac information' });
    }
};

// @desc    Get user's Kundli/birth chart
// @route   GET /api/astrology/kundli
// @access  Private
exports.getKundli = async (req, res) => {
    try {
        const user = req.user;

        // Format datetime from user's birth details
        const dob = new Date(user.dateOfBirth);
        const [hours, minutes] = user.timeOfBirth.split(':');
        dob.setHours(parseInt(hours), parseInt(minutes), 0);

        const dateTime = dob.toISOString();

        // Default coordinates (can be enhanced with geocoding)
        const latitude = user.coordinates?.latitude || 28.6139; // Default to Delhi
        const longitude = user.coordinates?.longitude || 77.2090;

        try {
            // Try to fetch from Prokerala API
            const kundliData = await prokeralaService.getKundli(
                dateTime,
                latitude,
                longitude,
                user.timezone || 'Asia/Kolkata'
            );

            res.json({
                kundli: kundliData,
                birthDetails: {
                    dateOfBirth: user.dateOfBirth,
                    timeOfBirth: user.timeOfBirth,
                    placeOfBirth: user.placeOfBirth
                }
            });
        } catch (apiError) {
            // Fallback to basic chart data if API fails
            console.log('Prokerala API unavailable, using fallback data');

            res.json({
                kundli: generateFallbackKundli(user),
                birthDetails: {
                    dateOfBirth: user.dateOfBirth,
                    timeOfBirth: user.timeOfBirth,
                    placeOfBirth: user.placeOfBirth
                },
                notice: 'Using calculated data. Connect Prokerala API for detailed charts.'
            });
        }
    } catch (error) {
        console.error('Get Kundli error:', error);
        res.status(500).json({ error: 'Failed to generate Kundli' });
    }
};

// @desc    Get daily horoscope
// @route   GET /api/astrology/daily-horoscope
// @access  Private
exports.getDailyHoroscope = async (req, res) => {
    try {
        const userZodiac = req.user.zodiacSign;

        try {
            const horoscope = await prokeralaService.getDailyHoroscope(userZodiac);
            res.json({
                zodiacSign: userZodiac,
                horoscope: horoscope
            });
        } catch (apiError) {
            // Fallback horoscope if API fails
            res.json({
                zodiacSign: userZodiac,
                horoscope: generateFallbackHoroscope(userZodiac),
                notice: 'Using generated horoscope. Connect Prokerala API for daily updates.'
            });
        }
    } catch (error) {
        console.error('Get horoscope error:', error);
        res.status(500).json({ error: 'Failed to get daily horoscope' });
    }
};

// @desc    Get Panchang for today
// @route   GET /api/astrology/panchang
// @access  Private
exports.getPanchang = async (req, res) => {
    try {
        const user = req.user;
        const today = new Date().toISOString();

        const latitude = user.coordinates?.latitude || 28.6139;
        const longitude = user.coordinates?.longitude || 77.2090;

        try {
            const panchang = await prokeralaService.getPanchang(
                today,
                latitude,
                longitude,
                user.timezone || 'Asia/Kolkata'
            );

            res.json({ panchang });
        } catch (apiError) {
            res.json({
                panchang: generateFallbackPanchang(),
                notice: 'Using basic Panchang. Connect Prokerala API for accurate data.'
            });
        }
    } catch (error) {
        console.error('Get Panchang error:', error);
        res.status(500).json({ error: 'Failed to get Panchang' });
    }
};

// Fallback functions when API is not available
function generateFallbackKundli(user) {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const houses = Array.from({ length: 12 }, (_, i) => i + 1);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    const yogas = [
        'Gajakesari Yoga', 'Budhaditya Yoga', 'Chandra-Mangal Yoga',
        'Hamsa Yoga', 'Malavya Yoga', 'Sasa Yoga', 'Ruchaka Yoga'
    ];

    // Generate seeded random positions based on birth date
    const seed = new Date(user.dateOfBirth).getTime();
    const seededRandom = (index) => {
        const x = Math.sin(seed + index) * 10000;
        return x - Math.floor(x);
    };

    const planetPositions = planets.map((planet, index) => ({
        planet,
        sign: signs[Math.floor(seededRandom(index) * 12)],
        house: Math.floor(seededRandom(index + 10) * 12) + 1,
        degree: Math.floor(seededRandom(index + 20) * 30),
        retrograde: planet !== 'Sun' && planet !== 'Moon' && seededRandom(index + 30) > 0.75
    }));

    // Calculate Dasha based on Moon's nakshatra
    const dashaLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const currentDashaIndex = Math.floor(seededRandom(500) * 9);
    const antardashaIndex = (currentDashaIndex + Math.floor(seededRandom(600) * 4)) % 9;

    // Detect Yogas based on planetary positions
    const detectedYogas = [];
    const moonPos = planetPositions.find(p => p.planet === 'Moon');
    const jupiterPos = planetPositions.find(p => p.planet === 'Jupiter');
    const sunPos = planetPositions.find(p => p.planet === 'Sun');
    const mercuryPos = planetPositions.find(p => p.planet === 'Mercury');

    // Gajakesari Yoga: Moon and Jupiter in kendras from each other
    if (moonPos && jupiterPos) {
        const diff = Math.abs(moonPos.house - jupiterPos.house);
        if (diff === 0 || diff === 4 || diff === 7 || diff === 10) {
            detectedYogas.push('Gajakesari Yoga - Wisdom & Fame');
        }
    }

    // Budhaditya Yoga: Sun and Mercury conjunction
    if (sunPos && mercuryPos && sunPos.sign === mercuryPos.sign) {
        detectedYogas.push('Budhaditya Yoga - Intelligence');
    }

    // Add some common yogas based on seed
    if (seededRandom(700) > 0.5) detectedYogas.push('Chandra-Mangal Yoga - Wealth');
    if (seededRandom(800) > 0.6) detectedYogas.push('Raja Yoga - Success');
    if (seededRandom(900) > 0.7) detectedYogas.push('Dhana Yoga - Prosperity');

    const ascendantIndex = Math.floor(seededRandom(100) * 12);
    const moonSignIndex = Math.floor(seededRandom(101) * 12);
    const nakshatraIndex = Math.floor(seededRandom(200) * 27);

    return {
        ascendant: signs[ascendantIndex],
        ascendantDegree: Math.floor(seededRandom(150) * 30),
        moonSign: signs[moonSignIndex],
        sunSign: user.zodiacSign,
        nakshatra: nakshatras[nakshatraIndex],
        nakshatraPada: Math.floor(seededRandom(250) * 4) + 1,
        planetPositions,
        houses: houses.map((num, i) => ({
            house: num,
            sign: signs[(ascendantIndex + i) % 12]
        })),
        yogas: detectedYogas.length > 0 ? detectedYogas : ['Shubha Yoga - Auspicious', 'Dhana Yoga - Prosperity'],
        currentDasha: `${dashaLords[currentDashaIndex]} Mahadasha`,
        antardasha: `${dashaLords[antardashaIndex]} Antardasha`,
        dashaEnd: `${2025 + Math.floor(seededRandom(700) * 15)}-${2030 + Math.floor(seededRandom(800) * 10)}`
    };
}

function generateFallbackHoroscope(zodiacSign) {
    const predictions = {
        general: `Today brings new opportunities for ${zodiacSign}. Trust your instincts and embrace the changes coming your way.`,
        love: 'Romance is in the air. Express your feelings openly to strengthen bonds.',
        career: 'Professional growth is highlighted. Take initiative on pending projects.',
        health: 'Focus on self-care and maintain a balanced routine.',
        luckyTime: '2:00 PM - 4:00 PM'
    };

    return {
        date: new Date().toISOString().split('T')[0],
        ...predictions
    };
}

function generateFallbackPanchang() {
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
        'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha'];
    const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana'];

    const today = new Date();
    const dayIndex = today.getDate();

    return {
        date: today.toISOString().split('T')[0],
        tithi: tithis[dayIndex % tithis.length],
        nakshatra: nakshatras[dayIndex % nakshatras.length],
        yoga: yogas[dayIndex % yogas.length],
        sunrise: '06:45 AM',
        sunset: '06:15 PM',
        moonrise: '08:30 PM',
        rahukaal: '10:30 AM - 12:00 PM'
    };
}
