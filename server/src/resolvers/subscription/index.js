const { withFilter } = require("graphql-subscriptions");
const { pubsub } = require("../../subscriptions");

const onNewItem = {
  subscribe: withFilter(
    () => pubsub.asyncIterator("messageAdded"),
    (payload, args) => {
      return "hello world";
    }
  )
};
module.exports = { onNewItem };
