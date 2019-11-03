const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");
const fs = require("fs");
const { gql } = require("apollo-boost");
// const schema = require("../assets/schema.graphql");

const typeDefs = ["schema", "input", "type"]
  .map(f => `assets/${f}.graphql`)
  .map(f => fs.readFileSync(f, "utf8"));
const executableSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers
});

module.exports = { executableSchema, typeDefs };
