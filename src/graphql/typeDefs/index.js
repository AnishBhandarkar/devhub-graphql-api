const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Developer {
    id: ID!
    name: String!
    email: String!
    bio: String
    skills: [String!]
    avatarUrl: String
    followers: [Developer!]
    following: [Developer!]
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    accessToken: String!
    developer: Developer!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    bio: String
    skills: [String!]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: Developer
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    refreshToken: AuthPayload!
  }
`;

module.exports = typeDefs;