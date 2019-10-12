const datason = require("datason");
let db = {};
let dbConnect = datason.connect("./data").then(d => Object.assign(db, d));

module.exports = { db, init: dbConnect };
