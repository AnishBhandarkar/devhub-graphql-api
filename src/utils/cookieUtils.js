const env = require('../config/env');

/**
 * Set refresh token as HTTP‑only cookie
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.isProd, // only send over HTTPS in production
    sameSite: 'lax',    // adjust as needed (strict/lax)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (should match REFRESH_TOKEN_EXPIRY)
    path: '/graphql',    // cookie sent only to GraphQL endpoint
  });
};

/**
 * Clear refresh token cookie
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/graphql',
  });
};

module.exports = { setRefreshTokenCookie, clearRefreshTokenCookie };