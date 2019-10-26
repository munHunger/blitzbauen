const deepClone = require("clone-deep");
const blitzDiff = require("blitzdiff");
var deepEqual = require("deep-equal");
/**
 * @typedef {Object} commit a commit in the version history. this should only be a changeset and not a "real" object
 * @property {String} hash an identifier of the commit
 * @property {Object} data the changeset from the previous commited stage
 */
/**
 * @typedef {Object} repo a version controlled object repository
 * @property {Object} latest the currently latest version of the object.
 * @property {Object} base the initial object to base all changes from
 * @property {commit[]} history a set of changesets that given the history and base should result in latest
 * @property {(any)=>any} commit a function used to add new commits. It will take in the latest state and return a new state
 * @property {(String)=>any} getChangeFromCommit get the changeset from the given commit hash to the latest version
 */

/**
 * Creates a version controlled repo with the given data
 * @param {*} baseCommit the data to be added as a base for future commits
 * @returns {repo} a version controlled object
 */
function createRepo(baseCommit) {
  baseCommit = deepClone(baseCommit);
  let result = {
    latest: baseCommit,
    base: baseCommit,
    history: []
  };
  return loadRepoFunctions(result);
}

function loadRepoFunctions(repo) {
  let result = {
    ...repo,
    commit: supplier => commit(supplier, result),
    getChangeFromCommit: hash => getChangeFromCommit(hash, result)
  };
  return result;
}

function getChangeFromCommit(hash, repo) {
  if (!hash) return blitzDiff.diff(repo.base, repo.latest);
  let i = repo.history.map(h => h.hash).indexOf(hash);
  let state = deepClone(repo.base);
  repo.history.slice(0, i).forEach(c => {
    blitzDiff.join(state, c.data);
  });
  return blitzDiff.diff(state, repo.latest);
}

function getStateOnCommit(hash, repo) {
  let i = repo.history.map(h => h.hash).indexOf(hash);
  let state = deepClone(repo.base);
  repo.history.slice(0, i).forEach(c => {
    state = blitzDiff.join(state, c.data);
  });
  return state;
}

function commit(supplier, repo) {
  let newData = deepClone(supplier.apply({}, [deepClone(repo.latest)]));
  let eq = deepEqual(repo.latest, newData);
  if (!eq) {
    let commit = blitzDiff.diff(repo.latest, newData);
    repo.latest = newData;
    repo.history.push({
      hash: genHash(),
      data: commit
    });
  }
}

function genHash() {
  return Math.random()
    .toString(36)
    .substring(8);
}

module.exports = {
  createRepo,
  loadRepoFunctions,
  getChangeFromCommit,
  getStateOnCommit
};
