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


extend type Mutation {
    signup(input: SignupInput!): AuthPayLoad!
    login(input: LoginInput!): AuthPayLoad!
    logout: Boolean!
    refresh: AuthPayLoad!
}
`;

module.exports = typeDefs;

/*
mutation {
  signup(
    input: {
      name: "lol"
      email: "lol"
      password: "lol"
    }
  ) {
    accessToken
    developer {
      id
      name
      email
    }
  }
}





*/