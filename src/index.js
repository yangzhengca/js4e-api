const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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


// Get the user info from a JWT
const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
}


// Setup ApolloServer
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        // Get token from the headers
        const token = req.headers.authorization;
        // Call getUser to get user
        const user = getUser(token);

        console.log(user);
        // Add the db models to the context
        return { models, user };
    }
});

// Apply the Apollo GraphQL middleware and set path to /api
server.applyMiddleware({app, path: '/api'});


// Start server
app.listen(PORT, () => {
    console.log(`GraphQL Server running on http://localhost:${PORT} ...`)
});