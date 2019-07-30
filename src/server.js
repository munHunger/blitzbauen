const octokit = new (require("@octokit/rest"))();
const simplegit = require("simple-git")();
const fs = require("fs");
const exec = require("child_process").exec;
const chalk = require("chalk");
var deleteFolderRecursive = function(path) {
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
};

function build(blitz) {
  let steps = blitz.steps.reduce((acc, val) => {
    if (!acc) return val;

    current = acc;
    while (current.next) current = current.next;

    current.next = val;
    return acc;
  });
  console.log(steps);
  executeSteps(steps);
}

function executeSteps(step) {
  console.log("running " + chalk.cyan(step.name));
  exec(step.script, { cwd: "repos/blitzbauen" }, function callback(
    error,
    stdout,
    stderr
  ) {
    console.log(stdout);
    console.log(chalk.red(stderr));
    if (step.next) executeSteps(step.next);
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
            build(JSON.parse(fs.readFileSync("repos/blitzbauen/blitz.json")));
        });
      });
  });
