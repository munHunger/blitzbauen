/**
 * @typedef {object} blitz a full instruction for how blitzbauen should handle a repo
 * @property {buildStep[]} steps the steps to execute in order
 */

/**
 * @typedef {object} buildStep a step in the build process
 * @property {string} name the name of the step to execute
 * @property {string} script a script to run an this step
 */

/**
 * @typedef {object} buildHistory
 * @property {string} build the name of the of the build
 * @property {buildStatus} status the status of the build
 * @property {buildDetails[]} details the in depth details of the build
 * @property {number} timestamp when the build was executed
 */

/**
 * @typedef {object} buildDetails
 * @property {string} step the name of the step
 * @property {buildStatus} status the status of the step
 * @property {string} output the output of the step
 * @property {number} time the time of execution in ms
 */
