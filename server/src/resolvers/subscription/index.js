const { withFilter } = require("graphql-subscriptions");
const { pubsub } = require("../../subscriptions");

const onJobComplete = {
  subscribe: () => {
    return pubsub.asyncIterator("onJobComplete");
  }
};
module.exports = { onJobComplete };
