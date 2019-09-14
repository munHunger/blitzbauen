const { update } = require("./util");

describe("Partial update of object", () => {
  describe("On primitives", () => {
    it("inserts properties where missing", () => {
      let org = {};
      update(org, { a: "b" });
      expect(org).toEqual({ a: "b" });
    });
    it("does not override on insert", () => {
      let org = { b: "c" };
      update(org, { a: "b" });
      expect(org).toEqual({ a: "b", b: "c" });
    });
    it("does not override other on update", () => {
      let org = { a: "d", b: "c" };
      update(org, { a: "b" });
      expect(org).toEqual({ a: "b", b: "c" });
    });
  });

  describe("On objects", () => {
    it("inserts properties where missing", () => {
      let org = {};
      update(org, { a: { c: "b" } });
      expect(org).toEqual({ a: { c: "b" } });
    });
    it("does not override on insert", () => {
      let org = { b: { d: "c" } };
      update(org, { a: { q: "b" } });
      expect(org).toEqual({ a: { q: "b" }, b: { d: "c" } });
    });
    it("does not override other on update", () => {
      let org = { a: { q: "b" }, b: { d: "c" } };
      update(org, { a: { q: "a" } });
      expect(org).toEqual({ a: { q: "a" }, b: { d: "c" } });
    });
  });
});

describe("updating lists", () => {
  it("creates a list object when needed", () => {
    let org = {};
    update(org, { list: [] });
    expect(org).toEqual({ list: [] });
  });
  it("adds an element if id is missing", () => {
    let org = { list: [] };
    update(org, { list: [{ a: "b" }] });
    expect(org.list.length).toEqual(1);
  });
  it("creates an id for the new element", () => {
    let org = { list: [] };
    update(org, { list: [{ a: "b" }] });
    expect(org.list[0].id).toBeDefined();
  });
  it("can update existing elements if there is an attached id", () => {
    let org = { list: [{ id: "a", a: "a" }] };
    update(org, { list: [{ id: "a", a: "b" }] });
    expect(org).toEqual({ list: [{ id: "a", a: "b" }] });
  });
});
