const Developer = require('./developer.model');
const Project = require('../../modules/project/project.model');
const asyncHandler = require('../../utils/asyncHandler');

const resolvers = {
    Query: {
        me: asyncHandler(async (_, __, { developer }) => {
            if (!developer) {
                throw new Error("Not authenticated");
            }
            return developer;
        }),

        developer: asyncHandler(async (_, { id }) => {
            const dev = await Developer.findById(id).select("-password");
            if (!dev) {
                throw new Error("Developer not found");
            }

            return dev;
        }),

        developers: asyncHandler(async () => {
            return await Developer.find({}).select("-password");
        })
    },

    Mutation: {
        updateDeveloper: asyncHandler(async (_, { input }, { developer }) => {
            if (!developer) {
                throw new Error("Not authenticated");
            }
            const updatedDev = await Developer.findByIdAndUpdate(developer._id, input, { new: true, runValidators: true }).select("-password");
            return updatedDev;
        }),

        deleteDeveloper: asyncHandler(async (_, __, { developer }) => {
            if (!developer) {
                throw new Error("Not authenticated");
            }
            const deletedDev = await Developer.findByIdAndDelete(developer._id);
            if (!deletedDev) {
                throw new Error("Developer not found");
            }
            return true;
        }),

        followDeveloper: asyncHandler(async (_, { developerId }, { developer }) => {
            if (!developer) {
                throw new Error("Not authenticated");
            }
            if (developer._id.toString() === developerId) {
                throw new Error("You cannot follow yourself");
            }

            const devToFollow = await Developer.findById(developerId);
            if (!devToFollow) {
                throw new Error("Developer to follow not found");
            }

            /*
                Here developer.following and devToFollow.followers are arrays of ObjectIds. 
                So we need to convert them to strings before comparing.
            */

            // Add to following list of current user
            if (!developer.following.some(id => id.toString() === developerId)) {
                developer.following.push(developerId);
                await developer.save();
            }

            // Add to followers list of the followed user
            if (!devToFollow.followers.some(id => id.toString() === developer._id.toString())) {
                devToFollow.followers.push(developer._id);
                await devToFollow.save();
            }

            return devToFollow;
        }),

        unfollowDeveloper: asyncHandler(async (_, { developerId }, { developer }) => {
            if (!developer) {
                throw new Error("Not authenticated");
            }
            if (developer._id.toString() === developerId) {
                throw new Error("You cannot unfollow yourself");
            }

            const devToUnfollow = await Developer.findById(developerId);
            if (!devToUnfollow) {
                throw new Error("Developer to unfollow not found");
            }

            // Remove from following list of current user
            developer.following = developer.following.filter(id => id.toString() !== developerId);
            await developer.save();

            // Remove from followers list of the unfollowed user
            devToUnfollow.followers = devToUnfollow.followers.filter(id => id.toString() !== developer._id.toString());
            await devToUnfollow.save();

            return devToUnfollow;
        })
    },

    Developer: {
        followers: asyncHandler(async (parent, _, { loaders }) => {
            /*
            return await Developer.find({
                _id: { $in: parent.followers }
            }).select("-password");
            */

            return await loaders.developerLoader.loadMany(parent.followers);
        }),

        following: asyncHandler(async (parent, _, { loaders }) => {
            /*
            return await Developer.find({
                _id: { $in: parent.following }
            }).select("-password");
            */

            return await loaders.developerLoader.loadMany(parent.following);
        }),

        projects: asyncHandler(async (parent, _, { loaders }) => {
            /*
            return await Project.find({
                developer: parent._id
            });
            */

            return await loaders.projectLoader.load(parent._id);
        })
    }
}

module.exports = resolvers;