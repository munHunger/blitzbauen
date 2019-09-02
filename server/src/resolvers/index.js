const queries = require("./query");

const mutations = require("./mutation");
const subscriptions = require("./subscription");

const resolvers = {
  Query: {
    ...queries
  },
  Mutation: {
    ...mutations
  },
  Subscription: {
    ...subscriptions
  }
};
module.exports = resolvers;
