const fs = require("fs");
const builder = require("../../builder");
const { pubsub } = require("../../subscriptions");

const update = (oldData, newData) => {
  Object.keys(newData).forEach(key => {
    if (
      (newData[key] && typeof oldData[key] === typeof newData[key]) ||
      !oldData[key]
    ) {
      if (Array.isArray(newData[key])) {
        newData[key]
          .filter(data => data.id)
          .forEach(data => {
            let old = oldData[key].find(o => o.id === data.id);
            if (old) {
              update(old, data);
            } else console.log("Attempting to update nonexisting data");
          });
        oldData[key] = (oldData[key] || []).concat(
          newData[key]
            .filter(data => !data.id)
            .map(data => {
              data.id = Math.random()
                .toString(36)
                .substring(8);
              return data;
            })
        );
      } else if (typeof newData[key] === "object") {
        if (!oldData[key]) oldData[key] = newData[key];
        update(oldData[key], newData[key]);
      } else {
        oldData[key] = newData[key];
      }
    }
  });
};

const updateSettings = async (_, input) => {
  return fs.promises
    .readFile("./data/settings.json", "utf8")
    .then(data => JSON.parse(data))
    .then(data => {
      update(data, JSON.parse(JSON.stringify(input.settings)));
      fs.promises.writeFile("./data/settings.json", JSON.stringify(data));
      pubsub.publish("updatedSettings", { updatedSettings: data });
      return data;
    });
};

/**
 * Triggers a build of a repository
 * @param {*} input the graphql schema input
 */
const triggerBuild = async (_, input) => {
  return builder.buildRepo(input.name).then(_ => true);
};
module.exports = { triggerBuild, updateSettings };
