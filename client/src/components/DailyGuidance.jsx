const DailyGuidance = ({ data }) => {
    if (!data) {
        return (
            <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                <p>Loading your cosmic guidance...</p>
            </div>
        )
    }

    return (
        <div className="animate-fadeIn">
            {/* Guidance Message */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1rem',
                borderLeft: '3px solid var(--accent-purple)'
            }}>
                <p style={{
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem'
                }}>
                    {data.message}
                </p>
            </div>

            {/* Meta Info */}
            <div className="flex justify-between items-center" style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
            }}>
                <span>
                    {data.zodiacSign && `✨ For ${data.zodiacSign}`}
                </span>
                <span>
                    {data.source === 'ai' ? '🤖 AI Generated' : '📜 Daily Wisdom'}
                    {data.generatedAt && ` • ${new Date(data.generatedAt).toLocaleTimeString()}`}
                </span>
            </div>

            {/* Fallback notice */}
            {data.source === 'fallback' && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)'
                }}>
                    💡 Tip: Add your Gemini API key for personalized AI-generated guidance!
                </div>
            )}
        </div>
    )
}

export default DailyGuidance
