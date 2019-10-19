const fs = require("fs");
const { pubsub, subscriptionTopics } = require("../subscriptions");
let { db, init } = require("../db");

init.then(db => {
  if (!db.history) db.createTable("history");
});
const builder = require("./builder");
const logger = require("../logger").logger("builder");

/**
 * Recursively delete everything synchronously in the path, including the path
 * @param {string} path the url to delete
 * @returns {void}
 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
/**
 * Build a repository that is in the settings
 * @param {String} repoName the name of the repository to build. This should be in the settings
 */
function build(repoName) {
  logger.debug(`building ${repoName}`);
  let repo = builder.readSettings(repoName);
  if (repo) {
    let history = {
      timestamp: new Date().getTime(),
      name: repoName,
      id: Math.random()
        .toString(36)
        .substring(8),
      status: -1
    };
    db.history.register(history.id, history);
    pubsub.publish(subscriptionTopics.jobStarted, { onJobStarted: history });
    logger.debug(`registered build history ${history.id} for repo ${repoName}`);
    deleteFolderRecursive(`./repos/${repo.name}`);
    return builder.cloneRepo(repo).then(blitz => {
      history.hash = blitz.hash;
      let job = builder.runStepsInProgression(
        blitz.steps.map(step => {
          return { ...step, repo };
        }),
        (out, err, job) => {
          logger.debug(`detected change in build status`);
          history.details = job.details;
          pubsub.publish(subscriptionTopics.jobUpdated, {
            onJobUpdated: history
          });
        }
      );
      return job.execution
        .then(data => {
          logger.info(`completed building ${repoName}`, { data });
          history.details = data.details.map(step => {
            return { ...step, status: 0 };
          });
          history.status = 0;
          db.history[history.id].save();
          logger.debug(`saved build history`, { data: history });
          pubsub.publish(subscriptionTopics.jobComplete, {
            onJobComplete: history
          });
        })
        .catch(err => {
          logger.warn(`failure building ${repoName}`, { data: err });
          history.details = job.history().details;
          history.status = 1;
          db.history[history.id].save();
          logger.debug(`saved build history`);
          pubsub.publish(subscriptionTopics.jobComplete, {
            onJobComplete: history
          });
        });
    });
  }
}

module.exports = { buildRepo: build, init };
