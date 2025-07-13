import { test } from "node:test";
import { strict as assert } from "node:assert";

import { Dflow, DflowNode } from "./dflow.ts";
import type { DflowDataType } from "./dflow.ts";

const { input, output } = DflowNode;

const num = 1;
const bool = true;
const str = "string";
const arr = [num, bool, str];
const obj = { foo: num, bar: str };

const dataTypes: DflowDataType[] = [
  "null",
  "boolean",
  "number",
  "string",
  "array",
  "object"
];

class IdentityNode extends DflowNode {
  static kind = "Identity";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    return input;
  }
}

class SumNode extends DflowNode {
  static kind = "Sum";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run(a: number, b: number) {
    return a + b;
  }
}

function sleep(seconds = 1) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

class SleepNode extends DflowNode {
  static kind = "Sleep";
  async run() {
    console.info("sleep node start");
    await sleep();
    console.info("sleep node end");
  }
}

class ErrorNode extends DflowNode {
  static kind = "Opsss";
  static inputs = [input("boolean", { name: "shouldThrow" })];
  run(shouldThrow: boolean) {
    if (shouldThrow) throw new Error("Something went wrong");
  }
}

const nodeDefinitions1 = [IdentityNode, ErrorNode];

const nodeDefinitions2 = [SumNode, SleepNode];

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const linkId1 = "e1";
  const dflow = new Dflow(nodeDefinitions1);
  dflow.node("Identity", { id: nodeId1 });
  dflow.node("Identity", { id: nodeId2 });
  dflow.link([nodeId1, 0], [nodeId2, 0], linkId1);

  return { dflow, nodeId1, nodeId2, linkId1 };
}

test("Dflow.inferDataType()", () => {
  [
    { input: arr, output: ["array"] },
    { input: bool, output: ["boolean"] },
    { input: num, output: ["number"] },
    { input: NaN, output: [] },
    { input: null, output: ["null"] },
    { input: obj, output: ["object"] },
    { input: str, output: ["string"] },
    { input: undefined, output: [] }
  ].forEach(({ input, output }) => {
    assert.deepEqual(Dflow.inferDataType(input).join(), output.join());
  });
});

test("Dflow.isArray()", () => {
  assert.deepEqual(Dflow.isArray(arr), true);
  assert.deepEqual(Dflow.isArray(bool), false);
  assert.deepEqual(Dflow.isArray(num), false);
  assert.deepEqual(Dflow.isArray(NaN), false);
  assert.deepEqual(Dflow.isArray(null), false);
  assert.deepEqual(Dflow.isArray(obj), false);
  assert.deepEqual(Dflow.isArray(str), false);
  assert.deepEqual(Dflow.isArray(undefined), false);

  // bad array
  assert.deepEqual(Dflow.isArray([1, () => {}]), false);
  // good nested array
  assert.deepEqual(Dflow.isArray([1, [2, 3], [{ foo: 42 }], [true, {}]]), true);
  // bad nested array
  assert.deepEqual(
    Dflow.isArray([1, [2, 3], [{ foo: 42 }], [true, () => {}]]),
    false
  );
});

test("Dflow.isNumber()", () => {
  assert.deepEqual(Dflow.isNumber(arr), false);
  assert.deepEqual(Dflow.isNumber(bool), false);
  assert.deepEqual(Dflow.isNumber(num), true);
  assert.deepEqual(Dflow.isNumber(NaN), false);
  assert.deepEqual(Dflow.isNumber(null), false);
  assert.deepEqual(Dflow.isNumber(obj), false);
  assert.deepEqual(Dflow.isNumber(str), false);
  assert.deepEqual(Dflow.isNumber(undefined), false);
  assert.deepEqual(Dflow.isNumber(Infinity), false);
});

test("Dflow.isObject()", () => {
  assert.deepEqual(Dflow.isObject(arr), false);
  assert.deepEqual(Dflow.isObject(bool), false);
  assert.deepEqual(Dflow.isObject(num), false);
  assert.deepEqual(Dflow.isObject(NaN), false);
  assert.deepEqual(Dflow.isObject(null), false);
  assert.deepEqual(Dflow.isObject(obj), true);
  assert.deepEqual(Dflow.isObject(str), false);
  assert.deepEqual(Dflow.isObject(undefined), false);

  // bad object
  assert.deepEqual(Dflow.isObject({ foo: () => {} }), false);
  // good nested object
  assert.deepEqual(Dflow.isObject({ foo: { bar: [{ quz: true }] } }), true);
  // bad nested object
  assert.deepEqual(Dflow.isObject({ foo: [1], bar: { quz: () => {} } }), false);
});

