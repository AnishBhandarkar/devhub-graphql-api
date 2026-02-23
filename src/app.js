const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/dbConfig');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true, // allow cookies to be sent/received
  })
);
app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  // Enable introspection in dev, disable in prod if desired
  introspection: !env.isProd,
  formatError: (err) => {
    // Log errors in production, but don't leak internals
    console.error(err);
    return new Error('Internal server error');
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false, path: '/graphql' }); // cors already handled
}

startServer();

app.use(errorHandler);

module.exports = app;