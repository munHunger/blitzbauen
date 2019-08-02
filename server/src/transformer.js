var dateFormat = require("dateformat");

const historyTransformer = job => {
  return {
    ...job,
    timestamp: input =>
      dateFormat(job.timestamp, input.format || "mm:hh dd-mm-yyyy")
  };
};
module.exports = {
  historyTransformer
};
