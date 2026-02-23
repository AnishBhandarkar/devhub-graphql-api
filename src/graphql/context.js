const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Developer = require('../models/Developer');

// This function runs for every GraphQL request
const context = async ({ req, res }) => {
  // Extract access token from Authorization header
  let user = null;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, env.accessSecret);
      const userId = decoded.userId;
      // Fetch fresh user data from DB (optional, could also just attach id)
      user = await Developer.findById(userId);
    } catch (err) {
      // Token invalid/expired – user remains null
      console.log('Access token verification failed:', err.message);
    }
  }

  // Pass request, response, and user to resolvers
  return { req, res, user };
};

module.exports = context;