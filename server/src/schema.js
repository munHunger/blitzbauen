const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");
const fs = require("fs");
const { gql } = require("apollo-boost");
// const schema = require("../assets/schema.graphql");

const typeDefs = [fs.readFileSync("assets/schema.graphql", "utf8")];
const executableSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers
});

module.exports = { executableSchema, typeDefs };
