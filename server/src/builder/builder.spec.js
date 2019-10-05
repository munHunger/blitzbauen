const builder = require("./builder");

describe("Reading settings", () => {
  it("rejects if there is no settings file", () =>
    expect(builder.readSettings("")).not.toBeDefined());
});
