import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { astrologyAPI, guidanceAPI } from '../services/api'
import ZodiacInfo from '../components/ZodiacInfo'
import KundliChart from '../components/KundliChart'
import DailyGuidance from '../components/DailyGuidance'
import AIChat from '../components/AIChat'

const DashboardPage = () => {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')
    const [zodiacData, setZodiacData] = useState(null)
    const [kundliData, setKundliData] = useState(null)
    const [guidanceData, setGuidanceData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        setLoading(true)
        try {
            const [zodiacRes, kundliRes, guidanceRes] = await Promise.allSettled([
                astrologyAPI.getZodiac(),
                astrologyAPI.getKundli(),
                guidanceAPI.getDailyGuidance()
            ])

            if (zodiacRes.status === 'fulfilled') {
                setZodiacData(zodiacRes.value.data)
            }
            if (kundliRes.status === 'fulfilled') {
                setKundliData(kundliRes.value.data)
            }
            if (guidanceRes.status === 'fulfilled') {
                setGuidanceData(guidanceRes.value.data.guidance)
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        }
        setLoading(false)
    }

    const refreshGuidance = async () => {
        try {
            const response = await guidanceAPI.getDailyGuidance()
            setGuidanceData(response.data.guidance)
        } catch (error) {
            console.error('Failed to refresh guidance:', error)
        }
    }

    const zodiacSymbols = {
        Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
        Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
        Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    }

    return (
        <div className="dashboard">
            {/* Navigation */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <span>✨</span>
                        <span>Jyotish</span>
                    </div>
                    <div className="navbar-nav">
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {zodiacSymbols[user?.zodiacSign]} {user?.name}
                        </span>
                        <button className="btn btn-ghost" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container" style={{ paddingTop: '2rem' }}>
                {/* Welcome Section */}
                <div className="page-header animate-fadeIn">
                    <h1 className="page-title">
                        Welcome, {user?.name?.split(' ')[0]} {zodiacSymbols[user?.zodiacSign]}
                    </h1>
                    <p className="page-subtitle">
                        Your cosmic journey awaits. Explore your astrological insights below.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
                    {[
                        { id: 'overview', label: '🌟 Overview' },
                        { id: 'kundli', label: '🔮 Kundli' },
                        { id: 'chat', label: '💬 AI Guide' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="dashboard-grid animate-slideUp">
                                <div className="card">
                                    <h3 className="section-title">
                                        <span>✨</span> Your Zodiac Profile
                                    </h3>
                                    <ZodiacInfo data={zodiacData} />
                                </div>

                                <div className="card">
                                    <h3 className="section-title flex justify-between items-center">
                                        <span>
                                            <span>🌙</span> Daily Cosmic Guidance
                                        </span>
                                        <button
                                            className="btn btn-ghost"
                                            onClick={refreshGuidance}
                                            style={{ fontSize: '0.875rem' }}
                                        >
                                            ↻ Refresh
                                        </button>
                                    </h3>
                                    <DailyGuidance data={guidanceData} />
                                </div>
                            </div>
                        )}

                        {/* Kundli Tab */}
                        {activeTab === 'kundli' && (
                            <div className="animate-slideUp">
                                <div className="card">
                                    <h3 className="section-title">
                                        <span>🔮</span> Your Birth Chart (Kundli)
                                    </h3>
                                    <KundliChart data={kundliData} user={user} />
                                </div>
                            </div>
                        )}

                        {/* Chat Tab */}
                        {activeTab === 'chat' && (
                            <div className="animate-slideUp">
                                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <h3 className="section-title" style={{ marginBottom: 0 }}>
                                            <span>💬</span> Chat with Jyotish AI
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                            Ask questions about your horoscope, compatibility, spiritual guidance, and more.
                                        </p>
                                    </div>
                                    <AIChat userContext={{
                                        name: user?.name,
                                        zodiacSign: user?.zodiacSign
                                    }} />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Footer */}
                <footer style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                }}>
                    <p>✨ Jyotish - Your Personal Astrology Guide ✨</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        Birth Date: {new Date(user?.dateOfBirth).toLocaleDateString()} |
                        Time: {user?.timeOfBirth} |
                        Place: {user?.placeOfBirth}
                    </p>
                </footer>
            </div>
        </div>
    )
}

export default DashboardPage
