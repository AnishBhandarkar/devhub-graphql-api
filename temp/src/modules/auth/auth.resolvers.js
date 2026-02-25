const Developer = require('../developer/developer.model');

const RefreshToken = require('../auth/refreshToken.model');

const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/cookieUtils');

const {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} = require('../../utils/tokenUtils');

const resolvers = {
    Mutation: {
        signup: async (_, args, context) => {
            try {
                const { email, password } = args;

                // Check if user already exists
                const existing = await Developer.findOne({ email });
                if (existing) {
                    throw new Error('Email already in use');
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const developer = new Developer({
                    ...args,
                    password: hashedPassword
                });

                await developer.save();

                // Generate tokens and set cookie
                const accessToken = generateAccessToken(developer);
                const refreshToken = generateRefreshToken();
                const hashedRefreshToken = hashToken(refreshToken);

                // Store hashed refresh token in DB with expiry
                refreshToken = new RefreshToken({
                    token: hashedRefreshToken,
                    user: developer._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                });

                await refreshToken.save();

                setRefreshTokenCookie(context.res, refreshToken.token);

                return {
                    accessToken,
                    developer: {
                        id: developer._id,
                        name: developer.name,
                        email: developer.email
                    }
                };
            } catch (error) {
                throw new Error(error.message);
            }
        },

        login: async (_, args, context) => {
            try {
                const { email, password } = args;

                const developer = await Developer.findOne({ email });
                if (!developer) {
                    throw new Error('Invalid email or password');
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    throw new Error('Invalid email or password');
                }

                // Generate tokens and set cookie
                const accessToken = generateAccessToken(developer);
                const refreshToken = generateRefreshToken();
                const hashedRefreshToken = hashToken(refreshToken);

                // Store hashed refresh token in DB with expiry
                refreshToken = new RefreshToken({
                    token: hashedRefreshToken,
                    user: developer._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                });

                await refreshToken.save();

                setRefreshTokenCookie(context.res, refreshToken.token);

                return {
                    accessToken,
                    developer: {
                        id: developer._id,
                        name: developer.name,
                        email: developer.email
                    }
                };
            } catch (err) {
                throw new Error(err.message);
            }
        },

        logout: async () => {
            try {
                const token = context.req.cookies.refreshToken;
                if (!token) {
                    throw new Error('No refresh token provided');
                }
                // Hash it to find in DB
                const hashedToken = hashToken(token);

                // Delete the refresh token document
                await RefreshToken.findOneAndDelete({ token: hashedToken });

                // Clear the cookie
                clearRefreshTokenCookie();

                return true;
            } catch (error) {
                throw new Error('Logout failed');
            }
        },

        refresh: async (_, __, context) => {
            try {
                const oldRefreshToken = context.req.cookies.refreshToken;
                if (!oldRefreshToken) {
                    throw new Error('No refresh token provided');
                }

                // Hash it
                const hashedToken = hashToken(oldRefreshToken);

                const tokenDoc = await RefreshToken.findOne({ token: hashedToken });
                if (!tokenDoc) {
                    throw new Error('Invalid refresh token');
                }

                // Check expiration manually (in case TTL hasn't run yet)
                if (tokenDoc.expiresAt < new Date()) {
                    await RefreshToken.deleteOne({ _id: tokenDoc._id }); // clean up
                    throw new Error('Refresh token expired');
                }

                // Token is valid – get user
                const userId = tokenDoc.user;
                const developer = await Developer.findById(userId);
                if (!developer) {
                    throw new Error('Developer not found');
                }

                // --- TOKEN ROTATION START ---
                // Delete the old refresh token (one-time use)
                await RefreshToken.deleteOne({ _id: tokenDoc._id });

                // Generate NEW refresh token
                const newRefreshTokenPlain = generateRefreshToken();
                const newHashedToken = hashToken(newRefreshTokenPlain);

                // Store new refresh token in DB
                const newRefreshTokenDoc = new RefreshToken({
                    token: newHashedToken,
                    user: developer._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                });
                await newRefreshTokenDoc.save();

                // Set the NEW refresh token as HTTP-only cookie
                setRefreshTokenCookie(context.res, newRefreshTokenDoc.token);
                // --- TOKEN ROTATION END ---

                // Generate new access token
                const newAccessToken = generateAccessToken(developer);

                // Send new access token
                return {
                    accessToken: newAccessToken,
                    developer: {
                        id: developer._id,
                        name: developer.name,
                        email: developer.email
                    }
                };
            } catch (error) {
                // If any error occurs, clear the potentially invalid cookie
                clearRefreshTokenCookie(context.res);
                throw new Error(error.message);
            }
        }
    }
};

module.exports = resolvers;