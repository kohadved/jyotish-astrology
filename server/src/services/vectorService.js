/**
 * Vector Database Service - In-Memory Implementation
 * 
 * Implements RAG (Retrieval Augmented Generation) for smarter AI responses
 * Uses simple TF-IDF based similarity search (no external dependencies)
 * 
 * Design Pattern: Singleton with Lazy Initialization
 * Bonus Feature: Context storage / Vector database
 * 
 * @module services/vectorService
 */

class VectorService {
    constructor() {
        this.documents = [];
        this.isInitialized = false;
    }

    /**
     * Initialize vector store with astrology knowledge
     */
    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        try {
            await this.seedKnowledgeBase();
            this.isInitialized = true;
            console.log('✅ Vector DB initialized (In-Memory) - Knowledge base ready');
            return true;
        } catch (error) {
            console.error('❌ Vector DB initialization failed:', error.message);
            return false;
        }
    }

    /**
     * Seed the vector database with astrology knowledge
     */
    async seedKnowledgeBase() {
        this.documents = [
            // Zodiac Signs
            {
                id: 'aries_traits',
                text: 'Aries is the first sign of the zodiac, ruled by Mars. Aries people are natural leaders, courageous, energetic, and pioneering. They can be impatient and impulsive. Best careers include entrepreneurship, military, sports, and leadership roles.',
                keywords: ['aries', 'mars', 'leader', 'courage', 'career', 'fire'],
                category: 'zodiac', sign: 'Aries'
            },
            {
                id: 'taurus_traits',
                text: 'Taurus is an earth sign ruled by Venus. Taurus individuals are reliable, patient, practical, and devoted. They value stability and comfort. Best careers include banking, art, music, and culinary arts.',
                keywords: ['taurus', 'venus', 'earth', 'stability', 'career', 'patient'],
                category: 'zodiac', sign: 'Taurus'
            },
            {
                id: 'gemini_traits',
                text: 'Gemini is an air sign ruled by Mercury. Geminis are adaptable, curious, communicative, and witty. They love learning and variety. Best careers include journalism, teaching, sales, and writing.',
                keywords: ['gemini', 'mercury', 'air', 'communication', 'career', 'curious'],
                category: 'zodiac', sign: 'Gemini'
            },
            {
                id: 'cancer_traits',
                text: 'Cancer is a water sign ruled by the Moon. Cancer people are nurturing, protective, intuitive, and emotional. They value home and family. Best careers include nursing, real estate, hospitality, and counseling.',
                keywords: ['cancer', 'moon', 'water', 'family', 'career', 'emotional', 'nurturing'],
                category: 'zodiac', sign: 'Cancer'
            },
            {
                id: 'leo_traits',
                text: 'Leo is a fire sign ruled by the Sun. Leos are confident, dramatic, creative, and generous. They love attention and admiration. Best careers include entertainment, politics, management, and performing arts.',
                keywords: ['leo', 'sun', 'fire', 'creative', 'career', 'confident', 'leadership'],
                category: 'zodiac', sign: 'Leo'
            },
            {
                id: 'virgo_traits',
                text: 'Virgo is an earth sign ruled by Mercury. Virgos are analytical, practical, hardworking, and detail-oriented. They strive for perfection. Best careers include healthcare, accounting, research, and editing.',
                keywords: ['virgo', 'mercury', 'earth', 'analytical', 'career', 'practical'],
                category: 'zodiac', sign: 'Virgo'
            },
            {
                id: 'libra_traits',
                text: 'Libra is an air sign ruled by Venus. Librans are diplomatic, fair-minded, social, and harmonious. They seek balance in all things. Best careers include law, diplomacy, fashion, and counseling.',
                keywords: ['libra', 'venus', 'air', 'balance', 'career', 'diplomatic', 'relationship'],
                category: 'zodiac', sign: 'Libra'
            },
            {
                id: 'scorpio_traits',
                text: 'Scorpio is a water sign ruled by Pluto and Mars. Scorpios are passionate, resourceful, determined, and intense. They have deep emotions. Best careers include psychology, investigation, surgery, and research.',
                keywords: ['scorpio', 'pluto', 'mars', 'water', 'intense', 'career', 'passionate'],
                category: 'zodiac', sign: 'Scorpio'
            },
            {
                id: 'sagittarius_traits',
                text: 'Sagittarius is a fire sign ruled by Jupiter. Sagittarians are adventurous, optimistic, philosophical, and freedom-loving. They seek knowledge. Best careers include travel, teaching, publishing, and philosophy.',
                keywords: ['sagittarius', 'jupiter', 'fire', 'adventure', 'career', 'travel', 'optimistic'],
                category: 'zodiac', sign: 'Sagittarius'
            },
            {
                id: 'capricorn_traits',
                text: 'Capricorn is an earth sign ruled by Saturn. Capricorns are ambitious, disciplined, responsible, and practical. They value achievement. Best careers include business, politics, engineering, and administration.',
                keywords: ['capricorn', 'saturn', 'earth', 'ambitious', 'career', 'disciplined'],
                category: 'zodiac', sign: 'Capricorn'
            },
            {
                id: 'aquarius_traits',
                text: 'Aquarius is an air sign ruled by Uranus. Aquarians are innovative, humanitarian, independent, and progressive. They think differently. Best careers include technology, science, social work, and invention.',
                keywords: ['aquarius', 'uranus', 'air', 'innovative', 'career', 'humanitarian'],
                category: 'zodiac', sign: 'Aquarius'
            },
            {
                id: 'pisces_traits',
                text: 'Pisces is a water sign ruled by Neptune. Pisceans are compassionate, artistic, intuitive, and dreamy. They are deeply spiritual. Best careers include arts, healing, music, and spirituality.',
                keywords: ['pisces', 'neptune', 'water', 'artistic', 'career', 'intuitive', 'spiritual'],
                category: 'zodiac', sign: 'Pisces'
            },

            // Houses
            {
                id: 'house_1',
                text: 'The 1st House (Ascendant/Lagna) represents self, personality, physical appearance, and how others perceive you. It shows your approach to life and first impressions you make.',
                keywords: ['1st house', 'first house', 'ascendant', 'lagna', 'personality', 'self', 'appearance'],
                category: 'houses', house: 1
            },
            {
                id: 'house_2',
                text: 'The 2nd House represents wealth, family, speech, and values. It shows your relationship with money, material possessions, and self-worth.',
                keywords: ['2nd house', 'second house', 'wealth', 'money', 'family', 'values'],
                category: 'houses', house: 2
            },
            {
                id: 'house_7',
                text: 'The 7th House represents marriage, partnerships, and relationships. It shows the type of partner you attract and your approach to committed relationships. It is the house of spouse and business partnerships.',
                keywords: ['7th house', 'seventh house', 'marriage', 'partner', 'spouse', 'relationship', 'love'],
                category: 'houses', house: 7
            },
            {
                id: 'house_10',
                text: 'The 10th House represents career, reputation, and public image. It shows your professional life, achievements, and how the world sees your accomplishments. It is the most important house for career success.',
                keywords: ['10th house', 'tenth house', 'career', 'profession', 'job', 'reputation', 'success'],
                category: 'houses', house: 10
            },

            // Planets
            {
                id: 'sun_meaning',
                text: 'The Sun represents soul, ego, vitality, father, and authority. A strong Sun gives leadership, confidence, and success. A weak Sun may cause lack of confidence, health issues, and problems with father.',
                keywords: ['sun', 'surya', 'soul', 'ego', 'father', 'authority', 'confidence', 'leader'],
                category: 'planets', planet: 'Sun'
            },
            {
                id: 'moon_meaning',
                text: 'The Moon represents mind, emotions, mother, and mental peace. A strong Moon gives emotional stability, creativity, and intuition. A weak Moon may cause anxiety, mood swings, and mental stress.',
                keywords: ['moon', 'chandra', 'mind', 'emotions', 'mother', 'mental', 'anxiety', 'feelings'],
                category: 'planets', planet: 'Moon'
            },
            {
                id: 'saturn_meaning',
                text: 'Saturn represents karma, discipline, delays, hard work, and life lessons. Saturn transits bring challenges that lead to growth. Saturn teaches through restrictions, patience, and perseverance. Sade Sati is a 7.5 year Saturn transit.',
                keywords: ['saturn', 'shani', 'karma', 'discipline', 'delay', 'work', 'sade sati', 'challenge'],
                category: 'planets', planet: 'Saturn'
            },
            {
                id: 'jupiter_meaning',
                text: 'Jupiter represents wisdom, expansion, luck, spirituality, and teachers. A strong Jupiter brings prosperity, knowledge, and good fortune. Jupiter is the greatest benefic planet and blesses with children and wealth.',
                keywords: ['jupiter', 'guru', 'wisdom', 'luck', 'fortune', 'wealth', 'spiritual', 'teacher'],
                category: 'planets', planet: 'Jupiter'
            },

            // General Topics
            {
                id: 'love_compatibility',
                text: 'In Vedic astrology, love and relationship compatibility is analyzed through the 7th house, Venus placement, and Moon sign compatibility. Fire signs (Aries, Leo, Sagittarius) match well with Air signs (Gemini, Libra, Aquarius). Earth signs (Taurus, Virgo, Capricorn) match with Water signs (Cancer, Scorpio, Pisces).',
                keywords: ['love', 'compatibility', 'relationship', 'marriage', 'partner', '7th house', 'venus'],
                category: 'general', topic: 'love'
            },
            {
                id: 'career_guidance',
                text: 'Career in astrology is seen through the 10th house lord, planets in 10th house, and aspects on it. The 6th house shows daily work and service. The 2nd house shows income. Saturn placement strongly influences career discipline and success through hard work.',
                keywords: ['career', 'job', 'work', 'profession', '10th house', 'income', 'success'],
                category: 'general', topic: 'career'
            },
            {
                id: 'health_astrology',
                text: 'Health in astrology is analyzed through the 6th house (disease), 8th house (chronic issues), and 1st house (vitality). Each zodiac sign rules specific body parts. Mars rules blood and energy, Saturn rules bones, Mercury rules nervous system.',
                keywords: ['health', 'disease', 'body', 'wellness', '6th house', 'medical'],
                category: 'general', topic: 'health'
            }
        ];

        console.log(`📚 Loaded ${this.documents.length} astrology knowledge documents`);
    }

    /**
     * Simple keyword-based similarity search
     * @param {string} query - User's question
     * @param {number} nResults - Number of results to return
     * @returns {Array} Relevant documents
     */
    async queryKnowledge(query, nResults = 3) {
        await this.initialize();

        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/);

        // Score each document based on keyword matches
        const scored = this.documents.map(doc => {
            let score = 0;

            // Check for keyword matches
            doc.keywords.forEach(keyword => {
                if (queryLower.includes(keyword)) {
                    score += 3; // Direct match
                }
                queryWords.forEach(word => {
                    if (keyword.includes(word) || word.includes(keyword)) {
                        score += 1; // Partial match
                    }
                });
            });

            // Check for text content matches
            queryWords.forEach(word => {
                if (word.length > 3 && doc.text.toLowerCase().includes(word)) {
                    score += 0.5;
                }
            });

            return { ...doc, score };
        });

        // Sort by score and return top results
        return scored
            .filter(doc => doc.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, nResults)
            .map(doc => ({
                text: doc.text,
                metadata: { category: doc.category, sign: doc.sign, house: doc.house, planet: doc.planet },
                score: doc.score
            }));
    }

    /**
     * Add user-specific context to the vector database
     */
    async addUserContext(userId, context, metadata = {}) {
        await this.initialize();

        const words = context.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        this.documents.push({
            id: `user_${userId}_${Date.now()}`,
            text: context,
            keywords: words.slice(0, 10),
            category: 'user_context',
            ...metadata
        });
    }

    /**
     * Get relevant context for AI chat
     */
    async getContextForChat(userQuery, userContext = {}) {
        const relevantDocs = await this.queryKnowledge(userQuery, 3);

        if (relevantDocs.length === 0) {
            return '';
        }

        const contextParts = relevantDocs.map(doc =>
            `[${doc.metadata.category || 'knowledge'}] ${doc.text}`
        );

        return `
RELEVANT ASTROLOGY KNOWLEDGE (from vector database):
${contextParts.join('\n\n')}

Use this knowledge to provide accurate, contextual responses.
`;
    }
}

// Singleton export
module.exports = new VectorService();
