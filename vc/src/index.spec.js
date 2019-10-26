const underTest = require("./index");

describe("vc", () => {
  it("can create a commit", () => {
    let repo = underTest.createRepo({ a: 3 });
    repo.commit(latest => {
      latest.b = 4;
      latest.a = 2;
      return latest;
    });
    expect(repo.history.length).toBe(1);
    expect(Object.keys(repo.history[0].data).length).toBeGreaterThan(0);
    expect(repo.latest).toEqual({ a: 2, b: 4 });
  });

  it("can handle repeated commits", () => {
    let repo = underTest.createRepo({ a: 3 });
    repo.commit(data => {
      data.b = 4;
      return data;
    });
    repo.commit(data => {
      data.a = 2;
      return data;
    });
    expect(repo.history.length).toBe(2);
    expect(Object.keys(repo.history[1].data).length).toBeGreaterThan(0);
    expect(repo.latest).toEqual({ a: 2, b: 4 });
  });

  it("can get a changeset from a commit to latest", () => {
    let repo = underTest.createRepo({ a: 3 });
    repo.commit(data => {
      data.b = 4;
      return data;
    });
    repo.commit(data => {
      data.c = 2;
      return data;
    });
    expect(repo.getChangeFromCommit(repo.history[0].hash)).not.toEqual(
      repo.getChangeFromCommit(repo.history[1].hash)
    );
    expect(repo.getChangeFromCommit(repo.history[1].hash)).toEqual({
      added: { c: 2 }
    });
  });

  it("can get a changeset when no hash is provided", () => {
    let repo = underTest.createRepo({ a: 3 });
    repo.commit(data => {
      data.b = 4;
      return data;
    });
    repo.commit(data => {
      data.c = 2;
      return data;
    });
    expect(repo.getChangeFromCommit()).toEqual({
      added: { b: 4, c: 2 }
    });
  });
});
