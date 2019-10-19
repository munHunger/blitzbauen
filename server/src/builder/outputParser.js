const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "attr" });
const logger = require("../logger").logger("output parser");

/**
 * @typedef testsuit
 * @param {string} name the name of the suite
 * @param {number} tests The amount on tests in the suite
 * @param {number} failures the amount of test failures in the suite
 * @param {number} errors The amount of erros in the suite
 * @param {number} disabled The amount of disabled tests
 * @param {test[]} suite the tests in the suite
 */
/**
 * @typedef test
 * @param {string} name the name of the test
 */

/**
 * Parse output from a build step
 * @param {*} baseDir
 * @param {*} output
 */
function parseOutput(baseDir, output) {
  if (((output.reports || {}).test || {}).type === "junit") {
    logger.debug(`starting output parsing`);
    return fs.promises
      .readdir(`${baseDir}/${output.reports.test.dir}`)
      .then(files => {
        return Promise.all(
          files.map(file =>
            fs.promises
              .readFile(`${baseDir}/${output.reports.test.dir}/${file}`, "utf8")
              .then(data => parser.parseStringPromise(data))
              .then(data => {
                logger.debug(`read testdata from ${file}`, {
                  data
                });
                let result = {
                  name: file.slice(13, -4),
                  tests: data.testsuites.attr.tests,
                  failures: data.testsuites.attr.failures,
                  errors: data.testsuites.attr.errors,
                  disabled: data.testsuites.attr.disabled,
                  suite: data.testsuites.testsuite
                    .filter(suite => suite.testcase)
                    .map(suite => suite.testcase)
                    .reduce((acc, val) => acc.concat(val), [])
                    .map(test => {
                      return {
                        name: test.attr.name,
                        class: test.attr.classname,
                        failure: (test.failure || [])
                          .map(f => f.attr.message)
                          .join("\n")
                      };
                    })
                };
                logger.debug(`parsed data`, { data: result });
                return result;
              })
          )
        );
      });
  } else {
    return new Promise((_, reject) => {
      logger.warn(`nothing to parse`);
      reject();
    });
  }
}

module.exports = { parseOutput };
