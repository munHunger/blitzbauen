const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");
let exec = {
  exec: script => {
    return require("child_process").exec(script);
  }
};
var simplegit = {
  cwd: sinon.stub().returns({
    clone: sinon.stub().returns({
      exec: fn => {
        fn.apply();
      }
    }),
    log: fn => {
      fn.apply(this, [
        "err",
        { latest: { hash: "hash", message: "commit message" } }
      ]);
    }
  })
};

const settings = {
  settings: {
    repositories: [
      {
        name: "blitz",
        url: "github.com/blitz.git",
        id: "asdf"
      }
    ]
  }
};

const blitz = {
  steps: [
    {
      name: "test",
      script: "echo 'hello world'"
    },
    {
      name: "error",
      script: "exit 1"
    },
    {
      name: "OK",
      script: "echo 'hello universe'"
    }
  ]
};

const fs = {
  existsSync: sinon.stub(),
  promises: {
    readFile: sinon
      .stub()
      .returns(new Promise((resolve, _) => resolve(JSON.stringify(blitz))))
  }
};

var datason = {
  connect: sinon.stub().returns(
    new Promise((resolve, _) => {
      resolve(settings);
    })
  )
};

var builder = proxyquire("./builder", {
  fs,
  datason,
  "simple-git": sinon.stub().returns(simplegit),
  child_process: exec
});

describe("Builder", () => {
  beforeAll(() => builder.init);
  describe("Running steps", () => {
    it("Runns all steps", () =>
      builder
        .runStepsInProgression(
          [blitz.steps[0], blitz.steps[2]].map(step => {
            return { ...step, repo: { name: "blitz" } };
          })
        )
        .execution.then(data =>
          expect(data).toEqual(
            jasmine.objectContaining({
              details: [
                jasmine.objectContaining({
                  step: "test",
                  output: "hello world\n"
                }),
                jasmine.objectContaining({
                  step: "OK",
                  output: "hello universe\n"
                })
              ]
            })
          )
        ));
  });
  describe("Running step", () => {
    it("resolves the output on complete", () =>
      builder
        .runStep({ ...blitz.steps[0], repo: { name: "blitz" } })
        .execution.then(data =>
          expect(data.out.trim()).toEqual("hello world")
        ));
    it("updates the out object", () => {
      let step = builder.runStep({
        ...blitz.steps[0],
        repo: { name: "blitz" }
      });
      return step.execution.then(_ =>
        expect(step.out().trim()).toEqual("hello world")
      );
    });
    it("rejects on error", () =>
      builder
        .runStep({ ...blitz.steps[1], repo: { name: "blitz" } })
        .execution.then(_ => new Error("did not reject"))
        .catch(_ => {}));
  });
  describe("Reading settings", () => {
    it("returns undefined if no repo is found", () =>
      expect(builder.readSettings("")).not.toBeDefined());
    it("returns the repo if found", () =>
      expect(builder.readSettings("blitz")).toEqual(
        settings.settings.repositories[0]
      ));
  });
  describe("Cloning repository", () => {
    it("clones the url and rejects non blitz projects", () => {
      fs.existsSync.returns(false);
      return builder
        .cloneRepo(settings.settings.repositories[0])
        .then(_ => new Error("did not reject"))
        .catch(_ =>
          sinon.assert.calledWith(
            simplegit.clone,
            settings.settings.repositories[0].url,
            `repos/${settings.settings.repositories[0].name}`
          )
        );
    });
    it("clones the url and resolves valid blitz projects", () => {
      fs.existsSync.returns(true);
      return builder.cloneRepo(settings.settings.repositories[0]).then(data => {
        sinon.assert.calledWith(
          simplegit.clone,
          settings.settings.repositories[0].url,
          `repos/${settings.settings.repositories[0].name}`
        );
        expect(data).toEqual({ ...blitz, hash: "hash" });
      });
    });
  });
});
