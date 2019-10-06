// const sinon = require("sinon");
// const proxyquire = require("proxyquire").noCallThru();
// var octokit = sinon.stub();
// var simplegit = { clone: sinon.stub().returns({ exec: () => {} }) };
// var fs = require("fs");
// var mock = {
//   "@octokit/rest": octokit,
//   "simple-git": sinon.stub().returns(simplegit),
//   fs
// };

// // sinon.stub(fs.promises, "readFile").returns(
// //   new Promise((resolve, reject) =>
// //     resolve(
// //       JSON.stringify(
// //         {
// //           repositories: [
// //             {
// //               name: "blitz",
// //               url: "github.com/blitzbauen.git",
// //               id: "1rqm8"
// //             },
// //             {
// //               name: "404",
// //               url: "github.com/404.git",
// //               id: "1rqm8"
// //             }
// //           ]
// //         },
// //         null,
// //         0
// //       )
// //     )
// //   )
// // );

// var octokitRepos = {
//   get: data =>
//     sinon.stub().returns(
//       new Promise((resolve, reject) => {
//         if (data.repo === "404") reject("Not found");
//         else resolve({ data: { clone_url: "cloneURL" } });
//       })
//     )
// };

// const builder = proxyquire("./index", mock);

// function resolveState(state) {
//   Object.keys(state).forEach(key => {
//     if (typeof state[key] === "function") state[key] = state[key].apply(this);
//     else resolveState(state[key]);
//   });
//   return state;
// }

// function when(state) {
//   sinon.reset();
//   octokit.returns({
//     repos: octokitRepos
//   });
//   mock["simple-git"] = sinon.stub().returns(simplegit);
//   return new Promise((resolve, _) => resolve(resolveState(state)));
// }

// describe("Building a repository", () => {
//   describe("Initial settingsfile", () => {
//     it("reads the settings file", () =>
//       when({
//         readFile: () =>
//           sinon
//             .stub(fs.promises, "readFile")
//             .returns(new Promise((resolve, _) => resolve("{}")))
//       }).then(state =>
//         builder
//           .buildRepo("repo")
//           .catch(() =>
//             sinon.assert.calledWith(state.readFile, "data/settings.json")
//           )
//       ));

//     it("rejects if the repository can't be found", () =>
//       when({
//         readFile: () =>
//           sinon
//             .stub(fs.promises, "readFile")
//             .returns(new Promise((resolve, _) => resolve("{}")))
//       }).then(state =>
//         builder
//           .buildRepo("unknown")
//           .then(() => new Error("Did not reject undefined"))
//           .catch(() => {})
//       ));
//   });

//   describe("checking repository", () => {
//     it("extracts the repo name from the git url", () =>
//       builder.buildRepo("404").catch(() =>
//         builder.buildRepo("404").catch(() =>
//           sinon.assert.calledWith(octokitRepos.get, {
//             owner: "munhunger",
//             repo: "404"
//           })
//         )
//       ));

//     it("rejects if it can't find the repo on github", () =>
//       builder
//         .buildRepo("404")
//         .then(() => new Error("Did not reject non existing repo"))
//         .catch(() => {}));

//     it("clones if a repo is found", () =>
//       builder
//         .buildRepo("blitz")
//         .catch(e => fail(e))
//         .then(_ => {
//           sinon.assert.calledWith(
//             simplegit.clone,
//             "cloneURL",
//             "repos/blitzbauen"
//           );
//         }));
//   });
// });
