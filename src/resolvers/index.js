const Query = require('./query');
const Mutation = require('./mutation');
// Import dateTime format
const { GraphQLDateTime } = require('graphql-iso-date');



module.exports = {
    Query,
    Mutation,
    DateTime: GraphQLDateTime
};