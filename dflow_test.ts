import { test } from "node:test"
import { strict as assert } from "node:assert"

import {
  Dflow,
  DflowErrorItemNotFound,
  DflowNode,
  DflowOutput,
} from "./dflow.js";
import type { DflowDataType } from "./dflow.js";

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
  "object",
];

class IdentityNode extends DflowNode {
  static kind = "Identity";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = this.input(0).data;
  }
}

class SumNode extends DflowNode {
  static kind = "Sum";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    const data0 = this.input(0).data as number;
    const data1 = this.input(1).data as number;
    this.output(0).data = data0 + data1;
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
    console.log("sleep node start");
    await sleep();
    console.log("sleep node end");
  }
}

const nodesCatalog1 = {
  [IdentityNode.kind]: IdentityNode,
};

const nodesCatalog2 = {
  [SumNode.kind]: SumNode,
  [SleepNode.kind]: SleepNode,
};

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const pinId1 = "p1";
  const pinId2 = "p2";
  const edgeId1 = "e2";
  const dflow = new Dflow(nodesCatalog1);
  const catalog = dflow.nodesCatalog;
  dflow.newNode({
    id: nodeId1,
    kind: catalog.Identity.kind,
    outputs: [{ id: pinId1 }],
  });
  dflow.newNode({
    id: nodeId2,
    kind: catalog.Identity.kind,
    inputs: [{ id: pinId2 }],
  });
  dflow.newEdge({
    id: edgeId1,
    source: [nodeId1, pinId1],
    target: [nodeId2, pinId2],
  });

  return { dflow, nodeId1, nodeId2, pinId1, pinId2, edgeId1 };
}

// Dflow
// ////////////////////////////////////////////////////////////////////////////

 test("Dflow.ancestorsOfNodeId", () => {
   assert.deepEqual(
     Dflow.ancestorsOfNodeId("n", [
       { sourceId: "n1", targetId: "n" },
     ]),
     ["n1"],
   );

   assert.deepEqual(
     Dflow.ancestorsOfNodeId("n", [
       { sourceId: "n1", targetId: "n2" },
       { sourceId: "n2", targetId: "n" },
     ]),
     ["n2", "n1"],
   );
 });

test("Dflow.inferDataType()", () => {
  [
    { input: arr, output: ["array"] },
    { input: bool, output: ["boolean"] },
    { input: num, output: ["number"] },
    { input: NaN, output: [] },
    { input: null, output: ["null"] },
    { input: obj, output: ["object"] },
    { input: str, output: ["string"] },
    { input: undefined, output: [] },
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
    false,
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
  assert.deepEqual(
    Dflow.isObject({ foo: { bar: [{ quz: true }] } }),
    true,
  );
  // bad nested object
  assert.deepEqual(Dflow.isObject({ foo: [1], bar: { quz: () => {} } }), false);
});

test("Dflow.isValidDataType()", () => {
  // Any type.

  assert.deepEqual(Dflow.isValidDataType([], arr), true);
  assert.deepEqual(Dflow.isValidDataType([], bool), true);
  assert.deepEqual(Dflow.isValidDataType([], num), true);
  assert.deepEqual(Dflow.isValidDataType([], NaN), true);
  assert.deepEqual(Dflow.isValidDataType([], null), true);
  assert.deepEqual(Dflow.isValidDataType([], obj), true);
  assert.deepEqual(Dflow.isValidDataType([], str), true);
  assert.deepEqual(Dflow.isValidDataType([], undefined), true);
  assert.deepEqual(Dflow.isValidDataType([], Infinity), true);

  // The `array` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], arr), true);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], arr), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], arr), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], arr), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], arr), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], arr), false);

  assert.deepEqual(Dflow.isValidDataType(["array"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["array"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["array"], undefined), false);

  // The `boolean` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], bool), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], bool), true);
  assert.deepEqual(Dflow.isValidDataType(["null"], bool), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], bool), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], bool), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], bool), false);

  assert.deepEqual(Dflow.isValidDataType(["boolean"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], undefined), false);

  // The `null` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], null), true);
  assert.deepEqual(Dflow.isValidDataType(["number"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], null), false);

  assert.deepEqual(Dflow.isValidDataType(["null"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], undefined), false);

  // The `number` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], num), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], num), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], num), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], num), true);
  assert.deepEqual(Dflow.isValidDataType(["object"], num), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], num), false);

  assert.deepEqual(Dflow.isValidDataType(["number"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], undefined), false);

  // The `object` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], obj), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], obj), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], obj), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], obj), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], obj), true);
  assert.deepEqual(Dflow.isValidDataType(["string"], obj), false);

  assert.deepEqual(Dflow.isValidDataType(["object"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], undefined), false);

  // The `string` type.

  assert.deepEqual(Dflow.isValidDataType(["array"], str), false);
  assert.deepEqual(Dflow.isValidDataType(["boolean"], str), false);
  assert.deepEqual(Dflow.isValidDataType(["null"], str), false);
  assert.deepEqual(Dflow.isValidDataType(["number"], str), false);
  assert.deepEqual(Dflow.isValidDataType(["object"], str), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], str), true);

  assert.deepEqual(Dflow.isValidDataType(["string"], Infinity), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], NaN), false);
  assert.deepEqual(Dflow.isValidDataType(["string"], undefined), false);

  // Multiple types, no particular order here.

  assert.deepEqual(Dflow.isValidDataType(["boolean", "array"], arr), true);
  assert.deepEqual(
    Dflow.isValidDataType(["string", "number", "boolean"], bool),
    true,
  );
  assert.deepEqual(
    Dflow.isValidDataType(["number", "object", "string"], num),
    true,
  );
  assert.deepEqual(Dflow.isValidDataType(["object", "string"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["array", "object"], obj), true);
  assert.deepEqual(Dflow.isValidDataType(["array", "string"], str), true);
  assert.deepEqual(Dflow.isValidDataType(["boolean", "string"], arr), false);
  assert.deepEqual(Dflow.isValidDataType(["number", "array"], bool), false);
  assert.deepEqual(
    Dflow.isValidDataType(["boolean", "object", "string"], num),
    false,
  );
  assert.deepEqual(Dflow.isValidDataType(["object", "string"], null), false);
  assert.deepEqual(Dflow.isValidDataType(["array", "boolean"], obj), false);
  assert.deepEqual(Dflow.isValidDataType(["number", "array"], str), false);
});

