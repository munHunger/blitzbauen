const datason = require("datason");
const fs = require("fs");
const simplegit = require("simple-git")();
const chalk = require("chalk");
const exec = require("child_process").exec;

let db;
let dbConnect = datason
  .connect("./data")
  .then(d => (db = d))
  .then(_ => console.log(JSON.stringify(db, null, 2)));

/**
 * @param {String} repo The name of the repository
 */
function readSettings(repo) {
  console.log(repo);
  return db.settings.repositories.find(r => r.name === repo);
}

function cloneRepo(repo) {
  console.log(repo);
  return new Promise((resolve, reject) =>
    simplegit.clone(repo.url, `repos/${repo.name}`).exec(() => {
      console.log("cloned repo " + repo.name);
      if (fs.existsSync(`repos/${repo.name}/blitz.json`))
        resolve(
          fs.promises
            .readFile(`repos/${repo.name}/blitz.json`)
            .then(data => JSON.parse(data))
        );
      else reject("Not a blitz project");
    })
  );
}

function runStep(step, outCallback, errCallback) {
  console.log(`Running step ${step.name}`);
  let out = "";
  let err = "";
  return {
    out: () => out,
    err: () => err,
    execution: new Promise((resolve, reject) => {
      let process = exec(step.script, { cwd: `repos/${step.repo.name}` });
      process.stdout.on("data", data => {
        out += data;
        if (outCallback) outCallback.apply(this, [data]);
      });
      process.stderr.on("data", data => {
        err += data;
        if (errCallback) errCallback.apply(this, [data]);
      });
      process.on("exit", code => {
        console.log(out);
        if (code == 0) resolve(out);
        else reject(`Exited ${code}`);
      });
    })
  };
}

function runStepsInProgression(steps) {
  let out = "";
  let err = "";
  let buildHistory = {
    time: new Date().getTime(),
    details: []
  };
  return steps
    .reduce(
      (acc, val) =>
        acc.then(_ => {
          let start = new Date().getTime();
          return runStep(val, o => (out += o), e => (err += e)).execution.then(
            data =>
              buildHistory.details.push({
                step: val.name,
                output: data,
                time: new Date().getTime() - start
              })
          );
        }),
      Promise.resolve()
    )
    .then(_ => (buildHistory.time = new Date().getTime() - buildHistory.time))
    .then(_ => buildHistory);
}

module.exports = {
  init: dbConnect,
  readSettings,
  cloneRepo,
  runStep,
  runStepsInProgression
};
