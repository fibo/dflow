import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  Dflow,
  type DflowData,
  type DflowDataType,
  type DflowNode
} from "../dflow.ts";

const { input, output } = Dflow;

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

const IdentityNode: DflowNode = {
  kind: "Identity",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input: number) {
    return input;
  }
};

const SumNode: DflowNode = {
  kind: "Sum",
  inputs: [input("number"), input("number")],
  outputs: [output("number")],
  run(a: number, b: number) {
    return a + b;
  }
};

function sleep(seconds = 1) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

const SleepNode: DflowNode = {
  kind: "Sleep",
  async run() {
    console.info("sleep node start");
    await sleep();
    console.info("sleep node end");
  }
};

const ErrorNode: DflowNode = {
  kind: "Opsss",
  inputs: [input("boolean", { name: "shouldThrow" })],
  run(shouldThrow: boolean) {
    if (shouldThrow) throw new Error("Opsss");
  }
};

const nodeDefinitions1 = [IdentityNode, ErrorNode];

const nodeDefinitions2 = [SumNode, SleepNode];

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const linkId1 = "e1";
  const dflow = new Dflow(nodeDefinitions1);
  dflow.node("Identity", nodeId1);
  dflow.node("Identity", nodeId2);
  dflow.link([nodeId1, 0], [nodeId2, 0], linkId1);

  return { dflow, nodeId1, nodeId2, linkId1 };
}

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

test("Dflow.isData()", () => {
  const testData: Array<{ input: unknown; output: boolean }> = [
    { input: arr, output: true },
    { input: bool, output: true },
    { input: num, output: true },
    { input: NaN, output: false },
    { input: null, output: true },
    { input: obj, output: true },
    { input: str, output: true },
    { input: undefined, output: false }
  ];
  for (const { input, output } of testData)
    assert.equal(Dflow.isData(input), output);
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
  assert.deepEqual(dflow.graph, { node: {}, link: {}, data: {} });
});

test("dflow.graph", () => {
  const { dflow } = sample01();

  assert.deepEqual(dflow.graph, {
    link: { e1: ["n1", 0, "n2", 0] },
    node: {
      n1: "Identity",
      n2: "Identity"
    },
    data: {}
  });
});

test("dflow.run()", async () => {
  const dflow = new Dflow(nodeDefinitions2);

  // Num#out=2 -> | Sum#in1 |
  //              |         |-> Sum#out=4
  // Num#out=2 -> | Sum#in2 |
  dflow.data(2, "num");
  const sumNodeId = dflow.node("Sum");
  dflow.link(["num", 0], [sumNodeId, 0]);
  dflow.link(["num", 0], [sumNodeId, 1]);

  // Add also an async node.
  dflow.node("Sleep");

  await dflow.run();

  assert.deepEqual(dflow.out[sumNodeId], [4]);
});

test("dflow.run() with error", () => {
  const dflow = new Dflow(nodeDefinitions1);
  const nodeId1 = dflow.node("Opsss");
  // First run, it will not throw.
  dflow.run();
  assert.equal(dflow.error[nodeId1], undefined);
  const nodeId2 = dflow.data(true);
  const linkId = dflow.link(nodeId2, nodeId1);
  // Second time, it will throw an error.
  dflow.run();
  assert.equal(dflow.error[nodeId1], "Opsss");
  // Third time will throw an error, and show a message.
  dflow.ERR = (error) => {
    assert.equal(error.message, "Opsss");
    console.info("Error logged ✅");
  };
  dflow.run();
  // This time, it will not throw.
  dflow.delete(linkId);
  dflow.run();
  assert.equal(dflow.error[nodeId1], undefined);
});

test("dflow.node()", () => {
  const dflow = new Dflow(nodeDefinitions1);

  // Create a node.
  const nodeId1 = dflow.node("Identity");
  // Create node with id.
  dflow.node("Identity", "node2");

  assert.deepEqual(dflow.graph, {
    node: {
      [nodeId1]: "Identity",
      node2: "Identity"
    },
    link: {},
    data: {}
  });

  assert.throws(
    () => {
      dflow.node("kind not found");
    },
    { message: "Cannot create node" }
  );
});

