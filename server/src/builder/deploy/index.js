const logger = require("../../logger").logger("deploy");

/**
 * Deploys a blitz project
 * @param {*} build
 */
function deploy(build) {
  if (!build.deployments) {
    logger.debug(`No deployment found in build`);
    return;
  }
  logger.info("Starting deployment", { data: build });
  build.deployments.targets.map(target => {
    target.artifacts.map(artifact => {
      let bin = build.steps
        .filter(step => step.output && step.output.artifact)
        .map(step => step.output.artifact.binaries)
        .find(binary =>
          artifact.requirement.all(req => binary.tags.indexOf(req) > -1)
        );
      logger.debug(
        `deploying artifact from path ${bin.path} to ${target.path} on machine ${target.name} at ${target.ip}`
      );
    });
    logger.debug(`Artifacts deployed running script`);
  });
}

module.exports = { deploy };
