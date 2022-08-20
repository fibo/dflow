import {
  assertArrayIncludes,
  assertEquals,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";

import {
  DflowData,
  DflowDataType,
  DflowErrorItemNotFound,
  DflowGraph,
  DflowHost,
  DflowNode,
  DflowOutput,
  DflowPin,
} from "./dflow.ts";

const { input, output } = DflowNode;

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
  const dflow = new DflowHost({ nodesCatalog: nodesCatalog1 });
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

// DflowData
// ////////////////////////////////////////////////////////////////////////////

Deno.test("DflowData isArray()", () => {
  assertEquals(DflowData.isArray(arr), true);
  assertEquals(DflowData.isArray(bool), false);
  assertEquals(DflowData.isArray(num), false);
  assertEquals(DflowData.isArray(NaN), false);
  assertEquals(DflowData.isArray(null), false);
  assertEquals(DflowData.isArray(obj), false);
  assertEquals(DflowData.isArray(str), false);
  assertEquals(DflowData.isArray(undefined), false);
});

Deno.test("DflowData isBoolean()", () => {
  assertEquals(DflowData.isBoolean(arr), false);
  assertEquals(DflowData.isBoolean(bool), true);
  assertEquals(DflowData.isBoolean(num), false);
  assertEquals(DflowData.isBoolean(NaN), false);
  assertEquals(DflowData.isBoolean(null), false);
  assertEquals(DflowData.isBoolean(obj), false);
  assertEquals(DflowData.isBoolean(str), false);
  assertEquals(DflowData.isBoolean(undefined), false);
});

Deno.test("DflowData isNumber()", () => {
  assertEquals(DflowData.isNumber(arr), false);
  assertEquals(DflowData.isNumber(bool), false);
  assertEquals(DflowData.isNumber(num), true);
  assertEquals(DflowData.isNumber(NaN), false);
  assertEquals(DflowData.isNumber(null), false);
  assertEquals(DflowData.isNumber(obj), false);
  assertEquals(DflowData.isNumber(str), false);
  assertEquals(DflowData.isNumber(undefined), false);
});

Deno.test("DflowData isObject()", () => {
  assertEquals(DflowData.isObject(arr), false);
  assertEquals(DflowData.isObject(bool), false);
  assertEquals(DflowData.isObject(num), false);
  assertEquals(DflowData.isObject(NaN), false);
  assertEquals(DflowData.isObject(null), false);
  assertEquals(DflowData.isObject(obj), true);
  assertEquals(DflowData.isObject(str), false);
  assertEquals(DflowData.isObject(undefined), false);
});

Deno.test("DflowData isString()", () => {
  assertEquals(DflowData.isString(arr), false);
  assertEquals(DflowData.isString(bool), false);
  assertEquals(DflowData.isString(num), false);
  assertEquals(DflowData.isString(NaN), false);
  assertEquals(DflowData.isString(null), false);
  assertEquals(DflowData.isString(obj), false);
  assertEquals(DflowData.isString(str), true);
  assertEquals(DflowData.isString(undefined), false);
});

Deno.test("DflowData isValidDataType()", () => {
  assertEquals(DflowData.isValidDataType(["array"], arr), true);
  assertEquals(DflowData.isValidDataType(["boolean"], bool), true);
  assertEquals(DflowData.isValidDataType(["number"], num), true);
  assertEquals(DflowData.isValidDataType(["number"], NaN), false);
  assertEquals(DflowData.isValidDataType(["object"], obj), true);
  assertEquals(DflowData.isValidDataType(["string"], str), true);

  assertEquals(DflowData.isValidDataType([], arr), true);
  assertEquals(DflowData.isValidDataType([], bool), true);
  assertEquals(DflowData.isValidDataType([], num), true);
  assertEquals(DflowData.isValidDataType([], NaN), true);
  assertEquals(DflowData.isValidDataType([], null), true);
  assertEquals(DflowData.isValidDataType([], obj), true);
  assertEquals(DflowData.isValidDataType([], str), true);
  assertEquals(DflowData.isValidDataType([], undefined), true);

  assertEquals(DflowData.isValidDataType(["boolean"], arr), false);
  assertEquals(DflowData.isValidDataType(["number"], arr), false);
  assertEquals(DflowData.isValidDataType(["object"], arr), false);
  assertEquals(DflowData.isValidDataType(["string"], arr), false);

  assertEquals(DflowData.isValidDataType(["array"], bool), false);
  assertEquals(DflowData.isValidDataType(["number"], bool), false);
  assertEquals(DflowData.isValidDataType(["object"], bool), false);
  assertEquals(DflowData.isValidDataType(["string"], bool), false);

  assertEquals(DflowData.isValidDataType(["array"], null), false);
  assertEquals(DflowData.isValidDataType(["boolean"], null), false);
  assertEquals(DflowData.isValidDataType(["number"], null), false);
  assertEquals(DflowData.isValidDataType(["object"], null), false);
  assertEquals(DflowData.isValidDataType(["string"], null), false);

  assertEquals(DflowData.isValidDataType(["array"], num), false);
  assertEquals(DflowData.isValidDataType(["boolean"], num), false);
  assertEquals(DflowData.isValidDataType(["object"], num), false);
  assertEquals(DflowData.isValidDataType(["string"], num), false);

  assertEquals(DflowData.isValidDataType(["array"], NaN), false);
  assertEquals(DflowData.isValidDataType(["boolean"], NaN), false);
  assertEquals(DflowData.isValidDataType(["object"], NaN), false);
  assertEquals(DflowData.isValidDataType(["string"], NaN), false);

  assertEquals(DflowData.isValidDataType(["array"], obj), false);
  assertEquals(DflowData.isValidDataType(["boolean"], obj), false);
  assertEquals(DflowData.isValidDataType(["number"], obj), false);
  assertEquals(DflowData.isValidDataType(["string"], obj), false);

  assertEquals(DflowData.isValidDataType(["array"], str), false);
  assertEquals(DflowData.isValidDataType(["boolean"], str), false);
  assertEquals(DflowData.isValidDataType(["number"], str), false);
  assertEquals(DflowData.isValidDataType(["object"], str), false);

  assertEquals(DflowData.isValidDataType(["array"], undefined), false);
  assertEquals(DflowData.isValidDataType(["boolean"], undefined), false);
  assertEquals(DflowData.isValidDataType(["number"], undefined), false);
  assertEquals(DflowData.isValidDataType(["object"], undefined), false);
  assertEquals(DflowData.isValidDataType(["string"], undefined), false);

  // No particular order here.
  assertEquals(DflowData.isValidDataType(["boolean", "array"], arr), true);
  assertEquals(
    DflowData.isValidDataType(["string", "number", "boolean"], bool),
    true,
  );
  assertEquals(
    DflowData.isValidDataType(["number", "object", "string"], num),
    true,
  );
  assertEquals(DflowData.isValidDataType(["object", "string"], null), false);
  assertEquals(DflowData.isValidDataType(["array", "object"], obj), true);
  assertEquals(DflowData.isValidDataType(["array", "string"], str), true);
  assertEquals(DflowData.isValidDataType(["boolean", "string"], arr), false);
  assertEquals(DflowData.isValidDataType(["number", "array"], bool), false);
  assertEquals(
    DflowData.isValidDataType(["boolean", "object", "string"], num),
    false,
  );
  assertEquals(DflowData.isValidDataType(["object", "string"], null), false);
  assertEquals(DflowData.isValidDataType(["array", "boolean"], obj), false);
  assertEquals(DflowData.isValidDataType(["number", "array"], str), false);
});

// DflowGraph
// ////////////////////////////////////////////////////////////////////////////

Deno.test("DflowGraph ancestorsOfNodeId", () => {
  assertArrayIncludes(
    DflowGraph.ancestorsOfNodeId("n", [
      { sourceId: "n1", targetId: "n" },
    ]),
    ["n1"],
  );

  assertArrayIncludes(
    DflowGraph.ancestorsOfNodeId("n", [
      { sourceId: "n1", targetId: "n2" },
      { sourceId: "n2", targetId: "n" },
    ]),
    ["n1", "n2"],
  );
});

// DflowHost
// ////////////////////////////////////////////////////////////////////////////

Deno.test("new DflowHost has an empty graph", () => {
  const dflow = new DflowHost({ nodesCatalog: {} });
  assertObjectMatch(dflow.toObject(), { nodes: [], edges: [] });
});

Deno.test("DflowHost clearGraph()", () => {
  const { dflow } = sample01();
  dflow.clearGraph();

  const graph = dflow.toObject();
  assertEquals(graph.nodes.length, 0);
  assertEquals(graph.edges.length, 0);
});

Deno.test("DflowHost with empty graph executes with runStatus success", () => {
  const dflow = new DflowHost({ nodesCatalog: {} });
  dflow.run();
  assertEquals(dflow.runStatus, "success");
});

Deno.test("DflowHost run()", async () => {
  const dflow = new DflowHost({ nodesCatalog: nodesCatalog2 });
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

Deno.test("DflowHost newNode()", () => {
  const dflow = new DflowHost({ nodesCatalog: nodesCatalog1 });
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
  const node2Obj = node2.toObject();
  assertEquals(node2Obj.inputs?.[0]?.id, inputId1);

  // newNode with outputs
  const outputId1 = "output1";
  const node3 = dflow.newNode({
    kind: catalog.Identity.kind,
    outputs: [{ id: outputId1 }],
  });
  const node3Obj = node3.toObject();
  assertEquals(node3Obj.outputs?.[0]?.id, outputId1);
});

Deno.test("DflowHost newEdge()", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.getEdgeById(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});

Deno.test("DflowHost deleteNode()", () => {
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

Deno.test("DflowHost deleteEdge()", () => {
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

function testOutputSetData(data: unknown, types?: DflowDataType[]) {
  const output = new DflowOutput({ id: "test", types });
  output.data = data;
  assertStrictEquals(data, output.data);
}

function testOutputSetDataInvalid(data: unknown, types: DflowDataType[]) {
  const output = new DflowOutput({ id: "test", types });
  output.data = data;
  assertEquals(typeof output.data, "undefined");
}

Deno.test("DflowOutput.clear()", () => {
  const output = new DflowOutput({ id: "test" });
  const data = 1;
  output.data = data;
  assertStrictEquals(data, output.data);
  output.clear();
  assertStrictEquals(undefined, output.data);
});

Deno.test("DflowOutput set data", () => {
  const pin = new DflowOutput({ id: "test" });
  assertEquals(pin.id, "test");
  assertEquals(typeof pin.data, "undefined");

  testOutputSetData(str);
  testOutputSetData(num);
  testOutputSetData(bool);
  testOutputSetData(null);
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

// DflowPin
// ////////////////////////////////////////////////////////////////////////////

Deno.test("DflowPin.canConnect()", () => {
  const testCases: {
    sourceTypes: DflowDataType[];
    targetTypes: DflowDataType[];
    expected: boolean;
  }[] = [
    // Every source can connect to a target with same type.
    ...DflowData.types.map((dataType) => ({
      sourceTypes: [dataType],
      targetTypes: [dataType],
      expected: true,
    })),
    // Every source can connect to a target with type "any".
    ...DflowData.types.map((dataType) => ({
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
    assertEquals(DflowPin.canConnect(sourceTypes, targetTypes), expected);
  });
});
