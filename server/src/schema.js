const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");
const fs = require("fs");
const { gql } = require("apollo-boost");
// const schema = require("../assets/schema.graphql");

const executableSchema = makeExecutableSchema({
  typeDefs: gql(fs.readFileSync("assets/schema.graphql", "utf8")),
  resolvers
});

module.exports = { executableSchema };
