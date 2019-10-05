const datason = require("datason");
const fs = require("fs");

datason.connect("./data").then(db => {
  function readSettings(repo) {
    return db.settings;
  }

  module.exports = { readSettings };
});
