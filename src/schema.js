const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL's schema language
module.exports = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        notes: [Note!]!
        note(id: ID!):Note!

    }

    type Mutation {
        newNote(content: String!): Note!
    }
`;