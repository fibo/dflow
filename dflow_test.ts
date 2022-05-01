import {
  assertArrayIncludes,
  assertEquals,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";

import {
  DflowData,
  DflowGraph,
  DflowHost,
  DflowNode,
  DflowOutput,
  DflowPinType,
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
  static isAsync = true;

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

Deno.test("DflowData validate()", () => {
  assertEquals(DflowData.validate(arr, ["array"]), true);
  assertEquals(DflowData.validate(bool, ["boolean"]), true);
  assertEquals(DflowData.validate(num, ["number"]), true);
  assertEquals(DflowData.validate(NaN, ["number"]), false);
  assertEquals(DflowData.validate(obj, ["object"]), true);
  assertEquals(DflowData.validate(str, ["string"]), true);

  assertEquals(DflowData.validate(arr, []), true);
  assertEquals(DflowData.validate(bool, []), true);
  assertEquals(DflowData.validate(num, []), true);
  assertEquals(DflowData.validate(NaN, []), true);
  assertEquals(DflowData.validate(null, []), true);
  assertEquals(DflowData.validate(obj, []), true);
  assertEquals(DflowData.validate(str, []), true);
  assertEquals(DflowData.validate(undefined, []), true);

  assertEquals(DflowData.validate(arr, ["boolean"]), false);
  assertEquals(DflowData.validate(arr, ["number"]), false);
  assertEquals(DflowData.validate(arr, ["object"]), false);
  assertEquals(DflowData.validate(arr, ["string"]), false);

  assertEquals(DflowData.validate(bool, ["array"]), false);
  assertEquals(DflowData.validate(bool, ["number"]), false);
  assertEquals(DflowData.validate(bool, ["object"]), false);
  assertEquals(DflowData.validate(bool, ["string"]), false);

  assertEquals(DflowData.validate(null, ["array"]), false);
  assertEquals(DflowData.validate(null, ["boolean"]), false);
  assertEquals(DflowData.validate(null, ["number"]), false);
  assertEquals(DflowData.validate(null, ["object"]), false);
  assertEquals(DflowData.validate(null, ["string"]), false);

  assertEquals(DflowData.validate(num, ["array"]), false);
  assertEquals(DflowData.validate(num, ["boolean"]), false);
  assertEquals(DflowData.validate(num, ["object"]), false);
  assertEquals(DflowData.validate(num, ["string"]), false);

  assertEquals(DflowData.validate(NaN, ["array"]), false);
  assertEquals(DflowData.validate(NaN, ["boolean"]), false);
  assertEquals(DflowData.validate(NaN, ["object"]), false);
  assertEquals(DflowData.validate(NaN, ["string"]), false);

  assertEquals(DflowData.validate(obj, ["array"]), false);
  assertEquals(DflowData.validate(obj, ["boolean"]), false);
  assertEquals(DflowData.validate(obj, ["number"]), false);
  assertEquals(DflowData.validate(obj, ["string"]), false);

  assertEquals(DflowData.validate(str, ["array"]), false);
  assertEquals(DflowData.validate(str, ["boolean"]), false);
  assertEquals(DflowData.validate(str, ["number"]), false);
  assertEquals(DflowData.validate(str, ["object"]), false);

  assertEquals(DflowData.validate(undefined, ["array"]), false);
  assertEquals(DflowData.validate(undefined, ["boolean"]), false);
  assertEquals(DflowData.validate(undefined, ["number"]), false);
  assertEquals(DflowData.validate(undefined, ["object"]), false);
  assertEquals(DflowData.validate(undefined, ["string"]), false);

  // No particular order here.
  assertEquals(DflowData.validate(arr, ["boolean", "array"]), true);
  assertEquals(DflowData.validate(bool, ["string", "number", "boolean"]), true);
  assertEquals(
    DflowData.validate(num, ["number", "object", "string"]),
    true,
  );
  assertEquals(DflowData.validate(null, ["object", "string"]), false);
  assertEquals(DflowData.validate(obj, ["array", "object"]), true);
  assertEquals(DflowData.validate(str, ["array", "string"]), true);
  assertEquals(DflowData.validate(arr, ["boolean", "string"]), false);
  assertEquals(DflowData.validate(bool, ["number", "array"]), false);
  assertEquals(DflowData.validate(num, ["boolean", "object", "string"]), false);
  assertEquals(DflowData.validate(null, ["object", "string"]), false);
  assertEquals(DflowData.validate(obj, ["array", "boolean"]), false);
  assertEquals(DflowData.validate(str, ["number", "array"]), false);
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
  const dflow = new DflowHost();
  assertObjectMatch(dflow.toObject(), { nodes: [], edges: [] });
});

Deno.test("DflowHost clearGraph()", () => {
  const { dflow } = sample01();
  dflow.clearGraph();

  const graph = dflow.toObject();
  assertEquals(graph.nodes.length, 0);
  assertEquals(graph.edges.length, 0);
});

Deno.test("DflowHost runStatusIsSuccess", () => {
  const dflow = new DflowHost();

  dflow.run();

  assertEquals(dflow.runStatusIsSuccess, true);
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
  const nodeId1 = "n1";
  const dflow = new DflowHost({ nodesCatalog: nodesCatalog1 });
  const catalog = dflow.nodesCatalog;
  dflow.newNode({ id: nodeId1, kind: catalog.Identity.kind });

  const node1 = dflow.getNodeById(nodeId1);
  assertEquals(nodeId1, node1.id);
  assertEquals(catalog.Identity.kind, node1.kind);
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
  });
  assertThrows(() => {
    dflow.getEdgeById(edgeId1);
  });
});

