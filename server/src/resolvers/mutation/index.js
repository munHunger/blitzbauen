const builder = require("../../builder");

const addRepository = async (_, input) => {
  return fs.promises
    .readFile("./data/settings.json", "utf8")
    .then(data => JSON.parse(data))
    .then(data => {
      data.repositories.push(input.repository);
      return data;
    })
    .then(data =>
      fs.promises.writeFile("./data/settings.json", JSON.stringify(data))
    )
    .then(
      fs.promises
        .readFile("./data/settings.json", "utf8")
        .then(data => JSON.parse(data))
    );
};

const triggerBuild = async (_, input) => {
  return builder.buildRepo(input.name).then(_ => true);
};
module.exports = { addRepository, triggerBuild };
