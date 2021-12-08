const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

// Local mudule imports
// Import MongoDB settings
const db = require('./db');
// Import MongoDB schema
const models = require('./models');
// Import GraphQL schema
const typeDefs = require('./schema');
// Import GraphQL resolvers
const resolvers = require('./resolvers');

const app = express();

// Set port number
const PORT = process.env.PORT || 5000
// Set mongodb url
const DB_HOST = process.env.DB_HOST;


// Connect to database
db.connect(DB_HOST);

// Setup ApolloServer
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: () => {
        // Add the db models to the context
        return { models };
    }
});

// Apply the Apollo GraphQL middleware and set path to /api
server.applyMiddleware({app, path: '/api'});


// Start server
app.listen(PORT, () => {
    console.log(`GraphQL Server running on http://localhost:${PORT} ...`)
});