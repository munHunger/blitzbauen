const logger = require("../../logger").logger("deploy");

/**
 * Deploys a blitz project
 * @param {*} build
 */
function deploy(build) {
  if (!build.deployment) {
    logger.debug(`No deployment found in build`, { data: build });
    return;
  }
  logger.info("Starting deployment", { data: build });
  build.deployment.targets.map(target => {
    logger.debug(`checking target`, { data: target });
    target.artifacts.map(artifact => {
      logger.debug(`searching for artifact`, { data: artifact });
      let bin = build.steps
        .filter(step => step.output && step.output.artifact)
        .map(step => step.output.artifact.binaries)
        .reduce((acc, val) => acc.concat(val), [])
        .find(binary =>
          artifact.requirement.all(req => binary.tags.indexOf(req) > -1)
        );
      if (!bin) logger.info(`No output found`);
      else
        logger.debug(
          `deploying artifact from path ${bin.path} to ${target.path} on machine ${target.name} at ${target.ip}`
        );
    });
    logger.debug(`Artifacts deployed running script`);
  });
}

module.exports = { deploy };
