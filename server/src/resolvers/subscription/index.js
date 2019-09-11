const { pubsub } = require("../../subscriptions");

const onJobComplete = {
  subscribe: () => {
    return pubsub.asyncIterator("onJobComplete");
  }
};
const updatedSettings = {
  subscribe: () => {
    return pubsub.asyncIterator("updatedSettings");
  }
};
module.exports = { onJobComplete, updatedSettings };
