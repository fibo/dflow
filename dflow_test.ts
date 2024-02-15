import {
  assertArrayIncludes,
  assertEquals,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from "std/assert/mod.ts";

import {
  Dflow,
  DflowDataType,
  DflowErrorItemNotFound,
  DflowNode,
  DflowOutput,
} from "dflow";

const { input, output } = Dflow;

const num = 1;
const bool = true;
const str = "string";
const arr = [num, bool, str];
const obj = { foo: num, bar: str };

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
  const dflow = new Dflow({ nodesCatalog: nodesCatalog1 });
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

Deno.test("Dflow.ancestorsOfNodeId", () => {
  assertArrayIncludes(
    Dflow.ancestorsOfNodeId("n", [
      { sourceId: "n1", targetId: "n" },
    ]),
    ["n1"],
  );

  assertArrayIncludes(
    Dflow.ancestorsOfNodeId("n", [
      { sourceId: "n1", targetId: "n2" },
      { sourceId: "n2", targetId: "n" },
    ]),
    ["n1", "n2"],
  );
});

Deno.test("Dflow.inferDataType()", () => {
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
    assertEquals(Dflow.inferDataType(input).join(), output.join());
  });
});

Deno.test("Dflow.isArray()", () => {
  assertEquals(Dflow.isArray(arr), true);
  assertEquals(Dflow.isArray(bool), false);
  assertEquals(Dflow.isArray(num), false);
  assertEquals(Dflow.isArray(NaN), false);
  assertEquals(Dflow.isArray(null), false);
  assertEquals(Dflow.isArray(obj), false);
  assertEquals(Dflow.isArray(str), false);
  assertEquals(Dflow.isArray(undefined), false);

  // bad array
  assertEquals(Dflow.isArray([1, () => {}]), false);
  // good nested array
  assertEquals(Dflow.isArray([1, [2, 3], [{ foo: 42 }], [true, {}]]), true);
  // bad nested array
  assertEquals(
    Dflow.isArray([1, [2, 3], [{ foo: 42 }], [true, () => {}]]),
    false,
  );
});

Deno.test("Dflow.isNumber()", () => {
  assertEquals(Dflow.isNumber(arr), false);
  assertEquals(Dflow.isNumber(bool), false);
  assertEquals(Dflow.isNumber(num), true);
  assertEquals(Dflow.isNumber(NaN), false);
  assertEquals(Dflow.isNumber(null), false);
  assertEquals(Dflow.isNumber(obj), false);
  assertEquals(Dflow.isNumber(str), false);
  assertEquals(Dflow.isNumber(undefined), false);
  assertEquals(Dflow.isNumber(Infinity), false);
});

Deno.test("Dflow.isObject()", () => {
  assertEquals(Dflow.isObject(arr), false);
  assertEquals(Dflow.isObject(bool), false);
  assertEquals(Dflow.isObject(num), false);
  assertEquals(Dflow.isObject(NaN), false);
  assertEquals(Dflow.isObject(null), false);
  assertEquals(Dflow.isObject(obj), true);
  assertEquals(Dflow.isObject(str), false);
  assertEquals(Dflow.isObject(undefined), false);

  // bad object
  assertEquals(Dflow.isObject({ foo: () => {} }), false);
  // good nested object
  assertEquals(
    Dflow.isObject({ foo: { bar: [{ quz: true }] } }),
    true,
  );
  // bad nested object
  assertEquals(Dflow.isObject({ foo: [1], bar: { quz: () => {} } }), false);
});

