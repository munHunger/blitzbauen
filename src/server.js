const octokit = new (require("@octokit/rest"))();
const simplegit = require("simple-git")();

octokit.repos
  .get({
    owner: "munhunger",
    repo: "blitzbauen"
  })
  .then(({ data }) => {
    let repo = data;
    octokit.repos
      .listCommits({
        owner: "munhunger",
        repo: "blitzbauen"
      })
      .then(({ data }) => {
        simplegit.clone(repo.clone_url, 'repos');
      });
  });
