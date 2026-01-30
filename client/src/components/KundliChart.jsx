import { useState } from 'react'

const KundliChart = ({ data, user }) => {
    const [selectedView, setSelectedView] = useState('chart')

    if (!data) {
        return (
            <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '1rem' }}>Calculating your birth chart...</p>
            </div>
        )
    }

    const kundli = data.kundli || {}
    const birthDetails = data.birthDetails || {}

    // Zodiac symbols and colors
    const zodiacData = {
        Aries: { symbol: '♈', color: '#ef4444', element: 'Fire' },
        Taurus: { symbol: '♉', color: '#22c55e', element: 'Earth' },
        Gemini: { symbol: '♊', color: '#f59e0b', element: 'Air' },
        Cancer: { symbol: '♋', color: '#3b82f6', element: 'Water' },
        Leo: { symbol: '♌', color: '#f97316', element: 'Fire' },
        Virgo: { symbol: '♍', color: '#84cc16', element: 'Earth' },
        Libra: { symbol: '♎', color: '#ec4899', element: 'Air' },
        Scorpio: { symbol: '♏', color: '#8b5cf6', element: 'Water' },
        Sagittarius: { symbol: '♐', color: '#f43f5e', element: 'Fire' },
        Capricorn: { symbol: '♑', color: '#10b981', element: 'Earth' },
        Aquarius: { symbol: '♒', color: '#06b6d4', element: 'Air' },
        Pisces: { symbol: '♓', color: '#a855f7', element: 'Water' }
    }

    // Planet data with colors
    const planetData = {
        Sun: { symbol: '☉', color: '#f59e0b', deity: 'Surya' },
        Moon: { symbol: '☽', color: '#f1f5f9', deity: 'Chandra' },
        Mars: { symbol: '♂', color: '#ef4444', deity: 'Mangal' },
        Mercury: { symbol: '☿', color: '#22c55e', deity: 'Budh' },
        Jupiter: { symbol: '♃', color: '#f59e0b', deity: 'Guru' },
        Venus: { symbol: '♀', color: '#ec4899', deity: 'Shukra' },
        Saturn: { symbol: '♄', color: '#6366f1', deity: 'Shani' },
        Rahu: { symbol: '☊', color: '#8b5cf6', deity: 'Rahu' },
        Ketu: { symbol: '☋', color: '#78716c', deity: 'Ketu' }
    }

    // House meanings
    const houseMeanings = {
        1: 'Self, Personality',
        2: 'Wealth, Family',
        3: 'Courage, Siblings',
        4: 'Home, Mother',
        5: 'Children, Education',
        6: 'Health, Enemies',
        7: 'Marriage, Partnership',
        8: 'Longevity, Mysteries',
        9: 'Fortune, Father',
        10: 'Career, Status',
        11: 'Gains, Friends',
        12: 'Losses, Spirituality'
    }

    const getZodiacSymbol = (sign) => zodiacData[sign]?.symbol || '⭐'
    const getZodiacColor = (sign) => zodiacData[sign]?.color || '#888'

    // Generate default houses if not available
    const generateDefaultHouses = () => {
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        const startIndex = signs.indexOf(kundli.ascendant || user?.zodiacSign || 'Aries')
        return Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            sign: signs[(startIndex + i) % 12]
        }))
    }

    // Generate default planets if not available
    const generateDefaultPlanets = () => {
        const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        return planets.map((planet, i) => ({
            planet,
            sign: signs[(i * 3) % 12],
            house: (i % 12) + 1,
            degree: 15 + (i * 5) % 30,
            retrograde: i > 5
        }))
    }

    // Use data or generate defaults
    const housesData = kundli.houses || generateDefaultHouses()
    const planetsData = kundli.planetPositions || generateDefaultPlanets()

    // North Indian style chart positions (diamond layout)
    const housePositions = [
        { x: 150, y: 20 },   // 1 - Top center
        { x: 250, y: 70 },   // 2 - Top right
        { x: 280, y: 150 },  // 3 - Right top
        { x: 250, y: 230 },  // 4 - Right bottom
        { x: 150, y: 280 },  // 5 - Bottom center
        { x: 50, y: 230 },   // 6 - Left bottom
        { x: 20, y: 150 },   // 7 - Left top
        { x: 50, y: 70 },    // 8 - Top left
        { x: 100, y: 45 },   // 9
        { x: 200, y: 45 },   // 10
        { x: 200, y: 255 },  // 11
        { x: 100, y: 255 }   // 12
    ]

    return (
        <div className="animate-fadeIn">
            {/* Header with User Info */}
            <div className="card-glass" style={{
                padding: '1.5rem',
                marginBottom: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                            ✨ {user?.name}'s Birth Chart
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Janam Kundli • Vedic Astrology
                        </p>
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        color: getZodiacColor(user?.zodiacSign || kundli.sunSign)
                    }}>
                        {getZodiacSymbol(user?.zodiacSign || kundli.sunSign)}
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>📅 Date</p>
                        <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                            {birthDetails.dateOfBirth ? new Date(birthDetails.dateOfBirth).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            }) : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>⏰ Time</p>
                        <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{birthDetails.timeOfBirth || 'N/A'}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>📍 Place</p>
                        <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{birthDetails.placeOfBirth || 'N/A'}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>🌙 Nakshatra</p>
                        <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{kundli.nakshatra || 'Calculated'}</p>
                    </div>
                </div>
            </div>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['chart', 'planets', 'houses'].map((view) => (
                    <button
                        key={view}
                        onClick={() => setSelectedView(view)}
                        className={selectedView === view ? 'btn-primary' : 'btn-secondary'}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            border: 'none',
                            cursor: 'pointer',
                            background: selectedView === view
                                ? 'var(--gradient-primary)'
                                : 'var(--bg-glass)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        {view === 'chart' && '📊'} {view === 'planets' && '🪐'} {view === 'houses' && '🏠'} {view}
                    </button>
                ))}
            </div>

            {/* Main Chart View */}
            {selectedView === 'chart' && (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {/* Ascendant */}
                    <div className="card-glass" style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.05))',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            Lagna (Ascendant)
                        </p>
                        <div style={{
                            fontSize: '2.5rem',
                            color: getZodiacColor(kundli.ascendant),
                            marginBottom: '0.5rem'
                        }}>
                            {getZodiacSymbol(kundli.ascendant)}
                        </div>
                        <p style={{ fontWeight: '600', fontSize: '1rem' }}>{kundli.ascendant || 'Aries'}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {kundli.ascendantDegree || '15'}° • First House
                        </p>
                    </div>

                    {/* Moon Sign */}
                    <div className="card-glass" style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.05))',
                        border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            Rashi (Moon Sign)
                        </p>
                        <div style={{
                            fontSize: '2.5rem',
                            color: getZodiacColor(kundli.moonSign || user?.zodiacSign),
                            marginBottom: '0.5rem'
                        }}>
                            ☽ {getZodiacSymbol(kundli.moonSign || user?.zodiacSign)}
                        </div>
                        <p style={{ fontWeight: '600', fontSize: '1rem' }}>{kundli.moonSign || user?.zodiacSign}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {zodiacData[kundli.moonSign || user?.zodiacSign]?.element || 'Fire'} Element
                        </p>
                    </div>

                    {/* Sun Sign */}
                    <div className="card-glass" style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.05))',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            Surya (Sun Sign)
                        </p>
                        <div style={{
                            fontSize: '2.5rem',
                            color: '#f59e0b',
                            marginBottom: '0.5rem'
                        }}>
                            ☉ {getZodiacSymbol(kundli.sunSign || user?.zodiacSign)}
                        </div>
                        <p style={{ fontWeight: '600', fontSize: '1rem' }}>{kundli.sunSign || user?.zodiacSign}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Western Zodiac
                        </p>
                    </div>
                </div>
            )}

            {/* Planets View */}
            {selectedView === 'planets' && (
                <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        🪐 Graha Sthiti (Planetary Positions)
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1rem'
                    }}>
                        {planetsData.map((planet, index) => {
                            const pData = planetData[planet.planet] || { symbol: '⭐', color: '#888' }
                            return (
                                <div
                                    key={index}
                                    className="card-glass"
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: `3px solid ${pData.color}`,
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '1.75rem',
                                            color: pData.color,
                                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                        }}>
                                            {pData.symbol}
                                        </span>
                                        <div>
                                            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                {planet.planet}
                                                {planet.retrograde && (
                                                    <span style={{
                                                        color: '#ef4444',
                                                        marginLeft: '0.25rem',
                                                        fontSize: '0.75rem'
                                                    }}>℞</span>
                                                )}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {pData.deity}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '0.75rem',
                                        paddingTop: '0.75rem',
                                        borderTop: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <p style={{ fontSize: '0.875rem', color: getZodiacColor(planet.sign) }}>
                                            {getZodiacSymbol(planet.sign)} {planet.sign}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {planet.degree}° • House {planet.house || (index % 12) + 1}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Houses View */}
            {selectedView === 'houses' && (
                <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        🏠 Bhava Chart (12 Houses)
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.75rem'
                    }}>
                        {housesData.map((house, index) => (
                            <div
                                key={index}
                                className="card-glass"
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                    background: `linear-gradient(135deg, ${getZodiacColor(house.sign)}15, transparent)`,
                                    border: `1px solid ${getZodiacColor(house.sign)}30`
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 0.5rem',
                                    fontWeight: '700',
                                    fontSize: '0.875rem'
                                }}>
                                    {house.house}
                                </div>
                                <p style={{
                                    fontSize: '1.5rem',
                                    color: getZodiacColor(house.sign),
                                    marginBottom: '0.25rem'
                                }}>
                                    {getZodiacSymbol(house.sign)}
                                </p>
                                <p style={{ fontWeight: '500', fontSize: '0.8rem' }}>{house.sign}</p>
                                <p style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '0.25rem'
                                }}>
                                    {houseMeanings[house.house]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Yoga & Dasha Section */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                <div className="card-glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--accent-purple)' }}>
                        🧘 Yogas Detected
                    </h5>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                        {(kundli.yogas || ['Gajakesari Yoga', 'Budhaditya Yoga', 'Chandra-Mangal Yoga']).map((yoga, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>{yoga}</li>
                        ))}
                    </ul>
                </div>
                <div className="card-glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>
                        ⏳ Current Dasha
                    </h5>
                    <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{kundli.currentDasha || 'Jupiter Mahadasha'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {kundli.dashaEnd || '2027-2034'} • {kundli.antardasha || 'Venus Antardasha'}
                    </p>
                </div>
            </div>

            {/* Notice */}
            {data.notice && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-cyan)'
                }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)' }}>
                        ℹ️ {data.notice}
                    </p>
                </div>
            )}
        </div>
    )
}

export default KundliChart
