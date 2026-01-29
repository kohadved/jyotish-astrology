const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { email, password, name, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

        // Validate required fields
        if (!email || !password || !name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
            return res.status(400).json({
                error: 'All fields are required',
                required: ['email', 'password', 'name', 'dateOfBirth', 'timeOfBirth', 'placeOfBirth']
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        res.status(500).json({ error: 'Registration failed' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        res.json({
            user: req.user.toJSON()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = ['name', 'dateOfBirth', 'timeOfBirth', 'placeOfBirth'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Profile updated',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        res.status(500).json({ error: 'Failed to update profile' });
    }
};
