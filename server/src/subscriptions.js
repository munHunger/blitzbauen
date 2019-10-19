const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const subscriptionTopics = {
  jobComplete: "onJobComplete",
  jobStarted: "onJobStarted",
  jobUpdated: "onJobUpdated",
  updatedSettings: "updatedSettings"
};

module.exports = { pubsub, subscriptionTopics };
