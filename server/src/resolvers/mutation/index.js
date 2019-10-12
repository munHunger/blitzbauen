let { db } = require("../../db");
const fs = require("fs");
const builder = require("../../builder");
const { pubsub } = require("../../subscriptions");
const { update } = require("./util");

/**
 * Update the entire settings object
 * @param {*} input the graphql input
 */
const updateSettings = async (_, input) => {
  update(db.settings, JSON.parse(JSON.stringify(input.settings)));
  pubsub.publish("updatedSettings", { updatedSettings: db.settings });
  db.settings.save();
  return db.settings;
};

/**
 * Triggers a build of a repository
 * @param {*} input the graphql schema input
 */
const triggerBuild = async (_, input) => {
  return builder.buildRepo(input.name).then(_ => true);
};

module.exports = { triggerBuild, updateSettings };
