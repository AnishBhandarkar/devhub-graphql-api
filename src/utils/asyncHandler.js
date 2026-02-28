/*
*This avoids the need to write try-catch blocks in every resolver function.
* It wraps the resolver function and catches any errors that occur during its execution.
 * If an error is caught, it logs the error and throws a new error with a generic message.
 * This helps to prevent unhandled promise rejections and provides a consistent error handling mechanism across all resolvers.
 */

const asyncHandler = (resolver) => {
    return async (parent, args, context, info) => {
        try {
            return await resolver(parent, args, context, info);
        } catch(error) {
            console.error(error);
            throw new Error(error.message || "Internal Server Error");
        }
    }
};

module.exports = asyncHandler;