test("dflow.link()", () => {
  const dflow = new Dflow(nodeDefinitions1);

  const nodeId1 = dflow.node("Identity");
  const nodeId2 = dflow.node("Identity");
  const linkId = dflow.link(nodeId1, nodeId2);
  assert.equal(typeof linkId, "string");

  assert.throws(
    () => {
      dflow.link("node not found", nodeId2);
    },
    { message: "Cannot create link" }
  );
});

test("dflow.data()", () => {
  // Data node is builtin, pass an empty node definitions list.
  const dflow = new Dflow([]);

  // Create a data node.
  const nodeId1 = dflow.data("Hello, World!");

  // Create a data node with id.
  dflow.data(42, "TheAnswer");

  assert.deepEqual(dflow.graph, {
    data: {
      [nodeId1]: "Hello, World!",
      TheAnswer: 42
    },
    node: {
      [nodeId1]: "data",
      TheAnswer: "data"
    },
    link: {}
  });

  dflow.run();

  assert.deepEqual(dflow.out, {
    [nodeId1]: ["Hello, World!"],
    TheAnswer: [42]
  });
});

test("dflow.data() infers type and validates input", () => {
  const testData: {
    input: unknown;
    output: {
      data: DflowData;
      types: DflowDataType[];
    };
  }[] = [
    { input: arr, output: { data: arr, types: ["array"] } },
    { input: bool, output: { data: bool, types: ["boolean"] } },
    { input: num, output: { data: num, types: ["number"] } },
    { input: NaN, output: { data: undefined, types: [] } },
    { input: null, output: { data: null, types: ["null"] } },
    { input: obj, output: { data: obj, types: ["object"] } },
    { input: str, output: { data: str, types: ["string"] } },
    { input: undefined, output: { data: undefined, types: [] } }
  ];
  for (const {
    input,
    output: { data, types }
  } of testData) {
    const dflow = new Dflow([
      {
        kind: "test",
        inputs: [Dflow.input(types)],
        run: () => {}
      }
    ]);
    const dataNodeId = dflow.data(input);
    const testNodeId = dflow.node("test");
    const linkId = dflow.link(dataNodeId, testNodeId);
    assert.deepEqual(dflow.graph.link, {
      [linkId]: [dataNodeId, 0, testNodeId, 0]
    });
    dflow.run();
    assert.deepEqual(dflow.out[dataNodeId][0], data);
  }
});

test("dflow.delete(nodeId)", () => {
  const { dflow, nodeId1 } = sample01();
  dflow.delete(nodeId1);
  // Only one node left.
  assert.equal(Object.keys(dflow.graph.node).length, 1);
  // Link is deleted.
  assert.equal(Object.keys(dflow.graph.link).length, 0);
});

test("dflow.delete(linkId)", () => {
  const { dflow, linkId1 } = sample01();
  dflow.delete(linkId1);
  // No links.
  assert.equal(Object.keys(dflow.graph.link).length, 0);
  // Nodes are preserved.
  assert.equal(Object.keys(dflow.graph.node).length, 2);
});

test("dflow.canConnect()", () => {
  const testCases: Array<{
    sourceTypes: DflowDataType[];
    targetTypes: DflowDataType[];
    expected: boolean;
  }> = [
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

  for (const { sourceTypes, targetTypes, expected } of testCases) {
    const dflow = new Dflow([
      {
        kind: "testIn",
        inputs: [Dflow.input(targetTypes)],
        run: () => {}
      },
      {
        kind: "testOut",
        outputs: [Dflow.output(sourceTypes)],
        run: () => {}
      }
    ]);
    const sourceNodeId = dflow.node("testOut");
    const targetNodeId = dflow.node("testIn");
    assert.equal(
      dflow.canConnect([sourceNodeId, 0, targetNodeId, 0]),
      expected
    );
  }
});
