const octokit = new (require("@octokit/rest"))();
const simplegit = require("simple-git")();
const fs = require("fs");
const exec = require("child_process").exec;
const chalk = require("chalk");

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
    name: name
  };
  let steps = blitz.steps.reduce((acc, val) => {
    if (!acc) return val;

    current = acc;
    while (current.next) current = current.next;

    current.next = val;
    return acc;
  });
  executeSteps(steps, [], details => {
    history.details = details;
    history.status = details.reduce(
      (acc, val) => (acc = val == 0 && acc == 0 ? 0 : -1),
      0
    );
    if (!fs.existsSync("history")) fs.mkdirSync("history");
    fs.writeFile(`history/${name}.json`, JSON.stringify(history), err =>
      console.log(err)
    );
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
    if (!stderr || stderr.length == 0) h.status = 0;
    else h.status = -1;
    console.log(chalk.red(stderr));
    h.time = new Date().getTime() - start;
    if (step.next)
      executeSteps(step.next, [h].concat(history), completeCallback);
    else completeCallback.apply(this, [[h].concat(history)]);
  });
}

octokit.repos
  .get({
    owner: "munhunger",
    repo: "blitzbauen"
  })
  .then(({ data }) => {
    let repo = data;
    octokit.repos
      .listCommits({
        owner: "munhunger",
        repo: "blitzbauen"
      })
      .then(({ data }) => {
        if (fs.existsSync("repos/blitzbauen"))
          deleteFolderRecursive("repos/blitzbauen");
        console.log("cloning repo");
        simplegit.clone(repo.clone_url, "repos/blitzbauen").exec(() => {
          console.log("cloned");
          if (fs.existsSync("repos/blitzbauen/blitz.json"))
            build(
              JSON.parse(fs.readFileSync("repos/blitzbauen/blitz.json")),
              "blitz"
            );
        });
      });
  });
