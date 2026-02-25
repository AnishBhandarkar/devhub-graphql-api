const typeDefs = `#graphql

type AuthPayLoad {
    accessToken: String!
    developer: Developer!
}


input SignupInput {
    name: String!
    email: String!
    password: String!
}


input LoginInput {
    email: String!
    password: String!
}


type Mutation {
    signup(input: SignupInput!): AuthPayLoad!
    login(input: LoginInput!): AuthPayLoad!
    logout: Boolean!
    refresh: AuthPayload!
}
`;

module.exports = typeDefs;