test("new Dflow has an empty graph", () => {
  const dflow = new Dflow({});
  assert.deepEqual(dflow.toJSON(), { nodes: [], edges: [] });
});

test("dflow.clear()", () => {
  const { dflow } = sample01();
  dflow.clear();

  const graph = dflow.toJSON();
  assert.deepEqual(graph.nodes.length, 0);
  assert.deepEqual(graph.edges.length, 0);
});

test("dflow.run()", async () => {
  const dflow = new Dflow(nodesCatalog2);
  const catalog = dflow.nodesCatalog;

  // Num#out=2 -> Sum#in1 |
  //                      |-> Sum#out=4
  // Num#out=2 -> Sum#in2 |
  dflow.newNode({
    id: "num",
    kind: catalog.data.kind,
    outputs: [{ id: "out", data: 2 }],
  });
  const sumNode = dflow.newNode({
    id: "sum",
    kind: catalog.Sum.kind,
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out" }],
  });
  dflow.newEdge({
    id: "e1",
    source: ["num", "out"],
    target: ["sum", "in1"],
  });
  dflow.newEdge({
    id: "e2",
    source: ["num", "out"],
    target: ["sum", "in2"],
  });

  // Add also an async node.
  dflow.newNode({ id: "sleep", kind: catalog.Sleep.kind });

  await dflow.run();

  const sum = sumNode.output(0);
  assert.deepEqual(sum.data, 4);
});

test("dflow.newNode()", () => {
  const dflow = new Dflow(nodesCatalog1);
  const catalog = dflow.nodesCatalog;

  // newNode with id
  const nodeId1 = "node1";
  const node1 = dflow.newNode({
    kind: catalog.Identity.kind,
    id: nodeId1,
  });
  assert.deepEqual(node1.id, nodeId1);
  assert.deepEqual(node1.kind, catalog.Identity.kind);

  // newNode with inputs
  const inputId1 = "input1";
  const node2 = dflow.newNode({
    kind: catalog.Identity.kind,
    inputs: [{ id: inputId1 }],
  });
  const node2Obj = node2.toJSON();
  assert.deepEqual(node2Obj.i?.[0]?.id, inputId1);

  // newNode with outputs
  const outputId1 = "output1";
  const node3 = dflow.newNode({
    kind: catalog.Identity.kind,
    outputs: [{ id: outputId1 }],
  });
  const node3Obj = node3.toJSON();
  assert.deepEqual(node3Obj.o?.[0]?.id, outputId1);
});

