let { db } = require("../../db");
const {
  historyTransformer,
  settingsTransformer
} = require("../../transformer");
const { filter } = require("../../filter");
const blitzVC = require("blitz-vc");
const logger = require("../../logger").logger("Query");

/**
 * Fetches the build history of a project
 * @param {*} input the graphql schema input
 */
const history = async (_, input) => {
  let size = input.pageSize || 3;
  let start = (input.page || 0) * size;
  let end = start + size;
  let sortField = (input.sort || {}).field || "timestamp";
  return Object.keys(db.history)
    .filter(key => typeof db.history[key] !== "function")
    .map(key => db.history[key].latest)
    .sort(
      (a, b) =>
        (a[sortField] > b[sortField]
          ? 1
          : a[sortField] < b[sortField]
          ? -1
          : 0) * ((input.sort || {}).asc ? -1 : 1)
    )
    .filter(job => filter(input, job))
    .slice(start, end)
    .map(job => historyTransformer(job));
};

/**
 * Gets a changeset from the requested hash to latest
 * @param {*} input the graphql schema input
 */
const changeSet = async (_, input) => {
  logger.debug("Queried changeset", { data: input });
  if (!input.id) return new Error("Missing job id");
  return Object.keys(db.history)
    .filter(key => typeof db.history[key] !== "function")
    .filter(key => key === input.id)
    .map(key => db.history[key])
    .map(job => {
      logger.debug("found changeset to return");
      if (!input.hash)
        return {
          hash: job.history[job.history.length - 1].hash,
          base: historyTransformer(job.latest)
        };

      return {
        hash: job.history[job.history.length - 1].hash,
        change: JSON.stringify(blitzVC.getChangeFromCommit(input.hash, job))
      };
    })
    .pop();
};

/**
 * Get the state at a specified hash
 * @param {*} input the graphql schema input
 */
const getStateAtHash = async (_, input) => {
  return Object.keys(db.history)
    .filter(key => typeof db.history[key] !== "function")
    .filter(key => key === input.id)
    .map(key => db.history[key])
    .map(job => {
      logger.debug("found changeset to return");
      logger.debug("Returning state", {
        data: blitzVC.getStateOnCommit(input.hash, job)
      });
      return blitzVC.getStateOnCommit(input.hash, job);
    })
    .pop();
};

/**
 * Fetches the settings of blitzbauen
 * @param {*} input the graphql schema input
 */
const settings = async input => {
  return settingsTransformer(db.settings);
};

module.exports = { history, settings, changeSet, getStateAtHash };
