var dateFormat = require("dateformat");

/**
 * Transforms the output into the format specified by the schema
 * @param {*} job the input data
 * @returns {*} a literal or a function for transforming a field in the history query
 */
const historyTransformer = job => {
  return {
    ...job,
    timestamp: input =>
      dateFormat(job.timestamp, input.format || "mm:hh dd-mm-yyyy")
  };
};

/**
 * Transforms the output into the format specified in the schema
 * @param {*} setting the setting object to transform
 * @returns {*} a literal or a function for transforming a field in the settings query
 */
const settingsTransformer = setting => {
  return {
    ...setting,
    repositories: () => setting.repositories || []
  };
};
module.exports = {
  historyTransformer,
  settingsTransformer
};