test("dflow.newEdge()", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.getEdgeById(edgeId1);
  assert.deepEqual(edgeId1, edge1?.id);
});

test("dflow.deleteNode()", () => {
  const { dflow, nodeId1, edgeId1 } = sample01();
  dflow.deleteNode(nodeId1);
  assert.throws(() => {
    dflow.getNodeById(nodeId1);
  }, {
    name: "Error",
    message: DflowErrorItemNotFound.message({item: "node", nId: nodeId1 })
  });
  assert.throws(() => {
    dflow.getEdgeById(edgeId1);
  }, {
    name: "Error",
    message: DflowErrorItemNotFound.message({item: "edge", id: edgeId1 })
  });
  const nodeNotFoundId = "xxx"
  assert.throws(() => {
    dflow.deleteNode(nodeNotFoundId);
  }, {
    name: "Error",
    message: DflowErrorItemNotFound.message({item: "node", nId: nodeNotFoundId })
  });
});

test("dflow.deleteEdge()", () => {
  const { dflow, edgeId1 } = sample01();
  dflow.deleteEdge(edgeId1);
  assert.throws(() => {
    dflow.getEdgeById(edgeId1);
  }, {
    name: "Error",
    message: DflowErrorItemNotFound.message({item: "edge", id: edgeId1 })
  });
  const edgeNotFoundId = "xxx"
  assert.throws(() => {
    dflow.deleteEdge(edgeNotFoundId);
  }, {
    name: "Error",
    message: DflowErrorItemNotFound.message({item: "edge", id: edgeNotFoundId })
  });
});

// DflowOutput
// ////////////////////////////////////////////////////////////////////////////

function testOutputSetData(data: unknown, types: DflowDataType[] = []) {
  const output = new DflowOutput({ id: "test", nodeId: "node", types });
  output.data = data;
  assert.deepEqual(data, output.data);
}

function testOutputSetDataInvalid(data: unknown, types: DflowDataType[]) {
  const output = new DflowOutput({ id: "test", nodeId: "node", types });
  output.data = data;
  assert.deepEqual(typeof output.data, "undefined");
}

test("DflowOutput.clear()", () => {
  const output = new DflowOutput({ id: "test", nodeId: "node", types: [] });
  const data = 1;
  output.data = data;
  assert.deepEqual(data, output.data);
  output.clear();
  assert.deepEqual(undefined, output.data);
});

