const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');
const Developer = require('../models/Developer');
const RefreshToken = require('../models/RefreshToken');

/**
 * Generate access token (short-lived, payload contains user id)
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, env.accessSecret, { expiresIn: env.accessExpiry });
};

/**
 * Generate a random refresh token string (or use JWT)
 * We'll generate a cryptographically strong random string and store it.
 * This is simpler and avoids storing a JWT secret for refresh tokens.
 */
const generateRefreshTokenString = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Create a new refresh token record in DB, linked to user
 */
const createRefreshToken = async (userId) => {
  // Delete any existing refresh tokens for this user (optional, but good for single session)
  await RefreshToken.deleteMany({ user: userId });

  const tokenString = generateRefreshTokenString();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parseInt(env.refreshExpiry) || 7); // default 7 days

  const refreshToken = new RefreshToken({
    token: tokenString,
    user: userId,
    expiresAt,
  });
  await refreshToken.save();
  return refreshToken;
};

/**
 * Verify refresh token from DB and return user if valid
 */
const verifyRefreshToken = async (tokenString) => {
  const refreshToken = await RefreshToken.findOne({ token: tokenString }).populate('user');
  if (!refreshToken) throw new Error('Refresh token not found');
  if (refreshToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: refreshToken._id }); // clean up expired
    throw new Error('Refresh token expired');
  }
  return refreshToken.user; // returns the Developer document
};

/**
 * Delete a refresh token (used during logout)
 */
const deleteRefreshToken = async (tokenString) => {
  await RefreshToken.deleteOne({ token: tokenString });
};

module.exports = {
  generateAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
};