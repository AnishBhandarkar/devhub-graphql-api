const authTypeDefs = require('../modules/auth/auth.typeDefs');
const developerTypeDefs = require('../modules/developer/developer.typeDefs');
const projectTypeDefs = require('../modules/project/project.typeDefs');

const rootTypeDefs = `#graphql
  type Query {
    _empty: String # Just a placeholder, actual queries are in modules
  }

  type Mutation {
    _empty: String # Just a placeholder, actual mutations are in modules
  }
`;

const typeDefs = [
  rootTypeDefs,
  authTypeDefs,
  developerTypeDefs,
  projectTypeDefs,
  // If any more modules, just import and add here
];

module.exports = typeDefs;

// Apollo server automatically merges typeDefs and resolvers based on their structure. 
// So we can split them into multiple files for better organization.