test("DflowOutput set data", () => {
  const pin = new DflowOutput({ id: "test", nodeId: "node", types: [] });
  assert.deepEqual(pin.id, "test");
  assert.deepEqual(typeof pin.data, "undefined");

  testOutputSetData(str);
  testOutputSetData(num);
  testOutputSetData(bool);
  testOutputSetData(obj);
  testOutputSetData(arr);

  testOutputSetData(str, ["string"]);
  testOutputSetDataInvalid(num, ["string"]);
  testOutputSetDataInvalid(bool, ["string"]);
  testOutputSetDataInvalid(null, ["string"]);
  testOutputSetDataInvalid(obj, ["string"]);
  testOutputSetDataInvalid(arr, ["string"]);

  testOutputSetDataInvalid(str, ["number"]);
  testOutputSetData(num, ["number"]);
  testOutputSetDataInvalid(bool, ["number"]);
  testOutputSetDataInvalid(null, ["number"]);
  testOutputSetDataInvalid(obj, ["number"]);
  testOutputSetDataInvalid(arr, ["number"]);

  testOutputSetDataInvalid(str, ["boolean"]);
  testOutputSetDataInvalid(num, ["boolean"]);
  testOutputSetData(bool, ["boolean"]);
  testOutputSetDataInvalid(null, ["boolean"]);
  testOutputSetDataInvalid(obj, ["boolean"]);
  testOutputSetDataInvalid(arr, ["boolean"]);

  testOutputSetDataInvalid(str, ["object"]);
  testOutputSetDataInvalid(num, ["object"]);
  testOutputSetDataInvalid(bool, ["object"]);
  testOutputSetDataInvalid(null, ["object"]);
  testOutputSetData(obj, ["object"]);
  testOutputSetDataInvalid(arr, ["object"]);

  testOutputSetDataInvalid(str, ["array"]);
  testOutputSetDataInvalid(num, ["array"]);
  testOutputSetDataInvalid(bool, ["array"]);
  testOutputSetDataInvalid(null, ["array"]);
  testOutputSetDataInvalid(obj, ["array"]);
  testOutputSetData(arr, ["array"]);

  testOutputSetData(str, ["string", "number"]);
  testOutputSetData(num, ["string", "number"]);
  testOutputSetDataInvalid(bool, ["string", "number"]);
  testOutputSetDataInvalid(null, ["string", "number"]);
  testOutputSetDataInvalid(obj, ["string", "number"]);
  testOutputSetDataInvalid(arr, ["string", "number"]);

  testOutputSetData(str, ["string", "boolean"]);
  testOutputSetDataInvalid(num, ["string", "boolean"]);
  testOutputSetData(bool, ["string", "boolean"]);
  testOutputSetDataInvalid(null, ["string", "boolean"]);
  testOutputSetDataInvalid(obj, ["string", "boolean"]);
  testOutputSetDataInvalid(arr, ["string", "boolean"]);

  testOutputSetData(str, ["string", "object"]);
  testOutputSetDataInvalid(num, ["string", "object"]);
  testOutputSetDataInvalid(bool, ["string", "object"]);
  testOutputSetDataInvalid(null, ["string", "object"]);
  testOutputSetData(obj, ["string", "object"]);
  testOutputSetDataInvalid(arr, ["string", "object"]);

  testOutputSetData(str, ["string", "array"]);
  testOutputSetDataInvalid(num, ["string", "array"]);
  testOutputSetDataInvalid(bool, ["string", "array"]);
  testOutputSetDataInvalid(null, ["string", "array"]);
  testOutputSetDataInvalid(obj, ["string", "array"]);
  testOutputSetData(arr, ["string", "array"]);

  testOutputSetDataInvalid(str, ["number", "boolean"]);
  testOutputSetData(num, ["number", "boolean"]);
  testOutputSetData(bool, ["number", "boolean"]);
  testOutputSetDataInvalid(null, ["number", "boolean"]);
  testOutputSetDataInvalid(obj, ["number", "boolean"]);
  testOutputSetDataInvalid(arr, ["number", "boolean"]);

  testOutputSetDataInvalid(str, ["number", "object"]);
  testOutputSetData(num, ["number", "object"]);
  testOutputSetDataInvalid(bool, ["number", "object"]);
  testOutputSetDataInvalid(null, ["number", "object"]);
  testOutputSetData(obj, ["number", "object"]);
  testOutputSetDataInvalid(arr, ["number", "object"]);

  testOutputSetDataInvalid(str, ["number", "array"]);
  testOutputSetData(num, ["number", "array"]);
  testOutputSetDataInvalid(bool, ["number", "array"]);
  testOutputSetDataInvalid(null, ["number", "array"]);
  testOutputSetDataInvalid(obj, ["number", "array"]);
  testOutputSetData(arr, ["number", "array"]);

  testOutputSetDataInvalid(str, ["boolean", "object"]);
  testOutputSetDataInvalid(num, ["boolean", "object"]);
  testOutputSetData(bool, ["boolean", "object"]);
  testOutputSetDataInvalid(null, ["boolean", "object"]);
  testOutputSetData(obj, ["boolean", "object"]);
  testOutputSetDataInvalid(arr, ["boolean", "object"]);

  testOutputSetDataInvalid(str, ["boolean", "array"]);
  testOutputSetDataInvalid(num, ["boolean", "array"]);
  testOutputSetData(bool, ["boolean", "array"]);
  testOutputSetDataInvalid(null, ["boolean", "array"]);
  testOutputSetDataInvalid(obj, ["boolean", "array"]);
  testOutputSetData(arr, ["boolean", "array"]);

  testOutputSetDataInvalid(str, ["object", "array"]);
  testOutputSetDataInvalid(num, ["object", "array"]);
  testOutputSetDataInvalid(bool, ["object", "array"]);
  testOutputSetDataInvalid(null, ["object", "array"]);
  testOutputSetData(obj, ["object", "array"]);
  testOutputSetData(arr, ["object", "array"]);
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
      expected: true,
    })),
    // Every source can connect to a target with type "any".
    ...dataTypes.map((dataType) => ({
      sourceTypes: [dataType],
      targetTypes: [],
      expected: true,
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
    { sourceTypes: ["null"], targetTypes: ["string"], expected: false },
  ];

  testCases.forEach(({ sourceTypes, targetTypes, expected }) => {
    assert.deepEqual(Dflow.canConnect(sourceTypes, targetTypes), expected);
  });
});
