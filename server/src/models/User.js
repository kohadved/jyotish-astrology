const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    timeOfBirth: {
        type: String,
        required: [true, 'Time of birth is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    placeOfBirth: {
        type: String,
        required: [true, 'Place of birth is required'],
        trim: true
    },
    // Geocoded location data
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    timezone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    // Calculated zodiac sign (stored for quick access)
    zodiacSign: {
        type: String
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate zodiac sign based on date of birth
userSchema.pre('save', function (next) {
    if (this.isModified('dateOfBirth')) {
        const date = new Date(this.dateOfBirth);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const zodiacSigns = [
            { sign: 'Capricorn', start: [1, 1], end: [1, 19] },
            { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
            { sign: 'Pisces', start: [2, 19], end: [3, 20] },
            { sign: 'Aries', start: [3, 21], end: [4, 19] },
            { sign: 'Taurus', start: [4, 20], end: [5, 20] },
            { sign: 'Gemini', start: [5, 21], end: [6, 20] },
            { sign: 'Cancer', start: [6, 21], end: [7, 22] },
            { sign: 'Leo', start: [7, 23], end: [8, 22] },
            { sign: 'Virgo', start: [8, 23], end: [9, 22] },
            { sign: 'Libra', start: [9, 23], end: [10, 22] },
            { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
            { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
            { sign: 'Capricorn', start: [12, 22], end: [12, 31] }
        ];

        for (const zodiac of zodiacSigns) {
            const [startMonth, startDay] = zodiac.start;
            const [endMonth, endDay] = zodiac.end;

            if (
                (month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)
            ) {
                this.zodiacSign = zodiac.sign;
                break;
            }
        }
    }
    next();
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
