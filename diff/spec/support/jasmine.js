const jasmineReporters = require("jasmine-reporters");
var junitReporter = new jasmineReporters.JUnitXmlReporter({
  savePath: "test",
  consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter);
