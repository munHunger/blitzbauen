const fs = require("fs");

const { pubsub } = require("../subscriptions");

let { db, init } = require("../db");
init.then(db => {
  if (!db.history) db.createTable("history");
});
const builder = require("./builder");

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

function build(repoName) {
  let repo = builder.readSettings(repoName);
  if (repo) {
    let history = {
      timestamp: new Date().getTime(),
      name: repoName,
      id: Math.random()
        .toString(36)
        .substring(8)
    };
    deleteFolderRecursive(`./repos/${repo.name}`);
    builder.cloneRepo(repo).then(blitz => {
      let job = builder.runStepsInProgression(
        blitz.steps.map(step => {
          return { ...step, repo };
        })
      );
      return job.execution
        .then(data => {
          history.details = data.details;
          db.history.register(history.id, history);
        })
        .catch(err => {
          history.details = job.history().details;
          history.details.push({
            step: err.name,
            output: job.out() + "\n" + job.err(),
            status: 1
          });
          db.history.register(history.id, history);
        })
        .finally(_ =>
          pubsub.publish("onJobComplete", { onJobComplete: job.history() })
        );
    });
  }
}

module.exports = { buildRepo: build, init };
