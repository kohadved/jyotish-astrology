/**
 * AI Service - Groq-Powered with RAG (Vector Database)
 * 
 * Architecture Pattern: RAG (Retrieval Augmented Generation)
 * - Uses ChromaDB vector database for context storage
 * - Retrieves relevant astrology knowledge before generating responses
 * - Provides more accurate, context-aware AI responses
 * 
 * @module services/aiService
 */

const Groq = require('groq-sdk');
const vectorService = require('./vectorService');

class AIService {
    constructor() {
        this.groq = null;
        this.isInitialized = false;
    }

    /**
     * Initialize Groq client (Lazy initialization pattern)
     */
    initialize() {
        if (!this.isInitialized && process.env.GROQ_API_KEY) {
            try {
                this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
                this.isInitialized = true;
                console.log('✅ Groq AI initialized (Llama 3.3 70B)');
            } catch (error) {
                console.error('❌ Groq initialization failed:', error.message);
            }
        }
        return this.groq;
    }

    /**
     * Generate content using Groq's Llama model
     */
    async generateContent(prompt, systemPrompt = 'You are a helpful assistant.') {
        const groq = this.initialize();

        if (!groq) {
            return null;
        }

        try {
            const response = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 500
            });

            return {
                text: response.choices[0]?.message?.content || '',
                provider: 'groq'
            };
        } catch (error) {
            console.error('Groq API error:', error.message);
            return null;
        }
    }

    /**
     * Generate personalized daily guidance based on zodiac sign
     * Uses vector DB for context-aware guidance
     */
    async generateDailyGuidance(zodiacSign, userName) {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // RAG: Retrieve relevant zodiac knowledge from vector DB
        const vectorContext = await vectorService.getContextForChat(
            `${zodiacSign} daily guidance horoscope traits`,
            { zodiacSign }
        );

        const prompt = `Generate a personalized daily guidance message for ${userName || 'the seeker'}, who is a ${zodiacSign}.

Today is ${today}.

${vectorContext}

Please provide:
1. A warm greeting with their zodiac emoji
2. Today's cosmic energy overview (2-3 sentences)
3. Key focus area for the day
4. A piece of actionable advice
5. An inspirational closing thought

Keep the tone warm, encouraging, and mystical but not overly dramatic. Around 150-200 words.`;

        const result = await this.generateContent(prompt,
            'You are Jyotish, a wise and mystical astrologer who provides cosmic guidance with warmth and wisdom. Use the astrological knowledge provided to give accurate, personalized guidance.'
        );

        if (result) {
            return {
                message: result.text,
                generatedAt: new Date().toISOString(),
                zodiacSign,
                source: 'ai',
                provider: 'groq',
                ragEnabled: true
            };
        }

        return this.getFallbackGuidance(zodiacSign);
    }

    /**
     * Interactive chat with AI astrologer
     * Uses RAG for context-aware responses
     */
    async chat(messages, userContext) {
        const groq = this.initialize();

        if (!groq) {
            return {
                role: 'assistant',
                content: this.getFallbackChatResponse(userContext),
                provider: 'fallback'
            };
        }

        // Get the latest user message for context retrieval
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();

        // RAG: Retrieve relevant knowledge from vector database
        let vectorContext = '';
        if (lastUserMessage) {
            vectorContext = await vectorService.getContextForChat(
                lastUserMessage.content,
                userContext
            );
        }

        const systemPrompt = `You are Jyotish, a friendly and knowledgeable AI astrology assistant powered by Vedic astrology wisdom.

USER CONTEXT:
- Name: ${userContext.name}
- Zodiac Sign: ${userContext.zodiacSign}
- Date of Birth: ${userContext.dateOfBirth}
- Place of Birth: ${userContext.placeOfBirth}

${vectorContext}

GUIDELINES:
1. Be warm, mystical, and encouraging
2. Use the RELEVANT ASTROLOGY KNOWLEDGE provided above to give accurate answers
3. Reference their zodiac traits in your answers
4. Keep responses concise (100-200 words)
5. Never provide medical, legal, or financial advice
6. Use occasional emojis for warmth ✨🌙⭐`;

        try {
            const chatMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({
                    role: m.role === 'assistant' ? 'assistant' : 'user',
                    content: m.content
                }))
            ];

            const response = await groq.chat.completions.create({
                messages: chatMessages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 400
            });

            // Store the conversation context in vector DB for future reference
            if (lastUserMessage) {
                vectorService.addUserContext(
                    userContext.userId || 'anonymous',
                    `User asked: ${lastUserMessage.content}`,
                    { zodiacSign: userContext.zodiacSign, topic: 'chat' }
                );
            }

            return {
                role: 'assistant',
                content: response.choices[0]?.message?.content || this.getFallbackChatResponse(userContext),
                provider: 'groq',
                ragEnabled: true
            };
        } catch (error) {
            console.error('Groq chat error:', error.message);
            return {
                role: 'assistant',
                content: this.getFallbackChatResponse(userContext),
                provider: 'fallback'
            };
        }
    }

    /**
     * Curated fallback guidance messages by zodiac sign
     */
    getFallbackGuidance(zodiacSign) {
        const guidances = {
            Aries: "🔥 Greetings, brave Aries! Today's fiery energy aligns with your natural warrior spirit. The cosmos encourages you to channel your passion into productive endeavors. Focus on initiating new projects, but remember to pause and breathe before making important decisions. Your natural leadership will shine through—trust your instincts while remaining open to others' perspectives. May your day be filled with courage and victory!",
            Taurus: "🌍 Dear Taurus, the earth beneath you is stable and supportive today. The celestial energies favor patience and persistence. Trust in the slow and steady approach that has always served you well. Focus on nurturing your relationships and appreciating life's simple pleasures. Your unwavering determination will lead to lasting success.",
            Gemini: "🌬️ Curious Gemini, your twin nature finds harmony today! Communication flows easily—use this gift to connect deeply with others. Your adaptable mind is your greatest asset. Embrace new ideas and share your knowledge. The stars encourage intellectual pursuits and meaningful conversations.",
            Cancer: "🌙 Gentle Cancer, the moon wraps you in protective light today. Honor your emotions and let your intuition guide you. Home and family matters bring joy. Your nurturing nature is needed—offer your care freely. Trust your gut feelings, for they are especially accurate now.",
            Leo: "☀️ Magnificent Leo, the sun shines brightly on your path today! Your natural radiance attracts positive attention. Share your warmth generously. Creative expression is favored—let your inner artist shine. Your confidence and generosity will inspire those around you.",
            Virgo: "🌿 Thoughtful Virgo, details that others miss will be clear to your discerning eye today. Trust your analytical gifts while remaining open to imperfection. Focus on organization and self-improvement. Your dedication to excellence serves you well.",
            Libra: "⚖️ Graceful Libra, balance is your gift, and today it serves you well. Harmony in relationships comes naturally. Trust your sense of justice and create beauty wherever you go. Artistic and romantic energies are heightened.",
            Scorpio: "🦂 Intense Scorpio, deep waters reveal hidden truths today. Your transformative power is strong—use it wisely. Intuition is especially sharp; trust those deep insights. The stars support profound emotional and spiritual growth.",
            Sagittarius: "🏹 Adventurous Sagittarius, the call to adventure beckons! Expansion awaits through travel, learning, or philosophy. Aim your arrow high. Your optimism is contagious—spread it generously. The universe supports your quest for truth.",
            Capricorn: "🏔️ Steadfast Capricorn, your steady climb continues with purpose. Structure and discipline are your allies. The summit is closer than you realize. Balance ambition with self-care. The stars honor your dedication.",
            Aquarius: "💫 Visionary Aquarius, innovation flows through you today! Your unique perspective offers solutions others cannot see. Embrace your individuality and inspire positive change. The cosmos supports forward-thinking ideas.",
            Pisces: "🌊 Mystical Pisces, creative and spiritual energy embraces you today. Trust your dreams and artistic impulses. Your compassion is a gift—share it freely. Intuition flows strongly; pay attention to synchronicities."
        };

        return {
            message: guidances[zodiacSign] || guidances.Aries,
            generatedAt: new Date().toISOString(),
            zodiacSign,
            source: 'fallback',
            provider: 'curated',
            notice: 'AI guidance requires GROQ_API_KEY. Get free key at console.groq.com'
        };
    }

    /**
     * Fallback chat response when AI is unavailable
     */
    getFallbackChatResponse(userContext) {
        return `Namaste, ${userContext.name}! ✨ As a ${userContext.zodiacSign}, you carry unique cosmic gifts. To enable AI chat, please add your free Groq API key from console.groq.com. In the meantime, explore your zodiac profile and Kundli chart on the dashboard!`;
    }
}

module.exports = new AIService();
