const { withFilter } = require("graphql-subscriptions");
const { pubsub } = require("../../subscriptions");

const onNewItem = {
  onConnect: (connectionParams, webSocket, context) => {
    console.log("connected?");
  },
  subscribe: withFilter(
    () => {
      console.log("Adding subscriber");
      return pubsub.asyncIterator("messageAdded");
    },
    (payload, args) => {
      console.log("asdasdads");
      return "hello world";
    }
  )
};
module.exports = { onNewItem };
