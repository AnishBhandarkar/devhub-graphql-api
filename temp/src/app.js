const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const cookieParser = require('cookie-parser');

const express = require('express');

const app = express();

app.use(cookieParser());
app.use(express.json());

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server, { context }));
}

startServer();



module.exports = app;