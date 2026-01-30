const aiService = require('../services/aiService');
const ChatMessage = require('../models/ChatMessage');

// @desc    Get AI-generated daily guidance
// @route   GET /api/guidance/daily
// @access  Private
exports.getDailyGuidance = async (req, res) => {
    try {
        const user = req.user;

        const guidance = await aiService.generateDailyGuidance(
            user.zodiacSign,
            user.name
        );

        res.json({
            success: true,
            guidance
        });
    } catch (error) {
        console.error('Get daily guidance error:', error);
        res.status(500).json({ error: 'Failed to generate daily guidance' });
    }
};

// @desc    Chat with AI assistant
// @route   POST /api/guidance/chat
// @access  Private
exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Save user message to history
        await ChatMessage.create({
            user: user._id,
            role: 'user',
            content: message.trim()
        });

        // Get recent chat history for context
        const recentMessages = await ChatMessage.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Reverse to get chronological order
        const messages = recentMessages.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Generate AI response
        const userContext = {
            name: user.name,
            zodiacSign: user.zodiacSign,
            dateOfBirth: user.dateOfBirth,
            placeOfBirth: user.placeOfBirth
        };

        const aiResponse = await aiService.chat(messages, userContext);

        // Save AI response to history
        await ChatMessage.create({
            user: user._id,
            role: 'assistant',
            content: aiResponse.content
        });

        res.json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

// @desc    Get chat history
// @route   GET /api/guidance/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
    try {
        const { limit = 50, before } = req.query;

        const query = { user: req.userId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await ChatMessage.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            messages: messages.reverse(),
            hasMore: messages.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
};

// @desc    Clear chat history
// @route   DELETE /api/guidance/chat/history
// @access  Private
exports.clearChatHistory = async (req, res) => {
    try {
        await ChatMessage.deleteMany({ user: req.userId });

        res.json({
            success: true,
            message: 'Chat history cleared'
        });
    } catch (error) {
        console.error('Clear chat history error:', error);
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
};
