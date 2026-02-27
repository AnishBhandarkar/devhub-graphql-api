const typeDefs = `#graphql

type Developer {
    id: ID!
    name: String!
    email: String!
    bio: String
    skills: [String!]
    avatarUrl: String!
    followers: [Developer!]
    following: [Developer!]
    projects: [Project!]
    createdAt: String!
    updatedAt: String!
}


input UpdateDeveloperInput {
    bio: String
    skills: [String!]
    avatarUrl: String
}


extend type Query {
    me: Developer
    developer(id: ID!): Developer
    developers: [Developer!]
}


extend type Mutation {
    updateDeveloper(input: UpdateDeveloperInput!): Developer
    deleteDeveloper: Boolean
    followDeveloper(developerId: ID!): Developer
    unfollowDeveloper(developerId: ID!): Developer
}
`;

module.exports = typeDefs;

/*
NOTE:

me: Developer -> Added to get the current loggedin user.
We can also get that by developer(id: ID!): Developer. But we need to pass id.
So that has been added to keep things simple.


*/

/*
1 dev can have many projects. 1 project can have 1 dev.
1 dev can follow many devs ans have many devs following him

- Ok, so bydefault we do creation while signup
- we can also update but its only limited to bio, skills, avatarUrl

- We can also delete user.

- We can follow other devs

*/