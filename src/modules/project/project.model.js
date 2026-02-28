const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        technologies: {
            type: [String],
            default: []
        },
        repositoryUrl: {
            type: String,
            trim: true
        },
        liveUrl: {
            type: String,
            trim: true
        },
        developer: {
            type: Schema.Types.ObjectId,
            ref: "Developer",
            required: true
        },
        stars: [{
            type: Schema.Types.ObjectId,
            ref: "Developer"
        }]
    },
    { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;