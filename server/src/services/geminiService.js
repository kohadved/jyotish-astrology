/**
 * Gemini AI Service
 * 
 * Design Pattern: Singleton with Strategy Pattern for fallbacks
 * - Uses Google's Gemini AI for text generation
 * - Implements graceful fallback when API is unavailable
 * - Maintains chat context for conversational AI
 * 
 * @module services/geminiService
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this.genAI = null;
        this.model = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the Gemini client (Lazy initialization pattern)
     * @returns {Object|null} The Gemini model instance or null
     */
    initialize() {
        if (!this.isInitialized && process.env.GEMINI_API_KEY) {
            try {
                this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                // Using gemini-2.0-flash - Google's latest fast model
                this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                this.isInitialized = true;
                console.log('✅ Gemini AI initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Gemini:', error.message);
                this.isInitialized = false;
            }
        }
        return this.model;
    }

    /**
     * Generate personalized daily guidance based on zodiac sign
     * @param {string} zodiacSign - User's zodiac sign
     * @param {string} userName - User's name for personalization
     * @returns {Object} Guidance object with message and metadata
     */
    async generateDailyGuidance(zodiacSign, userName) {
        const model = this.initialize();

        if (!model) {
            console.log('ℹ️ Using fallback guidance (Gemini not available)');
            return this.getFallbackGuidance(zodiacSign);
        }

        try {
            const today = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const prompt = `You are a wise and compassionate astrologer. Generate a personalized daily guidance message for ${userName || 'the seeker'}, who is a ${zodiacSign}.

Today is ${today}.

Please provide:
1. A warm greeting
2. Today's cosmic energy overview (2-3 sentences)
3. Key focus area for the day
4. A piece of actionable advice
5. An inspirational closing thought

Keep the tone warm, encouraging, and mystical but not overly dramatic. The total response should be around 150-200 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                message: text,
                generatedAt: new Date().toISOString(),
                zodiacSign,
                source: 'ai'
            };
        } catch (error) {
            console.error('Gemini API error:', error.message);
            // Strategy Pattern: Fallback to pre-written guidance
            return this.getFallbackGuidance(zodiacSign);
        }
    }

    /**
     * Interactive chat with AI about astrology topics
     * @param {Array} messages - Conversation history
     * @param {Object} userContext - User's profile for personalization
     * @returns {Object} AI response with role and content
     */
    async chat(messages, userContext) {
        const model = this.initialize();

        if (!model) {
            return {
                role: 'assistant',
                content: this.getFallbackChatResponse(userContext)
            };
        }

        try {
            const systemPrompt = `You are Melooha, a friendly and knowledgeable AI astrology assistant. You help users understand their astrological charts, zodiac signs, and provide spiritual guidance.

User Context:
- Name: ${userContext.name}
- Zodiac Sign: ${userContext.zodiacSign}
- Date of Birth: ${userContext.dateOfBirth}
- Place of Birth: ${userContext.placeOfBirth}

Guidelines:
1. Be warm, mystical, and encouraging
2. Provide astrological insights when relevant
3. You can discuss horoscopes, planetary influences, compatibility, and spiritual growth
4. Keep responses concise but meaningful (100-200 words typically)
5. If asked about non-astrology topics, gently guide back to astrology or provide brief help
6. Never provide medical, legal, or financial advice`;

            // Build conversation history for context
            const conversationHistory = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // Create chat session with history
            const chat = model.startChat({
                history: [
                    { role: 'user', parts: [{ text: systemPrompt }] },
                    { role: 'model', parts: [{ text: 'I understand. I am Melooha, your cosmic guide. I\'m ready to help with astrological insights.' }] },
                    ...conversationHistory.slice(0, -1)
                ]
            });

            // Send the last user message
            const lastMessage = messages[messages.length - 1];
            const result = await chat.sendMessage(lastMessage.content);
            const response = await result.response;
            const text = response.text();

            return {
                role: 'assistant',
                content: text
            };
        } catch (error) {
            console.error('Gemini chat error:', error.message);
            return {
                role: 'assistant',
                content: this.getFallbackChatResponse(userContext)
            };
        }
    }

    /**
     * Fallback guidance when API is unavailable
     * Uses pre-written, zodiac-specific messages
     * @param {string} zodiacSign - User's zodiac sign
     * @returns {Object} Fallback guidance object
     */
    getFallbackGuidance(zodiacSign) {
        const guidances = {
            Aries: "🔥 Greetings, brave Aries! Today's fiery energy aligns with your natural warrior spirit. The cosmos encourages you to channel your passion into productive endeavors. Focus on initiating new projects, but remember to pause and breathe before making important decisions. Your natural leadership will shine through—trust your instincts while remaining open to others' perspectives. May your day be filled with courage and victory!",
            Taurus: "🌍 Dear Taurus, the earth beneath you is stable and supportive today. The celestial energies favor patience and persistence. Trust in the slow and steady approach that has always served you well. Beauty and comfort await those who are patient. Focus on nurturing your relationships and appreciating life's simple pleasures. Your unwavering determination will lead to lasting success.",
            Gemini: "🌬️ Curious Gemini, your twin nature finds harmony today! Both sides of your personality can work together beautifully. Communication flows easily—use this gift to connect deeply with others. Your adaptable mind is your greatest asset today. Embrace new ideas and share your knowledge. The stars encourage intellectual pursuits and meaningful conversations.",
            Cancer: "🌙 Gentle Cancer, the moon, your celestial guardian, wraps you in protective light today. Honor your emotions and let your intuition guide you. Home and family matters bring joy and fulfillment. Your nurturing nature is needed—offer your care to those who need it. Trust your gut feelings, for they are especially accurate now. Create a sanctuary of peace around you.",
            Leo: "☀️ Magnificent Leo, the sun shines brightly on your path today! Your natural radiance attracts positive attention and opportunities. Share your warmth generously, and leadership opportunities may arise. Creative expression is favored—let your inner artist shine. Remember that true royalty lies in lifting others up. Your confidence and generosity will inspire those around you.",
            Virgo: "🌿 Thoughtful Virgo, details that others miss will be clear to your discerning eye today. Your practical wisdom is needed—trust your analytical gifts while remaining open to imperfection. Focus on organization and self-improvement, but don't forget to celebrate your achievements. Your dedication to excellence serves you well. Take time for self-care and reflection.",
            Libra: "⚖️ Graceful Libra, balance is your gift, and today it serves you well. Harmony in relationships comes naturally. Trust your sense of justice and create beauty wherever you go. Diplomatic skills are especially strong now—use them to bridge divides. Artistic and romantic energies are heightened. Seek equilibrium in all things and peace will follow.",
            Scorpio: "🦂 Intense Scorpio, deep waters run within you today, revealing hidden truths. Your transformative power is strong—use it wisely to heal and regenerate what needs renewal. Intuition is especially sharp now; trust those deep insights. Embrace vulnerability as strength. The stars support profound emotional and spiritual growth. Let go of what no longer serves you.",
            Sagittarius: "🏹 Adventurous Sagittarius, the call to adventure beckons! Whether through travel, learning, or philosophy, expansion awaits. Aim your arrow high and trust it will find its mark. Your optimism is contagious—spread it generously. Seek wisdom in new experiences and different perspectives. The universe supports your quest for truth and meaning.",
            Capricorn: "🏔️ Steadfast Capricorn, your steady climb continues with purpose today. Structure and discipline are your allies. The summit you seek is closer than you realize. Your hard work is building something lasting—trust the process. Balance ambition with self-care. The stars honor your dedication and promise rewards for your persistence.",
            Aquarius: "💫 Visionary Aquarius, innovation flows through you like electricity today! Your unique perspective offers solutions others cannot see. Embrace your individuality and inspire positive change. Connect with like-minded souls who share your dreams for a better world. The cosmos supports humanitarian efforts and forward-thinking ideas. Be the change you wish to see.",
            Pisces: "🌊 Mystical Pisces, the cosmic ocean embraces you with creative and spiritual energy today. Trust your dreams and artistic impulses. Your compassion is a gift to the world—share it freely. Intuition flows strongly; pay attention to symbols and synchronicities. Creative and spiritual pursuits are especially favored. Let your imagination guide you to beautiful destinations."
        };

        return {
            message: guidances[zodiacSign] || guidances.Aries,
            generatedAt: new Date().toISOString(),
            zodiacSign,
            source: 'fallback',
            notice: 'Using curated daily guidance. AI guidance available when API quota resets.'
        };
    }

    /**
     * Fallback chat response when API is unavailable
     * @param {Object} userContext - User's profile context
     * @returns {string} Fallback chat message
     */
    getFallbackChatResponse(userContext) {
        const responses = [
            `Namaste, ${userContext.name}! As a ${userContext.zodiacSign}, you carry unique cosmic gifts. While my full wisdom is recharging, know that the stars are always watching over you. What specific aspect of your astrological journey would you like to explore?`,
            `The cosmic energies are settling, dear ${userContext.zodiacSign}. In this moment of pause, reflect on your inner light. Your birth chart holds infinite wisdom waiting to be discovered. Is there a particular area of your life where you seek celestial guidance?`,
            `Greetings, ${userContext.name}! The universe moves in mysterious cycles, and so does my cosmic connection. As a ${userContext.zodiacSign}, you have natural strengths that guide you through any challenge. What questions does your soul wish to ask the stars?`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Singleton pattern - export single instance
module.exports = new GeminiService();
