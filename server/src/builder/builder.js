const datason = require("datason");
const fs = require("fs");
const simplegit = require("simple-git")();

module.exports = datason.connect("./data").then(db => {
  return {
    /**
     * @param {String} repo The name of the repository
     */
    readSettings: repo => db.settings.repositories.find(r => r.name === repo),
    cloneRepo: repo =>
      new Promise((resolve, reject) =>
        simplegit.clone(repo.url, `repos/${repo.name}`).exec(() => {
          console.log("cloned");
          if (fs.existsSync(`repos/${repo.name}/blitz.json`))
            return fs.promises
              .readFile(`repos/${repo.name}/blitz.json`)
              .then(data => JSON.parse(data));
          else reject("Not a blitz project");
        })
      )
  };
});
