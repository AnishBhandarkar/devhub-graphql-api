const asyncHandler = require('../../utils/asyncHandler');
const Project = require('./project.model');
const Developer = require('../developer/developer.model');

const resolvers = {
    Query: {
        project: asyncHandler(async (_, { id }) => {
            const project = await Project.findById(id);

            if (!project) {
                throw new Error("Project not found");
            }
            return project;
        }),
        projects: asyncHandler(async (_, { developerId }) => {
            if (developerId) {
                return await Project.find({ developer: developerId });
            } else {
                return await Project.find();
            }
        })
    },

    Mutation: {
        createProject: asyncHandler(async (_, { input }, { developer }) => {
            if (!developer) {
                throw new Error('Unauthorized');
            }
            const project = new Project({
                ...input,
                developer: developer.id
            });
            await project.save();
            return project;
        }),

        updateProject: asyncHandler(async (_, { id, input }, { developer }) => {
            if (!developer) {
                throw new Error('Unauthorized');
            }
            const project = await Project.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }
            if (project.developer.toString() !== developer.id) {
                throw new Error('Unauthorized');
            }
            const updatedProject = await Project.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            return updatedProject;
        }),

        deleteProject: asyncHandler(async (_, { id }, { developer }) => {
            if (!developer) {
                throw new Error('Unauthorized');
            }
            const project = await Project.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }
            if (project.developer.toString() !== developer.id) {
                throw new Error('Unauthorized');
            }
            const deletedProject = await Project.findByIdAndDelete(id);
            if (!deletedProject) {
                throw new Error("Project not found");
            }
            return true;
        }),

        starProject: asyncHandler(async (_, { projectId }, { developer }) => {
            if (!developer) {
                throw new Error('Unauthorized');
            }
            const project = await Project.findById(projectId);

            if (!project) {
                throw new Error("Project not found");
            }

            const alreadyStared = project.stars.some(id => id.toString() === developer._id.toString());

            if (alreadyStared) {
                throw new Error("You have already starred this project");
            }

            project.stars.push(developer._id);
            await project.save();
            return project;
        }),

        unstarProject: asyncHandler(async (_, { projectId }, { developer }) => {
            if (!developer) {
                throw new Error('Unauthorized');
            }
            const project = await Project.findById(projectId);

            if (!project) {
                throw new Error("Project not found");
            }

            const alreadyStared = project.stars.some(id => id.toString() === developer._id.toString());

            if (!alreadyStared) {
                throw new Error("You have not starred this project");
            }


            project.stars = project.stars.filter(id => {
                return id.toString() !== developer._id.toString();
            })

            await project.save();

            return project;

        })
    },

    Project: {
        developer: asyncHandler(async (parent, _, { loaders }) => {
            /*
            return await Developer.findById(parent.developer).select('-password');
            */

            return await loaders.developerLoader.load(parent.developer);
        }),

        stars: asyncHandler(async (parent, _, { loaders }) => {
            /*
            return await Developer.find({
                _id: { $in: parent.stars }
            }).select('-password');
            */

            return await loaders.developerLoader.loadMany(parent.stars);
        })
    }
}

module.exports = resolvers;