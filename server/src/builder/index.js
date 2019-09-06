const octokit = new (require("@octokit/rest"))();
const simplegit = require("simple-git")();
const fs = require("fs");
const exec = require("child_process").exec;
const chalk = require("chalk");

const { pubsub } = require("../subscriptions");

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
 * starts a build job.
 * @param {blitz} blitz a blitz configuration
 * @param {string} name the name of the repository
 * @returns {buildHistory} the history element of this build
 */
function build(blitz, name) {
  /**
   * @type {buildHistory}
   */
  let history = {
    timestamp: new Date().getTime(),
    name: name,
    id: Math.random()
      .toString(36)
      .substring(8)
  };
  let steps = blitz.steps.reduce((acc, val) => {
    if (!acc) return val;

    current = acc;
    while (current.next) current = current.next;

    current.next = val;
    return acc;
  });
  console.log("Steps parsed");
  executeSteps(steps, [], details => {
    history.details = details;
    history.status = details.reduce(
      (acc, val) => (val.status == 0 && acc == 0 ? 0 : -1),
      0
    );
    if (!fs.existsSync("history")) fs.mkdirSync("history");
    fs.promises
      .readFile(`history/${name}.json`)
      .then(data => {
        fs.writeFile(
          `history/${name}.json`,
          JSON.stringify(JSON.parse(data).concat([history])),
          err => console.error(err)
        );
      })
      .then(_ => {
        console.log(history);
        pubsub.publish("onJobComplete", "asdasdasd");
      })
      .catch(err => {
        fs.writeFile(`history/${name}.json`, JSON.stringify([history]), err =>
          console.log(err)
        );
      });
  });
}

/**
 * @callback completeCallback
 * @param {buildDetails[]} details a list of all executed steps and their status
 */

/**
 * Executes a step in the build process
 * @param {buildStep} step the step to execute
 * @param {buildDetails[]} history an accumulator for all the generated step history objects
 * @param {completeCallback} completeCallback the function to call when all steps have executed
 * @returns {void}
 */
function executeSteps(step, history, completeCallback) {
  let start = new Date().getTime();
  /**
   * @type {buildDetails}
   */
  let h = {
    step: step.name
  };
  console.log("running " + chalk.cyan(step.name));
  exec(step.script, { cwd: "repos/blitzbauen" }, function callback(
    error,
    stdout,
    stderr
  ) {
    h.output = stdout;
    console.log(stdout);
    if (!error || error.length == 0) h.status = 0;
    else h.status = -1;
    console.log(chalk.red(stderr));
    h.time = new Date().getTime() - start;
    if (step.next)
      executeSteps(step.next, [h].concat(history), completeCallback);
    else completeCallback.apply(this, [[h].concat(history)]);
  });
}

function buildRepo(name) {
  fs.promises
    .readFile("data/settings.json")
    .then(data => JSON.parse(data))
    .then(settings => settings.repositories.find(repo => repo.name === name))
    .then(repo => {
      let repoName = repo.url
        .substring(repo.url.lastIndexOf("/") + 1)
        .slice(-4);
      return octokit.repos
        .get({
          owner: "munhunger",
          repo: repoName
        })
        .then(({ data }) => {
          let repo = data;
          octokit.repos
            .listCommits({
              owner: "munhunger",
              repo: repoName
            })
            .then(({ data }) => {
              if (fs.existsSync(`repos/${repoName}`))
                deleteFolderRecursive(`repos/${repoName}`);
              console.log("cloning repo");
              simplegit.clone(repo.clone_url, `repos/${repoName}`).exec(() => {
                console.log("cloned");
                if (fs.existsSync(`repos/${repoName}/blitz.json`))
                  build(
                    JSON.parse(fs.readFileSync(`repos/${repoName}/blitz.json`)),
                    repo.name
                  );
              });
            });
        });
    });
}

module.exports = { buildRepo };
