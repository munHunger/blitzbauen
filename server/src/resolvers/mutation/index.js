const fs = require("fs");
const builder = require("../../builder");
const { pubsub } = require("../../subscriptions");
const { update } = require("./util");

/**
 * Update the entire settings object
 * @param {*} input the graphql input
 */
const updateSettings = async (_, input) => {
  return fs.promises
    .readFile("./data/settings.json", "utf8")
    .then(data => JSON.parse(data))
    .then(data => {
      update(data, JSON.parse(JSON.stringify(input.settings)));
      fs.promises.writeFile("./data/settings.json", JSON.stringify(data));
      pubsub.publish("updatedSettings", { updatedSettings: data });
      return data;
    });
};

/**
 * Triggers a build of a repository
 * @param {*} input the graphql schema input
 */
const triggerBuild = async (_, input) => {
  return builder.buildRepo(input.name).then(_ => true);
};

module.exports = { triggerBuild, updateSettings };
