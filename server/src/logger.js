const chalk = require("chalk");
const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

let level = (
  process.argv.find(arg => arg.startsWith("log_level=")) || "log_level=info"
).split("=")[1];
let shouldPrintData = process.argv.find(arg => arg === "log_data")
  ? true
  : false;

const blitzFormat = printf(({ level, message, label, timestamp, data }) => {
  level = level.toUpperCase();
  switch (level) {
    case "WARN":
      level = chalk.yellow(level);
      break;
    case "INFO":
      level = chalk.green(level);
      break;
    case "DEBUG":
      level = chalk.blue(level);
      break;
  }
  if (label) label = chalk.bold(label);
  return ` [${chalk.magenta(timestamp.slice(11, 19))}] ${level} - ${
    label ? label + " - " : ""
  }${message} ${
    data && shouldPrintData
      ? "\n" +
        JSON.stringify(data, null, 2)
          .split("\n")
          .map(s => "   " + s)
          .join("\n")
      : ""
  }`;
});

/**
 * Creates a logger
 * @param {string} system a label that denotes who is logging
 */
const logger = system =>
  winston.createLogger({
    format: combine(timestamp(), label({ label: system }), blitzFormat),
    level,
    //   format: winston.format.json(),

    transports: [new winston.transports.Console()]
  });
logger("logger").info(
  `Logs setup with level ${level} and printData ${shouldPrintData}`
);
module.exports = { logger };
