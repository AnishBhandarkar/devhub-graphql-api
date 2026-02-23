const Developer = require('../../models/Developer');
const {
  generateAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
} = require('../../services/authService');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/cookieUtils');
const { ApolloError } = require('apollo-server-express');

const authResolvers = {
  Mutation: {
    signup: async (_, { input }, { res }) => {
      try {
        const { name, email, password, bio, skills } = input;

        // Check if user already exists
        const existing = await Developer.findOne({ email });
        if (existing) {
          throw new ApolloError('Email already in use', 'EMAIL_EXISTS');
        }

        // Create developer (password hashed automatically via pre-save hook)
        const developer = new Developer({ name, email, password, bio, skills });
        await developer.save();

        // Generate tokens
        const accessToken = generateAccessToken(developer.id);
        const refreshToken = await createRefreshToken(developer.id);

        // Set refresh token in HTTP‑only cookie
        setRefreshTokenCookie(res, refreshToken.token);

        return {
          accessToken,
          developer,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },

    login: async (_, { input }, { res }) => {
      try {
        const { email, password } = input;

        const developer = await Developer.findOne({ email });
        if (!developer) {
          throw new ApolloError('Invalid email or password', 'INVALID_CREDENTIALS');
        }

        const isValid = await developer.comparePassword(password);
        if (!isValid) {
          throw new ApolloError('Invalid email or password', 'INVALID_CREDENTIALS');
        }

        const accessToken = generateAccessToken(developer.id);
        const refreshToken = await createRefreshToken(developer.id);

        setRefreshTokenCookie(res, refreshToken.token);

        return {
          accessToken,
          developer,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },

    logout: async (_, __, { req, res }) => {
      try {
        const token = req.cookies.refreshToken;
        if (token) {
          await deleteRefreshToken(token);
        }
        clearRefreshTokenCookie(res);
        return true;
      } catch (error) {
        throw new ApolloError('Logout failed');
      }
    },

    refreshToken: async (_, __, { req, res }) => {
      try {
        const oldTokenString = req.cookies.refreshToken;
        if (!oldTokenString) {
          throw new ApolloError('No refresh token provided', 'UNAUTHENTICATED');
        }

        // Verify and get user from old token
        const user = await verifyRefreshToken(oldTokenString);
        if (!user) {
          throw new ApolloError('Invalid refresh token', 'UNAUTHENTICATED');
        }

        // Token rotation: delete old refresh token
        await deleteRefreshToken(oldTokenString);

        // Issue new tokens
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = await createRefreshToken(user.id);

        setRefreshTokenCookie(res, newRefreshToken.token);

        return {
          accessToken: newAccessToken,
          developer: user,
        };
      } catch (error) {
        // If any error occurs, clear the potentially invalid cookie
        clearRefreshTokenCookie(res);
        throw new ApolloError(error.message, 'UNAUTHENTICATED');
      }
    },
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      return user;
    },
  },
};

module.exports = authResolvers;