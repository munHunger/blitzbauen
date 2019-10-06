const datason = require("datason");
const fs = require("fs");
const simplegit = require("simple-git")();
const chalk = require("chalk");
const exec = require("child_process").exec;

module.exports = datason.connect("./data").then(db => {
  return {
    /**
     * @param {String} repo The name of the repository
     */
    readSettings: repo => db.settings.repositories.find(r => r.name === repo),
    cloneRepo: repo =>
      new Promise((resolve, reject) =>
        simplegit.clone(repo.url, `repos/${repo.name}`).exec(() => {
          console.log("cloned repo " + repo.name);
          if (fs.existsSync(`repos/${repo.name}/blitz.json`))
            return fs.promises
              .readFile(`repos/${repo.name}/blitz.json`)
              .then(data => JSON.parse(data));
          else reject("Not a blitz project");
        })
      ),
    runStep: step => {
      let out = "";
      let err = "";
      return {
        out: () => out,
        err: () => err,
        execution: new Promise((resolve, reject) => {
          let process = exec(step.script, { cwd: `repos/${step.repo.name}` });
          process.stdout.on("data", data => {
            out += data;
          });
          process.stderr.on("data", data => {
            err += data;
          });
          process.on("exit", code => {
            if (code == 0) resolve(out);
            else reject(`Exited ${code}`);
          });
        })
      };
    }
  };
});
