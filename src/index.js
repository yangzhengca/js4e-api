const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

require('dotenv').config();
const db = require('./db');

const app = express();

// Set port number
const PORT = process.env.PORT || 5000
// Set mongodb url
const DB_HOST = process.env.DB_HOST;

// Temp data
let notes = [
    { id: '1', content: "This is a note", author: 'Adam Scott' },
    { id: '2', content: "This is another note", author: 'Harlow Everly' },
    { id: '3', content: "Oh hey look, another note", author: 'Riley Harrison' }
];



// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!):Note!

    }

    type Mutation {
        newNote(content: String!): Note!
    }
`;

// Provide resolver function to our schema
const resolvers = {
    Query: {
        hello: () => 'Hello World!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },

    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Adam Scott'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

// Connect to database
db.connect(DB_HOST);

// Setup ApolloServer
const server = new ApolloServer({typeDefs, resolvers});

// Apply the Apollo GraphQL middleware and set path to /api
server.applyMiddleware({app, path: '/api'});


// Start server
app.listen(PORT, () => {
    console.log(`GraphQL Server running on http://localhost:${PORT} ...`)
});