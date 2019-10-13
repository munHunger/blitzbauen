const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "attr" });

/**
 * Parse output from a build step
 * @param {*} baseDir
 * @param {*} output
 */
function parseOutput(baseDir, output) {
  if (((output.reports || {}).test || {}).type === "junit") {
    return fs.promises
      .readdir(`${baseDir}/${output.reports.test.dir}`)
      .then(files => {
        return Promise.all(
          files.map(file => {
            fs.promises
              .readFile(`${baseDir}/${output.reports.test.dir}/${file}`, "utf8")
              .then(data => parser.parseStringPromise(data))
              .then(data => {
                console.log("data:" + data);
                return data;
              });
          })
        );
      });
  } else {
    return new Promise((_, reject) => {
      console.log("nothing to parse");
      reject();
    });
  }
}

module.exports = { parseOutput };
