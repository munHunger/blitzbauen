const { history, settings } = require("./query");

const { addRepository } = require("./mutation");
const { onNewItem } = require("./subscription");

const resolvers = {
  Query: {
    history,
    settings
  },
  Mutation: {
    addRepository
  },
  Subscription: {
    onNewItem: {
      onConnect: (connectionParams, webSocket, context) => {
        console.log("connected?");
      }
    }
  }
};
module.exports = resolvers;
