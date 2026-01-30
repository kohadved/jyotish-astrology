import { useState, useEffect, useRef } from 'react'
import { guidanceAPI } from '../services/api'

const AIChat = ({ userContext }) => {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingHistory, setLoadingHistory] = useState(true)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        loadChatHistory()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadChatHistory = async () => {
        try {
            const response = await guidanceAPI.getChatHistory({ limit: 50 })
            if (response.data.messages && response.data.messages.length > 0) {
                setMessages(response.data.messages)
            } else {
                // Add welcome message if no history
                setMessages([{
                    role: 'assistant',
                    content: `Namaste, ${userContext?.name || 'seeker'}! 🌟 I am Jyotish, your cosmic guide. As a ${userContext?.zodiacSign || 'cosmic'} soul, I'm here to help you navigate the stars. Ask me about your horoscope, compatibility, spiritual guidance, or anything about your cosmic journey!`
                }])
            }
        } catch (error) {
            console.error('Failed to load chat history:', error)
            // Add welcome message on error
            setMessages([{
                role: 'assistant',
                content: `Namaste! 🌟 I am Jyotish, your cosmic guide. Ask me about your horoscope, compatibility, spiritual guidance, or anything about your cosmic journey!`
            }])
        }
        setLoadingHistory(false)
    }

    const sendMessage = async (e) => {
        e.preventDefault()

        if (!inputValue.trim() || loading) return

        const userMessage = inputValue.trim()
        setInputValue('')

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const response = await guidanceAPI.chat(userMessage)

            if (response.data.response) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.response.content
                }])
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I sense some cosmic interference at the moment. Please try again in a moment. 🌙'
            }])
        }

        setLoading(false)
    }

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear your chat history?')) {
            return
        }

        try {
            await guidanceAPI.clearChatHistory()
            setMessages([{
                role: 'assistant',
                content: `Chat history cleared! 🌟 I'm ready for a fresh cosmic conversation, ${userContext?.name || 'seeker'}!`
            }])
        } catch (error) {
            console.error('Failed to clear history:', error)
        }
    }

    const suggestedQuestions = [
        "What does today hold for me?",
        "Tell me about my zodiac traits",
        "Who am I most compatible with?",
        "What should I focus on this week?"
    ]

    return (
        <div className="chat-container">
            {/* Messages */}
            <div className="chat-messages">
                {loadingHistory ? (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message chat-message-assistant">
                                <div className="flex items-center gap-2">
                                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                                    <span>Consulting the stars...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
                <div style={{
                    padding: '0.5rem 1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    {suggestedQuestions.map((q, index) => (
                        <button
                            key={index}
                            className="btn btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                            onClick={() => setInputValue(q)}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <form onSubmit={sendMessage} className="chat-input-container">
                <input
                    type="text"
                    className="form-input chat-input"
                    placeholder="Ask the cosmos..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !inputValue.trim()}
                    style={{ padding: '0.75rem 1.5rem' }}
                >
                    {loading ? '...' : '✨'}
                </button>
                {messages.length > 1 && (
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={clearHistory}
                        title="Clear chat history"
                        style={{ padding: '0.75rem' }}
                    >
                        🗑️
                    </button>
                )}
            </form>
        </div>
    )
}

export default AIChat
