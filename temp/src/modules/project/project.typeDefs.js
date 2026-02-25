const typeDefs = `#graphql

type Project {
    id: ID!
    title: String!
    description: String
    technologies: [String!]!
    repositoryUrl: String
    liveUrl: String
    createdAt: String!
    updatedAt: String!
    developer: Developer!
    stars: [Developer!]!
}

input CreateProjectInput {
    title: String!
    description: String
    technologies: [String!]
    repositoryUrl: String
    liveUrl: String
}

input UpdateProjectInput {
    title: String
    description: String
    technologies: [String!]
    repositoryUrl: String
    liveUrl: String
}

type Query {
    project(id: ID!): Project
    projects(developerId: ID): [Project!]!
}

type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
}
`;

module.exports = typeDefs;

/*
Here Developer can CRUD his own projects and that part 
will be handled in resolvers. 
We will check if the project belongs to the developer or not before allowing update or delete.

projects(developerId: ID): [Project!]! -> This query will return all projects if developerId is not provided. If developerId is provided, it will return projects of that developer.
*/