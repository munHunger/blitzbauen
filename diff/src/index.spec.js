const underTest = require("./");

describe("simple objects", () => {
  it("detects when no change is needed on empty objects", () => {
    expect(underTest.diff({}, {})).toEqual({});
  });
  it("detects adding properties", () => {
    expect(underTest.diff({}, { a: "b" })).toEqual({ added: { a: "b" } });
  });
  it("detects updating properties", () => {
    expect(underTest.diff({ a: "v" }, { a: "b" })).toEqual({
      updated: { a: "b" }
    });
  });
  it("detects deletions", () => {
    expect(underTest.diff({ a: "v" }, {})).toEqual({
      deleted: { a: true }
    });
  });
});

describe("nested objects", () => {
  it("manages nested diffs", () => {
    expect(underTest.diff({ a: { b: 2 } }, { a: { c: 4 } })).toEqual({
      added: { a: { c: 4 } },
      deleted: { a: { b: true } }
    });
  });
  it("ignores unchanged objects", () => {
    expect(
      underTest.diff({ a: { b: 2 }, d: { e: 4 } }, { a: { c: 4 }, d: { e: 4 } })
    ).toEqual({
      added: { a: { c: 4 } },
      deleted: { a: { b: true } }
    });
  });
});

describe("strings", () => {
  it("detects that it can be appended", () => {
    expect(underTest.diff({ a: "b" }, { a: "bd" })).toEqual({
      append: { a: "d" }
    });
  });
});

describe("joiner", () => {
  it("can merge simple object additions", () => {
    let a = { a: 3, c: 5, d: "qe", g: "fu" };
    let b = { a: 3, b: 5, d: "ab", g: "fuck" };
    expect(underTest.join(a, underTest.diff(a, b))).toEqual(b);
  });

  it("can merge nested objects", () => {
    let a = { a: "f", t: { b: "c", g: 5, h: true, i: "a" } };
    let b = {
      a: "f",
      t: { b: "cad", h: false, i: "e", k: "gerk" },
      k: { f: "yr" }
    };
    expect(underTest.join(a, underTest.diff(a, b))).toEqual(b);
  });
});