test("Dflow.isValidData()", () => {
  // Any type.

  assert.deepEqual(Dflow.isValidData([], arr), true);
  assert.deepEqual(Dflow.isValidData([], bool), true);
  assert.deepEqual(Dflow.isValidData([], num), true);
  assert.deepEqual(Dflow.isValidData([], null), true);
  assert.deepEqual(Dflow.isValidData([], obj), true);
  assert.deepEqual(Dflow.isValidData([], str), true);
  assert.deepEqual(Dflow.isValidData([], undefined), true);
  assert.deepEqual(Dflow.isValidData([], Infinity), false);
  assert.deepEqual(Dflow.isValidData([], NaN), false);

  // The `array` type.

  assert.deepEqual(Dflow.isValidData(["array"], arr), true);
  assert.deepEqual(Dflow.isValidData(["boolean"], arr), false);
  assert.deepEqual(Dflow.isValidData(["null"], arr), false);
  assert.deepEqual(Dflow.isValidData(["number"], arr), false);
  assert.deepEqual(Dflow.isValidData(["object"], arr), false);
  assert.deepEqual(Dflow.isValidData(["string"], arr), false);

  assert.deepEqual(Dflow.isValidData(["array"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["array"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["array"], undefined), false);

  // The `boolean` type.

  assert.deepEqual(Dflow.isValidData(["array"], bool), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], bool), true);
  assert.deepEqual(Dflow.isValidData(["null"], bool), false);
  assert.deepEqual(Dflow.isValidData(["number"], bool), false);
  assert.deepEqual(Dflow.isValidData(["object"], bool), false);
  assert.deepEqual(Dflow.isValidData(["string"], bool), false);

  assert.deepEqual(Dflow.isValidData(["boolean"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], undefined), false);

  // The `null` type.

  assert.deepEqual(Dflow.isValidData(["array"], null), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], null), false);
  assert.deepEqual(Dflow.isValidData(["null"], null), true);
  assert.deepEqual(Dflow.isValidData(["number"], null), false);
  assert.deepEqual(Dflow.isValidData(["object"], null), false);
  assert.deepEqual(Dflow.isValidData(["string"], null), false);

  assert.deepEqual(Dflow.isValidData(["null"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["null"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["null"], undefined), false);

  // The `number` type.

  assert.deepEqual(Dflow.isValidData(["array"], num), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], num), false);
  assert.deepEqual(Dflow.isValidData(["null"], num), false);
  assert.deepEqual(Dflow.isValidData(["number"], num), true);
  assert.deepEqual(Dflow.isValidData(["object"], num), false);
  assert.deepEqual(Dflow.isValidData(["string"], num), false);

  assert.deepEqual(Dflow.isValidData(["number"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["number"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["number"], undefined), false);

  // The `object` type.

  assert.deepEqual(Dflow.isValidData(["array"], obj), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], obj), false);
  assert.deepEqual(Dflow.isValidData(["null"], obj), false);
  assert.deepEqual(Dflow.isValidData(["number"], obj), false);
  assert.deepEqual(Dflow.isValidData(["object"], obj), true);
  assert.deepEqual(Dflow.isValidData(["string"], obj), false);

  assert.deepEqual(Dflow.isValidData(["object"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["object"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["object"], undefined), false);

  // The `string` type.

  assert.deepEqual(Dflow.isValidData(["array"], str), false);
  assert.deepEqual(Dflow.isValidData(["boolean"], str), false);
  assert.deepEqual(Dflow.isValidData(["null"], str), false);
  assert.deepEqual(Dflow.isValidData(["number"], str), false);
  assert.deepEqual(Dflow.isValidData(["object"], str), false);
  assert.deepEqual(Dflow.isValidData(["string"], str), true);

  assert.deepEqual(Dflow.isValidData(["string"], Infinity), false);
  assert.deepEqual(Dflow.isValidData(["string"], NaN), false);
  assert.deepEqual(Dflow.isValidData(["string"], undefined), false);

  // Multiple types, no particular order here.

  assert.deepEqual(Dflow.isValidData(["boolean", "array"], arr), true);
  assert.deepEqual(
    Dflow.isValidData(["string", "number", "boolean"], bool),
    true
  );
  assert.deepEqual(
    Dflow.isValidData(["number", "object", "string"], num),
    true
  );
  assert.deepEqual(Dflow.isValidData(["object", "string"], null), false);
  assert.deepEqual(Dflow.isValidData(["array", "object"], obj), true);
  assert.deepEqual(Dflow.isValidData(["array", "string"], str), true);
  assert.deepEqual(Dflow.isValidData(["boolean", "string"], arr), false);
  assert.deepEqual(Dflow.isValidData(["number", "array"], bool), false);
  assert.deepEqual(
    Dflow.isValidData(["boolean", "object", "string"], num),
    false
  );
  assert.deepEqual(Dflow.isValidData(["object", "string"], null), false);
  assert.deepEqual(Dflow.isValidData(["array", "boolean"], obj), false);
  assert.deepEqual(Dflow.isValidData(["number", "array"], str), false);
});

