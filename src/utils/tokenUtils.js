const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (developer) => {
    return jwt.sign(
        {
            developerId: developer._id,
            email: developer.email,
            name: developer.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Generate a cryptographically strong random string for refresh token
const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex'); // 80 hex chars = 320 bits
};

// Hash the refresh token before storing in DB for security
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashToken
};