Deno.test("DflowHost deleteEdge()", () => {
  const { dflow, edgeId1 } = sample01();
  dflow.deleteEdge(edgeId1);
  assertThrows(() => {
    dflow.getEdgeById(edgeId1);
  });
});

// DflowOutput
// ////////////////////////////////////////////////////////////////////////////

function testOutputSetData(data: unknown, types?: DflowPinType[]) {
  const output = new DflowOutput({ id: "test", types });
  output.data = data;
  assertStrictEquals(data, output.data);
}

function testOutputSetDataThrows(data: unknown, types: DflowPinType[]) {
  assertThrows(
    () => {
      const output = new DflowOutput({ id: "test", types });
      output.data = data;
    },
    Error,
    `could not set data pinTypes=${JSON.stringify(types)}`,
  );
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
  testOutputSetDataThrows(num, ["string"]);
  testOutputSetDataThrows(bool, ["string"]);
  testOutputSetDataThrows(null, ["string"]);
  testOutputSetDataThrows(obj, ["string"]);
  testOutputSetDataThrows(arr, ["string"]);

  testOutputSetDataThrows(str, ["number"]);
  testOutputSetData(num, ["number"]);
  testOutputSetDataThrows(bool, ["number"]);
  testOutputSetDataThrows(null, ["number"]);
  testOutputSetDataThrows(obj, ["number"]);
  testOutputSetDataThrows(arr, ["number"]);

  testOutputSetDataThrows(str, ["boolean"]);
  testOutputSetDataThrows(num, ["boolean"]);
  testOutputSetData(bool, ["boolean"]);
  testOutputSetDataThrows(null, ["boolean"]);
  testOutputSetDataThrows(obj, ["boolean"]);
  testOutputSetDataThrows(arr, ["boolean"]);

  testOutputSetDataThrows(str, ["object"]);
  testOutputSetDataThrows(num, ["object"]);
  testOutputSetDataThrows(bool, ["object"]);
  testOutputSetDataThrows(null, ["object"]);
  testOutputSetData(obj, ["object"]);
  testOutputSetDataThrows(arr, ["object"]);

  testOutputSetDataThrows(str, ["array"]);
  testOutputSetDataThrows(num, ["array"]);
  testOutputSetDataThrows(bool, ["array"]);
  testOutputSetDataThrows(null, ["array"]);
  testOutputSetDataThrows(obj, ["array"]);
  testOutputSetData(arr, ["array"]);

  testOutputSetData(str, ["string", "number"]);
  testOutputSetData(num, ["string", "number"]);
  testOutputSetDataThrows(bool, ["string", "number"]);
  testOutputSetDataThrows(null, ["string", "number"]);
  testOutputSetDataThrows(obj, ["string", "number"]);
  testOutputSetDataThrows(arr, ["string", "number"]);

  testOutputSetData(str, ["string", "boolean"]);
  testOutputSetDataThrows(num, ["string", "boolean"]);
  testOutputSetData(bool, ["string", "boolean"]);
  testOutputSetDataThrows(null, ["string", "boolean"]);
  testOutputSetDataThrows(obj, ["string", "boolean"]);
  testOutputSetDataThrows(arr, ["string", "boolean"]);

  testOutputSetData(str, ["string", "object"]);
  testOutputSetDataThrows(num, ["string", "object"]);
  testOutputSetDataThrows(bool, ["string", "object"]);
  testOutputSetDataThrows(null, ["string", "object"]);
  testOutputSetData(obj, ["string", "object"]);
  testOutputSetDataThrows(arr, ["string", "object"]);

  testOutputSetData(str, ["string", "array"]);
  testOutputSetDataThrows(num, ["string", "array"]);
  testOutputSetDataThrows(bool, ["string", "array"]);
  testOutputSetDataThrows(null, ["string", "array"]);
  testOutputSetDataThrows(obj, ["string", "array"]);
  testOutputSetData(arr, ["string", "array"]);

  testOutputSetDataThrows(str, ["number", "boolean"]);
  testOutputSetData(num, ["number", "boolean"]);
  testOutputSetData(bool, ["number", "boolean"]);
  testOutputSetDataThrows(null, ["number", "boolean"]);
  testOutputSetDataThrows(obj, ["number", "boolean"]);
  testOutputSetDataThrows(arr, ["number", "boolean"]);

  testOutputSetDataThrows(str, ["number", "object"]);
  testOutputSetData(num, ["number", "object"]);
  testOutputSetDataThrows(bool, ["number", "object"]);
  testOutputSetDataThrows(null, ["number", "object"]);
  testOutputSetData(obj, ["number", "object"]);
  testOutputSetDataThrows(arr, ["number", "object"]);

  testOutputSetDataThrows(str, ["number", "array"]);
  testOutputSetData(num, ["number", "array"]);
  testOutputSetDataThrows(bool, ["number", "array"]);
  testOutputSetDataThrows(null, ["number", "array"]);
  testOutputSetDataThrows(obj, ["number", "array"]);
  testOutputSetData(arr, ["number", "array"]);

  testOutputSetDataThrows(str, ["boolean", "object"]);
  testOutputSetDataThrows(num, ["boolean", "object"]);
  testOutputSetData(bool, ["boolean", "object"]);
  testOutputSetDataThrows(null, ["boolean", "object"]);
  testOutputSetData(obj, ["boolean", "object"]);
  testOutputSetDataThrows(arr, ["boolean", "object"]);

  testOutputSetDataThrows(str, ["boolean", "array"]);
  testOutputSetDataThrows(num, ["boolean", "array"]);
  testOutputSetData(bool, ["boolean", "array"]);
  testOutputSetDataThrows(null, ["boolean", "array"]);
  testOutputSetDataThrows(obj, ["boolean", "array"]);
  testOutputSetData(arr, ["boolean", "array"]);

  testOutputSetDataThrows(str, ["object", "array"]);
  testOutputSetDataThrows(num, ["object", "array"]);
  testOutputSetDataThrows(bool, ["object", "array"]);
  testOutputSetDataThrows(null, ["object", "array"]);
  testOutputSetData(obj, ["object", "array"]);
  testOutputSetData(arr, ["object", "array"]);
});
