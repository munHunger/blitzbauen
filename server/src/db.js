const datason = require("datason");
const logger = require("./logger").logger("database");

let db = {};
let dbConnect = datason
  .connect("./data")
  .then(d => {
    Object.assign(db, d);
    logger.info("database connected");
    return db;
  })
  .catch(e => logger.error("could not connect to database " + e));

module.exports = { db, init: dbConnect };
