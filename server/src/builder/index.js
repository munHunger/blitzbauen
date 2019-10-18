const fs = require("fs");
const { pubsub } = require("../subscriptions");
let { db, init } = require("../db");
init.then(db => {
  if (!db.history) db.createTable("history");
});
const builder = require("./builder");
const logger = require.main.require("./logger").logger("builder");

/**
 * Recursively delete everything in the path, including the path
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
        .substring(8)
    };
    logger.debug(`attached id ${history.id} to ${repoName}`);
    deleteFolderRecursive(`./repos/${repo.name}`);
    return builder.cloneRepo(repo).then(blitz => {
      let job = builder.runStepsInProgression(
        blitz.steps.map(step => {
          return { ...step, repo };
        })
      );
      return job.execution
        .then(data => {
          logger.info(`completed building ${repoName}`, { data });
          history.details = data.details.map(step => {
            return { ...step, status: 0 };
          });
          history.status = 0;
          db.history.register(history.id, history);
          pubsub.publish("onJobComplete", { onJobComplete: history });
        })
        .catch(err => {
          logger.warn(`failure building ${repoName}`, { data: err });
          history.details = job.history().details;
          history.details.push({
            step: err.name,
            output: job.out() + "\n" + job.err(),
            status: 1
          });
          history.status = 1;
          db.history.register(history.id, history);
          pubsub.publish("onJobComplete", { onJobComplete: history });
        });
    });
  }
}

module.exports = { buildRepo: build, init };
