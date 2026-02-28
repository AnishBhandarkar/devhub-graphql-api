const DataLoader = require("dataloader");
const Project = require("../project/project.model");

const projectLoader = new DataLoader(async (developerIds) => {

    const projects = await Project.find({
        developer: { $in: developerIds }
    });

    const map = {};

    developerIds.forEach(id => {
        map[id.toString()] = [];
    });

    projects.forEach(project => {
        map[project.developer.toString()].push(project);
    });

    return developerIds.map(id =>
        map[id.toString()]
    );

});

module.exports = projectLoader;