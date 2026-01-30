import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const { register, error, clearError } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: ''
    })
    const [loading, setLoading] = useState(false)
    const [validationError, setValidationError] = useState('')

    const handleChange = (e) => {
        clearError()
        setValidationError('')
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setValidationError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { confirmPassword, ...registrationData } = formData
        await register(registrationData)

        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-container animate-slideUp" style={{ maxWidth: '500px' }}>
                <div className="card auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">🌟</div>
                        <h1 className="auth-title">Begin Your Cosmic Journey</h1>
                        <p className="auth-subtitle">Enter your birth details for personalized insights</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }} />

                        <h4 style={{ marginBottom: '1rem', color: 'var(--accent-purple)' }}>
                            ✨ Birth Details
                        </h4>

                        <div className="form-group">
                            <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                className="form-input"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="timeOfBirth">Time of Birth</label>
                                <input
                                    type="time"
                                    id="timeOfBirth"
                                    name="timeOfBirth"
                                    className="form-input"
                                    value={formData.timeOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="placeOfBirth">Place of Birth</label>
                                <input
                                    type="text"
                                    id="placeOfBirth"
                                    name="placeOfBirth"
                                    className="form-input"
                                    placeholder="City, Country"
                                    value={formData.placeOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {(error || validationError) && (
                            <div className="error-message mb-2">{error || validationError}</div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creating your profile...
                                </>
                            ) : (
                                'Start Your Journey'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
