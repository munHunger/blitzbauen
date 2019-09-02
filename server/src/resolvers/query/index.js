const { historyTransformer } = require("../../transformer");
const { filter } = require("../../filter");
const fs = require("fs");
const { pubsub } = require("../../subscriptions");

const history = async (_, input) => {
  pubsub.publish("messageAdded", "messageAdded");

  console.log(input);
  let size = input.pageSize || 3;
  let start = (input.page || 0) * size;
  let end = start + size;
  let sortField = (input.sort || {}).field || "timestamp";
  console.log(input);
  return fs.promises.readFile("./history/blitz.json", "utf8").then(data =>
    JSON.parse(data)
      .sort(
        (a, b) =>
          (a[sortField] > b[sortField]
            ? 1
            : a[sortField] < b[sortField]
            ? -1
            : 0) * ((input.sort || {}).asc ? -1 : 1)
      )
      .filter(job => filter(input, job))
      .slice(start, end)
      .map(job => historyTransformer(job))
  );
};

const settings = async input => {
  return fs.promises
    .readFile("./data/settings.json", "utf8")
    .then(data => JSON.parse(data));
};

module.exports = { history, settings };
