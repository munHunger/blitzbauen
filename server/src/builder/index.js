const fs = require("fs");
const { pubsub, subscriptionTopics } = require("../subscriptions");
let { db, init } = require("../db");

init.then(db => {
  if (!db.history) db.createTable("history");
});
const builder = require("./builder");
const logger = require("../logger").logger("builder");
const vc = require("blitz-vc");

const { deploy } = require("./deploy");

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
    let history = vc.createRepo({
      timestamp: new Date().getTime(),
      name: repoName,
      id: Math.random()
        .toString(36)
        .substring(8),
      status: -1,
      details: [],
      commit: {}
    });
    db.history.register(history.latest.id, history);
    pubsub.publish(subscriptionTopics.jobStarted, {
      onJobStarted: history.latest
    });
    logger.debug(
      `registered build history ${history.latest.id} for repo ${repoName}`
    );
    Math.random()
      .toString(36)
      .substring(8);
    deleteFolderRecursive(`./repos/${repo.name}`);
    return builder.cloneRepo(repo).then(blitz => {
      history.commit(l => {
        l.commit.hash = blitz.hash;
        l.commit.author = blitz.author;
        l.commit.message = blitz.message;
        l.hash = blitz.hash;
        return l;
      });
      let job = builder.runStepsInProgression(
        blitz.steps.map(step => {
          return { ...step, repo };
        }),
        (out, err, job) => {
          history.commit(latestCommit => {
            latestCommit.details = job.details;
            pubsub.publish(subscriptionTopics.jobUpdated, {
              onJobUpdated: history.latest
            });
            return latestCommit;
          });
        }
      );
      return job.execution
        .then(data => {
          logger.info(`completed building ${repoName}`, { data });
          history.commit(latest => {
            latest.details = data.details.map(step => {
              return { ...step, status: 0 };
            });
            latest.status = 0;
            return latest;
          });
          db.history[history.latest.id].save();
          logger.debug(`saved build history`, {
            data: {
              commits: history.history.length,
              id: history.latest.id
            }
          });

          deploy(repo);

          pubsub.publish(subscriptionTopics.jobComplete, {
            onJobComplete: history.latest
          });
        })
        .catch(err => {
          logger.warn(`failure building ${repoName}`, { data: err });
          history.commit(latest => {
            latest.details = job.history().details;
            latest.status = 1;
            return latest;
          });
          db.history[history.latest.id].save();
          logger.debug(`saved build history`);
          pubsub.publish(subscriptionTopics.jobComplete, {
            onJobComplete: history.latest
          });
        });
    });
  }
}

module.exports = { buildRepo: build, init };
