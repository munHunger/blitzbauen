const logger = require("../../logger").logger("mutation util");

/**
 * Does a diff and updates only what is needed.
 * Note that this is updating as a side-effect
 * @param {*} oldData
 * @param {*} newData
 */
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
            } else
              logger.warn("Attempting to update nonexisting data", { data });
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

module.exports = { update };
