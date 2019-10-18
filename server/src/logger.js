const chalk = require("chalk");
const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

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
    data
      ? "\n" +
        JSON.stringify(data, null, 2)
          .split("\n")
          .map(s => "   " + s)
          .join("\n")
      : ""
  }`;
});

const logger = system =>
  winston.createLogger({
    format: combine(timestamp(), label({ label: system }), blitzFormat),
    level: "debug",
    //   format: winston.format.json(),

    transports: [new winston.transports.Console()]
  });

module.exports = { logger };
