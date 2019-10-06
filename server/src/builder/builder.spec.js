const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");
var simplegit = {
  clone: sinon.stub().returns({
    exec: fn => {
      fn.apply();
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
      script: "cd server && npm run test",
      output: {
        reports: {
          test: {
            dir: "server/test",
            type: "junit"
          }
        }
      }
    }
  ]
};

const fs = {
  existsSync: sinon.stub(),
  promises: {
    readFile: sinon.stub().returns(new Promise((resolve, _) => resolve(blitz)))
  }
};

var datason = {
  connect: sinon.stub().returns(
    new Promise((resolve, _) => {
      resolve(settings);
    })
  )
};

var builder;

describe("Builder", () => {
  beforeAll(() =>
    proxyquire("./builder", {
      fs,
      datason,
      "simple-git": sinon.stub().returns(simplegit)
    }).then(b => (builder = b))
  );
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
      builder
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
      builder.cloneRepo(settings.settings.repositories[0]).then(data => {
        sinon.assert.calledWith(
          simplegit.clone,
          settings.settings.repositories[0].url,
          `repos/${settings.settings.repositories[0].name}`
        );
        expect(data).toEqual(blitz);
      });
    });
  });
});