test("new Dflow has an empty graph", () => {
  const dflow = new Dflow([]);
  assert.deepEqual(dflow.graph, { n: {}, l: {} });
});

test("dflow.graph", () => {
  const { dflow } = sample01();

  assert.deepEqual(dflow.graph, {
    l: { e1: ["n1", 0, "n2", 0] },
    n: {
      n1: { k: "Identity", o: [{}] },
      n2: { k: "Identity", o: [{}] }
    }
  });
});

test("dflow.run()", async () => {
  const dflow = new Dflow(nodeDefinitions2);

  // Num#out=2 -> | Sum#in1 |
  //              |         |-> Sum#out=4
  // Num#out=2 -> | Sum#in2 |
  dflow.node("data", {
    id: "num",
    outputs: [{ data: 2 }]
  });
  const sumNodeId = dflow.node("Sum");
  dflow.link(["num", 0], [sumNodeId, 0]);
  dflow.link(["num", 0], [sumNodeId, 1]);

  // Add also an async node.
  dflow.node("Sleep", { id: "sleep" });

  await dflow.run();

  assert.deepEqual(dflow.graph.n[sumNodeId]?.o?.[0]?.d, 4);
});

test("dflow.run() with error", () => {
  const dflow = new Dflow(nodeDefinitions1);
  const nodeId1 = dflow.node("Opsss");
  // First run, it will not throw.
  dflow.run();
  assert.equal(dflow.graph.n[nodeId1].err, undefined);
  const nodeId2 = dflow.node("data", { outputs: [{ data: true }] });
  const linkId = dflow.link(nodeId2, nodeId1);
  // Second time, it will throw an error.
  dflow.run();
  assert.equal(dflow.graph.n[nodeId1].err, "Something went wrong");
  // Third time, it will not throw again.
  dflow.delete(linkId);
  dflow.run();
  assert.equal(dflow.graph.n[nodeId1].err, undefined);
});

test("dflow.newNode()", () => {
  const dflow = new Dflow(nodeDefinitions1);

  // newNode with id
  const nodeId1 = "node1";
  dflow.node("Identity", { id: nodeId1 });

  // newNode with outputs
  const nodeId2 = dflow.node("data", { outputs: [{ data: 42 }] });

  assert.deepEqual(dflow.graph, {
    n: {
      [nodeId1]: {
        k: "Identity",
        o: [{}]
      },
      [nodeId2]: {
        k: "data",
        o: [{ d: 42 }]
      }
    },
    l: {}
  });
});

test("dflow.link()", () => {
  const dflow = new Dflow(nodeDefinitions1);

  const nodeId1 = dflow.node("Identity");
  const nodeId2 = dflow.node("Identity");
  const linkId = dflow.link(nodeId1, nodeId2);
  assert.equal(typeof linkId, "string");

  assert.throws(
    () => {
      dflow.link("not found 1", nodeId2);
    },
    { message: "Cannot create link" }
  );
});

test("dflow.delete(nodeId)", () => {
  const { dflow, nodeId1 } = sample01();
  dflow.delete(nodeId1);
  // Only one node left.
  assert.equal(Object.keys(dflow.graph.n).length, 1);
  // Link is deleted.
  assert.equal(Object.keys(dflow.graph.l).length, 0);
});

test("dflow.delete(linkId)", () => {
  const { dflow, linkId1 } = sample01();
  dflow.delete(linkId1);
  // No links.
  assert.equal(Object.keys(dflow.graph.l).length, 0);
  // Nodes are preserved.
  assert.equal(Object.keys(dflow.graph.n).length, 2);
});

test("Dflow.canConnect()", () => {
  const testCases: {
    sourceTypes: DflowDataType[];
    targetTypes: DflowDataType[];
    expected: boolean;
  }[] = [
    // Every source can connect to a target with same type.
    ...dataTypes.map((dataType) => ({
      sourceTypes: [dataType],
      targetTypes: [dataType],
      expected: true
    })),
    // Every source can connect to a target with type "any".
    ...dataTypes.map((dataType) => ({
      sourceTypes: [dataType],
      targetTypes: [],
      expected: true
    })),
    // Every source with type "any" can connect to a target with type "any".
    { sourceTypes: [], targetTypes: [], expected: true },
    // A source with defined type cannot connect to a target with different type.
    { sourceTypes: ["array"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["array"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["array"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["array"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["array"], targetTypes: ["null"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["null"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["null"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["null"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["null"], expected: false },
    { sourceTypes: ["null"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["null"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["null"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["null"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["null"], targetTypes: ["string"], expected: false }
  ];

  testCases.forEach(({ sourceTypes, targetTypes, expected }) => {
    assert.deepEqual(Dflow.canConnect(sourceTypes, targetTypes), expected);
  });
});
