const datason = require("datason");
const fs = require("fs");
const simplegit = require("simple-git");
const exec = require("child_process").exec;
const outputParser = require("./outputParser");
const logger = require("../logger").logger("build engine");
let db;
let dbConnect = datason.connect("./data").then(d => (db = d));

/**
 * @typedef {Object} execution
 * @property {()=>String} out a function for getting the latest out text
 * @property {()=>String} err a function for getting the latest err text
 * @property {Promise} execution the promise of what is currently running.
 */
/**
 * @typedef {Object} step
 * @property {String} name the name of the step
 * @property {String} script the bash script to execute
 * @property {Object} repo the repository data of the step
 * @property {String} repo.name the name of the cloned repo
 */

/**
 * @param {String} repo The name of the repository
 * @returns The database settings of the sought after repo, or undefined if none is found
 */
function readSettings(repo) {
  return db.settings.repositories.find(r => r.name === repo);
}

/**
 * Clones a git repo locally for future building
 * @param {Object} repo The repository to build
 * @param {String} repo.name the name of the repository, and the name of the folder to clone into
 * @param {String} repo.url the url to the git repo to clone
 * @returns {Promise<Object>} The parsed blitz file if the repo was a blitz project and with the hash added to it. reject otherwise
 */
function cloneRepo(repo) {
  logger.info(`cloning repo in ${process.cwd()}/repos/`, { data: repo });
  let git = simplegit();
  return new Promise((resolve, reject) =>
    git
      .cwd(`${process.cwd()}`)
      .clone(repo.url, `repos/${repo.name}`)
      .exec(() => {
        logger.debug(`cloned repo ${repo.name}`);
        git.cwd(`repos/${repo.name}`).log((err, log) => {
          let hash = log.latest.hash;
          logger.debug(`attached hash ${hash} to repo ${repo.name}`, {
            data: {
              message: log.latest.message,
              date: log.latest.date
            }
          });
          if (fs.existsSync(`repos/${repo.name}/blitz.json`))
            resolve(
              fs.promises
                .readFile(`repos/${repo.name}/blitz.json`)
                .then(data => {
                  return { ...JSON.parse(data), hash };
                })
            );
          else reject("Not a blitz project");
        });
      })
  );
}
/**
 * Runs a single step in the build process
 * @param {step} step the step to execute
 * @param {(text:String)=>void} outCallback a function to call if there are changes in the out pipe of the script
 * @param {(text:String)=>void} errCallback a function to call if there are changes in the err pipe of the script
 *
 * @returns {execution} the running step
 */
function runStep(step, outCallback, errCallback) {
  logger.info(`Running step ${step.name}`);
  let out = "";
  let err = "";
  return {
    out: () => out,
    err: () => err,
    execution: new Promise((resolve, reject) => {
      let process = exec(step.script, { cwd: `./repos/${step.repo.name}` });
      process.stdout.on("data", data => {
        out += data;
        if (outCallback) outCallback.apply(this, [data]);
      });
      process.stderr.on("data", data => {
        err += data;
        if (errCallback) errCallback.apply(this, [data]);
      });
      process.on("exit", code => {
        logger.debug(`Exited step ${step.name} with code ${code}`);
        (step.output
          ? outputParser.parseOutput(`repos/${step.repo.name}`, step.output)
          : Promise.resolve()
        ).then(outputData => {
          resolve({ out, test: outputData, code });
        });
      });
    })
  };
}

/**
 * Run all steps of a blitz project in sequence.
 * Will reject at first error
 * @param {step[]} steps a list of steps to execute
 * @param {(out:String,err:String,history:any)=>void} onChange A function to be called anytime there is a change
 *
 * @returns {execution} will resolve the build history
 */
function runStepsInProgression(steps, onChange) {
  let out = "";
  let err = "";
  let buildHistory = {
    time: new Date().getTime(),
    details: []
  };
  logger.debug("starting build");
  return {
    out: () => out,
    err: () => err,
    history: () => buildHistory,
    execution: steps
      .reduce(
        (acc, val) =>
          acc.then(_ => {
            let start = new Date().getTime();
            return runStep(
              val,
              o => {
                out += o;
                if (onChange)
                  onChange.apply(this, [
                    out,
                    err,
                    {
                      ...buildHistory,
                      details: buildHistory.details.concat({ output: out })
                    }
                  ]);
              },
              e => {
                err += e;
                if (onChange) onChange.apply(this, [out, err, buildHistory]);
              }
            ).execution.then(data => {
              out = "";
              err = "";
              logger.info(`Finished step ${val.name}`);
              const result = {
                step: val.name,
                output: data.out,
                test: data.test,
                time: new Date().getTime() - start,
                status: data.code === 0 ? 0 : 1
              };
              logger.debug("step done", { data: result });
              buildHistory.details.push(result);
              if (onChange) onChange.apply(this, [out, err, buildHistory]);
              if (result.status !== 0) {
                logger.debug(`rejecting build`);
                return Promise.reject("Result.status != 0");
              }
            });
          }),
        Promise.resolve()
      )
      .then(_ => (buildHistory.time = new Date().getTime() - buildHistory.time))
      .then(_ => logger.debug("completed build"))
      .then(_ => buildHistory)
  };
}

module.exports = {
  init: dbConnect,
  readSettings,
  cloneRepo,
  runStep,
  runStepsInProgression
};