Deno.test("Dflow.isValidDataType()", () => {
  // Any type.

  assertEquals(Dflow.isValidDataType([], arr), true);
  assertEquals(Dflow.isValidDataType([], bool), true);
  assertEquals(Dflow.isValidDataType([], num), true);
  assertEquals(Dflow.isValidDataType([], NaN), true);
  assertEquals(Dflow.isValidDataType([], null), true);
  assertEquals(Dflow.isValidDataType([], obj), true);
  assertEquals(Dflow.isValidDataType([], str), true);
  assertEquals(Dflow.isValidDataType([], undefined), true);
  assertEquals(Dflow.isValidDataType([], Infinity), true);

  // The `array` type.

  assertEquals(Dflow.isValidDataType(["array"], arr), true);
  assertEquals(Dflow.isValidDataType(["boolean"], arr), false);
  assertEquals(Dflow.isValidDataType(["null"], arr), false);
  assertEquals(Dflow.isValidDataType(["number"], arr), false);
  assertEquals(Dflow.isValidDataType(["object"], arr), false);
  assertEquals(Dflow.isValidDataType(["string"], arr), false);

  assertEquals(Dflow.isValidDataType(["array"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["array"], NaN), false);
  assertEquals(Dflow.isValidDataType(["array"], undefined), false);

  // The `boolean` type.

  assertEquals(Dflow.isValidDataType(["array"], bool), false);
  assertEquals(Dflow.isValidDataType(["boolean"], bool), true);
  assertEquals(Dflow.isValidDataType(["null"], bool), false);
  assertEquals(Dflow.isValidDataType(["number"], bool), false);
  assertEquals(Dflow.isValidDataType(["object"], bool), false);
  assertEquals(Dflow.isValidDataType(["string"], bool), false);

  assertEquals(Dflow.isValidDataType(["boolean"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["boolean"], NaN), false);
  assertEquals(Dflow.isValidDataType(["boolean"], undefined), false);

  // The `null` type.

  assertEquals(Dflow.isValidDataType(["array"], null), false);
  assertEquals(Dflow.isValidDataType(["boolean"], null), false);
  assertEquals(Dflow.isValidDataType(["null"], null), true);
  assertEquals(Dflow.isValidDataType(["number"], null), false);
  assertEquals(Dflow.isValidDataType(["object"], null), false);
  assertEquals(Dflow.isValidDataType(["string"], null), false);

  assertEquals(Dflow.isValidDataType(["null"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["null"], NaN), false);
  assertEquals(Dflow.isValidDataType(["null"], undefined), false);

  // The `number` type.

  assertEquals(Dflow.isValidDataType(["array"], num), false);
  assertEquals(Dflow.isValidDataType(["boolean"], num), false);
  assertEquals(Dflow.isValidDataType(["null"], num), false);
  assertEquals(Dflow.isValidDataType(["number"], num), true);
  assertEquals(Dflow.isValidDataType(["object"], num), false);
  assertEquals(Dflow.isValidDataType(["string"], num), false);

  assertEquals(Dflow.isValidDataType(["number"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["number"], NaN), false);
  assertEquals(Dflow.isValidDataType(["number"], undefined), false);

  // The `object` type.

  assertEquals(Dflow.isValidDataType(["array"], obj), false);
  assertEquals(Dflow.isValidDataType(["boolean"], obj), false);
  assertEquals(Dflow.isValidDataType(["null"], obj), false);
  assertEquals(Dflow.isValidDataType(["number"], obj), false);
  assertEquals(Dflow.isValidDataType(["object"], obj), true);
  assertEquals(Dflow.isValidDataType(["string"], obj), false);

  assertEquals(Dflow.isValidDataType(["object"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["object"], NaN), false);
  assertEquals(Dflow.isValidDataType(["object"], undefined), false);

  // The `string` type.

  assertEquals(Dflow.isValidDataType(["array"], str), false);
  assertEquals(Dflow.isValidDataType(["boolean"], str), false);
  assertEquals(Dflow.isValidDataType(["null"], str), false);
  assertEquals(Dflow.isValidDataType(["number"], str), false);
  assertEquals(Dflow.isValidDataType(["object"], str), false);
  assertEquals(Dflow.isValidDataType(["string"], str), true);

  assertEquals(Dflow.isValidDataType(["string"], Infinity), false);
  assertEquals(Dflow.isValidDataType(["string"], NaN), false);
  assertEquals(Dflow.isValidDataType(["string"], undefined), false);

  // Multiple types, no particular order here.

  assertEquals(Dflow.isValidDataType(["boolean", "array"], arr), true);
  assertEquals(
    Dflow.isValidDataType(["string", "number", "boolean"], bool),
    true,
  );
  assertEquals(
    Dflow.isValidDataType(["number", "object", "string"], num),
    true,
  );
  assertEquals(Dflow.isValidDataType(["object", "string"], null), false);
  assertEquals(Dflow.isValidDataType(["array", "object"], obj), true);
  assertEquals(Dflow.isValidDataType(["array", "string"], str), true);
  assertEquals(Dflow.isValidDataType(["boolean", "string"], arr), false);
  assertEquals(Dflow.isValidDataType(["number", "array"], bool), false);
  assertEquals(
    Dflow.isValidDataType(["boolean", "object", "string"], num),
    false,
  );
  assertEquals(Dflow.isValidDataType(["object", "string"], null), false);
  assertEquals(Dflow.isValidDataType(["array", "boolean"], obj), false);
  assertEquals(Dflow.isValidDataType(["number", "array"], str), false);
});

Deno.test("new Dflow has an empty graph", () => {
  const dflow = new Dflow({ nodesCatalog: {} });
  assertObjectMatch(dflow.toJSON(), { nodes: [], edges: [] });
});

Deno.test("dflow.clear()", () => {
  const { dflow } = sample01();
  dflow.clear();

  const graph = dflow.toJSON();
  assertEquals(graph.nodes.length, 0);
  assertEquals(graph.edges.length, 0);
});

Deno.test("dflow.run()", async () => {
  const dflow = new Dflow({ nodesCatalog: nodesCatalog2 });
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
  assertEquals(sum.data, 4);
});

Deno.test("dflow.newNode()", () => {
  const dflow = new Dflow({ nodesCatalog: nodesCatalog1 });
  const catalog = dflow.nodesCatalog;

  // newNode with id
  const nodeId1 = "node1";
  const node1 = dflow.newNode({
    kind: catalog.Identity.kind,
    id: nodeId1,
  });
  assertEquals(node1.id, nodeId1);
  assertEquals(node1.kind, catalog.Identity.kind);

  // newNode with inputs
  const inputId1 = "input1";
  const node2 = dflow.newNode({
    kind: catalog.Identity.kind,
    inputs: [{ id: inputId1 }],
  });
  const node2Obj = node2.toJSON();
  assertEquals(node2Obj.i?.[0]?.id, inputId1);

  // newNode with outputs
  const outputId1 = "output1";
  const node3 = dflow.newNode({
    kind: catalog.Identity.kind,
    outputs: [{ id: outputId1 }],
  });
  const node3Obj = node3.toJSON();
  assertEquals(node3Obj.o?.[0]?.id, outputId1);
});

Deno.test("dflow.newEdge()", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.getEdgeById(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});

Deno.test("dflow.deleteNode()", () => {
  const { dflow, nodeId1, edgeId1 } = sample01();
  dflow.deleteNode(nodeId1);
  assertThrows(() => {
    dflow.getNodeById(nodeId1);
  }, DflowErrorItemNotFound);
  assertThrows(() => {
    dflow.getEdgeById(edgeId1);
  }, DflowErrorItemNotFound);
  assertThrows(() => {
    dflow.deleteNode("xxx");
  }, DflowErrorItemNotFound);
});

Deno.test("dflow.deleteEdge()", () => {
  const { dflow, edgeId1 } = sample01();
  dflow.deleteEdge(edgeId1);
  assertThrows(() => {
    dflow.getEdgeById(edgeId1);
  }, DflowErrorItemNotFound);
  assertThrows(() => {
    dflow.deleteEdge("xxx");
  }, DflowErrorItemNotFound);
});

// DflowOutput
// ////////////////////////////////////////////////////////////////////////////

function testOutputSetData(data: unknown, types: DflowDataType[] = []) {
  const output = new DflowOutput({ id: "test", nodeId: "node", types });
  output.data = data;
  assertStrictEquals(data, output.data);
}

function testOutputSetDataInvalid(data: unknown, types: DflowDataType[]) {
  const output = new DflowOutput({ id: "test", nodeId: "node", types });
  output.data = data;
  assertEquals(typeof output.data, "undefined");
}

Deno.test("DflowOutput.clear()", () => {
  const output = new DflowOutput({ id: "test", nodeId: "node", types: [] });
  const data = 1;
  output.data = data;
  assertStrictEquals(data, output.data);
  output.clear();
  assertStrictEquals(undefined, output.data);
});

Deno.test("DflowOutput set data", () => {
  const pin = new DflowOutput({ id: "test", nodeId: "node", types: [] });
  assertEquals(pin.id, "test");
  assertEquals(typeof pin.data, "undefined");

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

Deno.test("Dflow.canConnect()", () => {
  const testCases: {
    sourceTypes: DflowDataType[];
    targetTypes: DflowDataType[];
    expected: boolean;
  }[] = [
    // Every source can connect to a target with same type.
    ...Dflow.dataTypes.map((dataType) => ({
      sourceTypes: [dataType],
      targetTypes: [dataType],
      expected: true,
    })),
    // Every source can connect to a target with type "any".
    ...Dflow.dataTypes.map((dataType) => ({
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
    { sourceTypes: ["array"], targetTypes: ["DflowId"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["boolean"], targetTypes: ["DflowId"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["number"], targetTypes: ["DflowId"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["string"], expected: false },
    { sourceTypes: ["object"], targetTypes: ["DflowId"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["string"], targetTypes: ["DflowId"], expected: false },
    { sourceTypes: ["DflowId"], targetTypes: ["array"], expected: false },
    { sourceTypes: ["DflowId"], targetTypes: ["boolean"], expected: false },
    { sourceTypes: ["DflowId"], targetTypes: ["number"], expected: false },
    { sourceTypes: ["DflowId"], targetTypes: ["object"], expected: false },
    { sourceTypes: ["DflowId"], targetTypes: ["string"], expected: false },
  ];

  testCases.forEach(({ sourceTypes, targetTypes, expected }) => {
    assertEquals(Dflow.canConnect(sourceTypes, targetTypes), expected);
  });
});
