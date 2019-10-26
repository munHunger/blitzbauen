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

  it("can join real life example", () => {
    let a = {
      timestamp: 1572032694426,
      name: "blitz",
      id: "ankmi",
      status: -1,
      details: [],
      hash: "f6fc9f0729549989d8bce92080394dade90ec970"
    };
    let b = {
      added: {
        details: {
          "0": {
            output:
              '\n> core-js@3.2.1 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/core-js\n> node scripts/postinstall || echo "ignore"\n\n\u001b[96mThank you for using core-js (\u001b[94m https://github.com/zloirock/core-js \u001b[96m) for polyfilling JavaScript standard library!\u001b[0m\n\n\u001b[96mThe project needs your help! Please consider supporting of core-js on Open Collective or Patreon: \u001b[0m\n\u001b[96m>\u001b[94m https://opencollective.com/core-js \u001b[0m\n\u001b[96m>\u001b[94m https://www.patreon.com/zloirock \u001b[0m\n\n\u001b[96mAlso, the author of core-js (\u001b[94m https://github.com/zloirock \u001b[96m) is looking for a good job -)\u001b[0m\n\n\n> protobufjs@6.8.8 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/protobufjs\n> node scripts/postinstall\n\n\n> nodemon@1.19.1 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/nodemon\n> node bin/postinstall || exit 0\n\nadded 719 packages from 895 contributors and audited 4467 packages in 6.699s\nfound 0 vulnerabilities\n\n'
          },
          "1": {
            step: "install dependencies",
            output:
              '\n> core-js@3.2.1 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/core-js\n> node scripts/postinstall || echo "ignore"\n\n\u001b[96mThank you for using core-js (\u001b[94m https://github.com/zloirock/core-js \u001b[96m) for polyfilling JavaScript standard library!\u001b[0m\n\n\u001b[96mThe project needs your help! Please consider supporting of core-js on Open Collective or Patreon: \u001b[0m\n\u001b[96m>\u001b[94m https://opencollective.com/core-js \u001b[0m\n\u001b[96m>\u001b[94m https://www.patreon.com/zloirock \u001b[0m\n\n\u001b[96mAlso, the author of core-js (\u001b[94m https://github.com/zloirock \u001b[96m) is looking for a good job -)\u001b[0m\n\n\n> protobufjs@6.8.8 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/protobufjs\n> node scripts/postinstall\n\n\n> nodemon@1.19.1 postinstall /home/munhunger/develop/blitzbauen/server/repos/blitz/server/node_modules/nodemon\n> node bin/postinstall || exit 0\n\nadded 719 packages from 895 contributors and audited 4467 packages in 6.699s\nfound 0 vulnerabilities\n\n',
            time: 7402,
            status: 0
          },
          "2": {
            output:
              "\n> blitzbauen@0.1.0 lint /home/munhunger/develop/blitzbauen/server/repos/blitz/server\n> eslint .\n\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/builder/builder.js\n   25:1  warning  Missing JSDoc return type  valid-jsdoc\n   70:1  warning  JSDoc syntax error         valid-jsdoc\n  108:1  warning  JSDoc syntax error         valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/builder/index.js\n  31:1  warning  Missing JSDoc @returns for function  valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/builder/outputParser.js\n  20:1  warning  Missing JSDoc @returns for function                valid-jsdoc\n  22:4  warning  Missing JSDoc parameter description for 'baseDir'  valid-jsdoc\n  23:4  warning  Missing JSDoc parameter description for 'output'   valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/logger.js\n  39:1  warning  Missing JSDoc @returns for function  valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/resolvers/mutation/index.js\n   7:1  warning  Missing JSDoc @returns for function       valid-jsdoc\n   9:4  warning  Expected JSDoc for '_' but found 'input'  valid-jsdoc\n  18:1  warning  Missing JSDoc @returns for function       valid-jsdoc\n  20:4  warning  Expected JSDoc for '_' but found 'input'  valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/resolvers/mutation/util.js\n  3:1  warning  Missing JSDoc @returns for function                valid-jsdoc\n  6:4  warning  Missing JSDoc parameter description for 'oldData'  valid-jsdoc\n  7:4  warning  Missing JSDoc parameter description for 'newData'  valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/resolvers/query/index.js\n   9:1  warning  Missing JSDoc @returns for function       valid-jsdoc\n  11:4  warning  Expected JSDoc for '_' but found 'input'  valid-jsdoc\n  34:1  warning  Missing JSDoc @returns for function       valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/schedules/gitpoll.js\n  10:1  warning  Missing JSDoc @returns for function  valid-jsdoc\n\n/home/munhunger/develop/blitzbauen/server/repos/blitz/server/src/server.js\n  13:1  warning  Missing JSDoc @returns for function  valid-jsdoc\n  27:1  warning  Missing JSDoc @returns for function  valid-jsdoc\n\n✖ 21 problems (0 errors, 21 warnings)\n\n"
          }
        }
      }
    };
    console.log(underTest.join(a, b));
  });
});
