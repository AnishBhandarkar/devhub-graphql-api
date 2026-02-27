const authResolvers = require("../modules/auth/auth.resolvers");
const developerResolvers = require("../modules/developer/developer.resolvers");
const projectResolvers = require("../modules/project/project.resolvers");

const resolvers = [
    authResolvers,
    developerResolvers,
    projectResolvers,
    // If any more modules, just import and add here
]

module.exports = resolvers;