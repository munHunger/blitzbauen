const { pubsub, subscriptionTopics } = require("../../subscriptions");

const onJobComplete = {
  subscribe: () => {
    return pubsub.asyncIterator(subscriptionTopics.jobComplete);
  }
};
const onJobStarted = {
  subscribe: () => {
    return pubsub.asyncIterator(subscriptionTopics.jobStarted);
  }
};
const onJobUpdated = {
  subscribe: () => {
    return pubsub.asyncIterator(subscriptionTopics.jobUpdated);
  }
};
const updatedSettings = {
  subscribe: () => {
    return pubsub.asyncIterator(subscriptionTopics.updatedSettings);
  }
};
module.exports = { onJobComplete, onJobStarted, onJobUpdated, updatedSettings };
