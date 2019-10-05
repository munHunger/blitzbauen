const octokit = new (require("@octokit/rest"))();
const simplegit = require("simple-git")();
const fs = require("fs");
const exec = require("child_process").exec;
const chalk = require("chalk");

const { pubsub } = require("../subscriptions");

const { parseOutput } = require("./outputParser");

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
 * @param {string} outputName the name of the output json
 * @returns {buildHistory} the history element of this build
 */
function build(blitz, name, outputName) {
  /**
   * @type {buildHistory}
   */
  let history = {
    timestamp: new Date().getTime(),
    name: outputName,
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
  executeSteps(steps, [], name).then(details => {
    history.details = details;
    history.status = details.reduce(
      (acc, val) => (val.status == 0 && acc == 0 ? 0 : -1),
      0
    );
    if (!fs.existsSync("history")) fs.mkdirSync("history");
    fs.promises
      .readFile(`history/${outputName}.json`)
      .then(data => {
        fs.writeFile(
          `history/${outputName}.json`,
          JSON.stringify(JSON.parse(data).concat([history])),
          err => {
            if (err) console.error(err);
          }
        );
      })
      .then(_ => {
        pubsub.publish("onJobComplete", { onJobComplete: history });
      })
      .catch(err => {
        fs.writeFile(
          `history/${outputName}.json`,
          JSON.stringify([history]),
          err => console.log("err:" + err)
        );
      });
  });
}

/**
 * @callback completeCallback
 * @param {buildDetails[]} details a list of all executed steps and their status
 */

/**
 * Executes all dependant steps
 * @param {buildStep} step the root step to process
 * @param {buildDetails[]} history an accumulator for all the generated step history objects
 * @param {String} repoName the name of the repository that is building
 * @returns {Promise<buildDetails[]>} the finished detail object
 */
function executeSteps(step, history, repoName) {
  return new Promise((resolve, reject) => {
    let start = new Date().getTime();
    /**
     * @type {buildDetails}
     */
    let h = {
      step: step.name
    };
    console.log("running " + chalk.cyan(step.name));
    exec(step.script, { cwd: "repos/" + repoName }, function callback(
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
      if (step.output)
        parseOutput("repos/" + repoName, step.output).then(output => {
          console.log("P'arsed output\n" + JSON.stringify(output, null, 2));
          h.artifact = output;
          resolve([[h].concat(history)]);
        });
      else resolve([[h].concat(history)]);
    });
  }).then(data => {
    if (step.next) return executeSteps(step.next, data[0], repoName);
    return data[0];
  });
}

/**
 * Builds a repository with the given name.
 * The repository must be registered in the settings file
 * @param {String} name the name of a repository in settings.json to build
 */
function buildRepo(name) {
  return fs.promises
    .readFile("data/settings.json")
    .then(data => JSON.parse(data))
    .then(settings => settings.repositories.find(repo => repo.name === name))
    .then(repo => {
      if (!repo) return Promise.reject("Did not find repo in settings");
      let repoName = repo.url
        .substring(repo.url.lastIndexOf("/") + 1)
        .slice(0, -4);
      let jobName = repo.name;
      return octokit.repos
        .get({
          owner: "munhunger",
          repo: repoName
        })
        .then(({ data }) => {
          let repo = data;
          if (fs.existsSync(`repos/${repoName}`))
            deleteFolderRecursive(`repos/${repoName}`);
          console.log("cloning repo");
          simplegit.clone(repo.clone_url, `repos/${repoName}`).exec(() => {
            console.log("cloned");
            if (fs.existsSync(`repos/${repoName}/blitz.json`))
              build(
                JSON.parse(fs.readFileSync(`repos/${repoName}/blitz.json`)),
                repo.name,
                jobName
              );
          });
        })
        .catch(e => Promise.reject("Could not fetch repo " + e));
    });
}

module.exports = { buildRepo };
