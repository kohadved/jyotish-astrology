const ZodiacInfo = ({ data }) => {
    if (!data) {
        return (
            <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                <p>Loading zodiac information...</p>
            </div>
        )
    }

    const elementColors = {
        Fire: 'badge-fire',
        Earth: 'badge-earth',
        Air: 'badge-air',
        Water: 'badge-water'
    }

    return (
        <div className="animate-fadeIn">
            {/* Header with Symbol */}
            <div className="text-center mb-3">
                <div className="zodiac-icon" style={{ fontSize: '4rem' }}>
                    {data.symbol}
                </div>
                <h2 style={{ marginTop: '0.5rem' }}>{data.zodiacSign}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {data.dates}
                </p>
            </div>

            {/* Element & Planet */}
            <div className="flex gap-2 justify-center mb-3">
                <span className={`badge ${elementColors[data.element] || ''}`}>
                    {data.element} Element
                </span>
                <span className="badge">
                    ☿ {data.rulingPlanet}
                </span>
            </div>

            {/* Description */}
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
                {data.description}
            </p>

            {/* Traits */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Key Traits
                </h4>
                <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                    {data.traits?.map((trait, index) => (
                        <span
                            key={index}
                            className="badge"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            {trait}
                        </span>
                    ))}
                </div>
            </div>

            {/* Compatibility */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Best Compatibility
                </h4>
                <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                    {data.compatibility?.map((sign, index) => (
                        <span
                            key={index}
                            className="badge"
                            style={{ background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-pink)' }}
                        >
                            ♡ {sign}
                        </span>
                    ))}
                </div>
            </div>

            {/* Lucky Items */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Lucky Numbers
                    </h4>
                    <p style={{ color: 'var(--accent-gold)' }}>
                        {data.luckyNumbers?.join(', ')}
                    </p>
                </div>
                <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Lucky Colors
                    </h4>
                    <p style={{ color: 'var(--accent-cyan)' }}>
                        {data.luckyColors?.join(', ')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ZodiacInfo
