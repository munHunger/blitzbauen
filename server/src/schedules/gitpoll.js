let { db, init } = require("../db");
const logger = require("../logger").logger("git poll");
const simplegit = require("simple-git")();
const builder = require("../builder");

init.then(_ => {
  pollGit();
});

/**
 * Polls git for the latest commit hash for all repositories
 * to evaluate if a build is required
 */
function pollGit() {
  logger.debug(`Reading settings`, { data: db.settings.repositories });
  db.settings.repositories.forEach(repo => {
    simplegit.listRemote([repo.url, "HEAD"], (err, tags) => {
      let hash = tags.split("\t")[0];
      repo.hash = hash;
      logger.debug(`listed remote ${repo.name} latest hash ${hash}`);
      let latest = (
        Object.keys(db.history || {})
          .filter(key => typeof db.history[key] !== "function")
          .map(key => db.history[key])
          .filter(job => job.latest) // Ignore objects not under VC
          .map(job => job.latest)
          .sort((a, b) => b.timestamp - a.timestamp)
          .find(job => job.name === repo.name) || {}
      ).hash;
      logger.debug(`latest hash for repo ${repo.name} ${latest}`);

      if (latest !== hash) {
        logger.info(
          `latest built hash does not match latest remote, triggering build`,
          { data: { remote: hash, local: latest } }
        );
        builder
          .buildRepo(repo.name)
          .then(_ => logger.debug(`Scheduled job ${repo.name} completed`));
      }
    });
  });
  setTimeout(() => pollGit(), 5 * 60 * 1000);
}
