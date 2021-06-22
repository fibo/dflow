import {
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
  DflowSerializedNode,
  DflowValue,
} from "./engine.ts";

const num = 1;
const bool = true;
const str = "string";
const arr = [num, bool, str];
const obj = { foo: num, bar: str };

class EmptyNode extends DflowNode {
  static kind = "Empty";

  run() {}
}

class NumNode extends EmptyNode {
  static kind = "Num";
}

class SumNode extends DflowNode {
  static kind = "Sum";

  run() {
    let sum = 0;

    for (const input of this.inputs) {
      const inputData = input.data;
      if (typeof inputData === "number") {
        sum += inputData;
      }
    }

    const output = this.getOutputByPosition(0);
    output.data = sum;
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

  constructor(arg: DflowSerializedNode) {
    super(arg, { isAsync: SleepNode.isAsync });
  }

  async run() {
    console.log("sleep node start");
    await sleep();
    console.log("sleep node end");
  }
}

const nodesCatalog1 = {
  [EmptyNode.kind]: EmptyNode,
};

const nodesCatalog2 = {
  [NumNode.kind]: NumNode,
  [SumNode.kind]: SumNode,
  [SleepNode.kind]: SleepNode,
};

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const pinId1 = "p1";
  const pinId2 = "p2";
  const edgeId1 = "e2";
  const dflow = new DflowHost(nodesCatalog1);
  dflow.newNode({
    id: nodeId1,
    name: "Hello world",
    kind: EmptyNode.kind,
    outputs: [{ id: pinId1 }],
  });
  dflow.newNode({
    id: nodeId2,
    kind: EmptyNode.kind,
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

Deno.test("DflowData.isArray()", () => {
  assertEquals(DflowData.isArray(arr), true);
  assertEquals(DflowData.isArray(bool), false);
  assertEquals(DflowData.isArray(num), false);
  assertEquals(DflowData.isArray(null), false);
  assertEquals(DflowData.isArray(obj), false);
  assertEquals(DflowData.isArray(str), false);
  assertEquals(DflowData.isArray(undefined), false);
});

Deno.test("DflowData.isBoolean()", () => {
  assertEquals(DflowData.isBoolean(arr), false);
  assertEquals(DflowData.isBoolean(bool), true);
  assertEquals(DflowData.isBoolean(num), false);
  assertEquals(DflowData.isBoolean(null), false);
  assertEquals(DflowData.isBoolean(obj), false);
  assertEquals(DflowData.isBoolean(str), false);
  assertEquals(DflowData.isBoolean(undefined), false);
});

Deno.test("DflowData.isNull()", () => {
  assertEquals(DflowData.isNull(arr), false);
  assertEquals(DflowData.isNull(bool), false);
  assertEquals(DflowData.isNull(num), false);
  assertEquals(DflowData.isNull(null), true);
  assertEquals(DflowData.isNull(obj), false);
  assertEquals(DflowData.isNull(str), false);
  assertEquals(DflowData.isNull(undefined), false);
});

Deno.test("DflowData.isNumber()", () => {
  assertEquals(DflowData.isNumber(arr), false);
  assertEquals(DflowData.isNumber(bool), false);
  assertEquals(DflowData.isNumber(num), true);
  assertEquals(DflowData.isNumber(null), false);
  assertEquals(DflowData.isNumber(obj), false);
  assertEquals(DflowData.isNumber(str), false);
  assertEquals(DflowData.isNumber(undefined), false);
});

Deno.test("DflowData.isObject()", () => {
  assertEquals(DflowData.isObject(arr), false);
  assertEquals(DflowData.isObject(bool), false);
  assertEquals(DflowData.isObject(num), false);
  assertEquals(DflowData.isObject(null), false);
  assertEquals(DflowData.isObject(obj), true);
  assertEquals(DflowData.isObject(str), false);
  assertEquals(DflowData.isObject(undefined), false);
});

Deno.test("DflowData.isString()", () => {
  assertEquals(DflowData.isString(arr), false);
  assertEquals(DflowData.isString(bool), false);
  assertEquals(DflowData.isString(num), false);
  assertEquals(DflowData.isString(null), false);
  assertEquals(DflowData.isString(obj), false);
  assertEquals(DflowData.isString(str), true);
  assertEquals(DflowData.isString(undefined), false);
});

Deno.test("DflowData.isUndefined()", () => {
  assertEquals(DflowData.isUndefined(arr), false);
  assertEquals(DflowData.isUndefined(bool), false);
  assertEquals(DflowData.isUndefined(num), false);
  assertEquals(DflowData.isUndefined(null), false);
  assertEquals(DflowData.isUndefined(obj), false);
  assertEquals(DflowData.isUndefined(str), false);
  assertEquals(DflowData.isUndefined(undefined), true);
});

Deno.test("DflowData.validate()", () => {
  assertEquals(DflowData.validate(arr, ["array"]), true);
  assertEquals(DflowData.validate(bool, ["boolean"]), true);
  assertEquals(DflowData.validate(num, ["number"]), true);
  assertEquals(DflowData.validate(null, ["null"]), true);
  assertEquals(DflowData.validate(obj, ["object"]), true);
  assertEquals(DflowData.validate(str, ["string"]), true);

  assertEquals(DflowData.validate(arr, []), true);
  assertEquals(DflowData.validate(bool, []), true);
  assertEquals(DflowData.validate(num, []), true);
  assertEquals(DflowData.validate(null, []), true);
  assertEquals(DflowData.validate(obj, []), true);
  assertEquals(DflowData.validate(str, []), true);
  assertEquals(DflowData.validate(undefined, []), true);

  assertEquals(DflowData.validate(arr, ["boolean"]), false);
  assertEquals(DflowData.validate(arr, ["number"]), false);
  assertEquals(DflowData.validate(arr, ["null"]), false);
  assertEquals(DflowData.validate(arr, ["object"]), false);
  assertEquals(DflowData.validate(arr, ["string"]), false);

  assertEquals(DflowData.validate(bool, ["array"]), false);
  assertEquals(DflowData.validate(bool, ["number"]), false);
  assertEquals(DflowData.validate(bool, ["null"]), false);
  assertEquals(DflowData.validate(bool, ["object"]), false);
  assertEquals(DflowData.validate(bool, ["string"]), false);

  assertEquals(DflowData.validate(null, ["array"]), false);
  assertEquals(DflowData.validate(null, ["boolean"]), false);
  assertEquals(DflowData.validate(null, ["number"]), false);
  assertEquals(DflowData.validate(null, ["object"]), false);
  assertEquals(DflowData.validate(null, ["string"]), false);

  assertEquals(DflowData.validate(num, ["array"]), false);
  assertEquals(DflowData.validate(num, ["boolean"]), false);
  assertEquals(DflowData.validate(num, ["null"]), false);
  assertEquals(DflowData.validate(num, ["object"]), false);
  assertEquals(DflowData.validate(num, ["string"]), false);

  assertEquals(DflowData.validate(obj, ["array"]), false);
  assertEquals(DflowData.validate(obj, ["boolean"]), false);
  assertEquals(DflowData.validate(obj, ["number"]), false);
  assertEquals(DflowData.validate(obj, ["null"]), false);
  assertEquals(DflowData.validate(obj, ["string"]), false);

  assertEquals(DflowData.validate(str, ["array"]), false);
  assertEquals(DflowData.validate(str, ["boolean"]), false);
  assertEquals(DflowData.validate(str, ["number"]), false);
  assertEquals(DflowData.validate(str, ["null"]), false);
  assertEquals(DflowData.validate(str, ["object"]), false);

  assertEquals(DflowData.validate(undefined, ["array"]), false);
  assertEquals(DflowData.validate(undefined, ["boolean"]), false);
  assertEquals(DflowData.validate(undefined, ["number"]), false);
  assertEquals(DflowData.validate(undefined, ["null"]), false);
  assertEquals(DflowData.validate(undefined, ["object"]), false);
  assertEquals(DflowData.validate(undefined, ["string"]), false);

  // No particular order her.
  assertEquals(DflowData.validate(arr, ["boolean", "array"]), true);
  assertEquals(DflowData.validate(bool, ["null", "number", "boolean"]), true);
  assertEquals(
    DflowData.validate(num, ["null", "number", "object", "string"]),
    true,
  );
  assertEquals(DflowData.validate(null, ["object", "null"]), true);
  assertEquals(DflowData.validate(obj, ["array", "object"]), true);
  assertEquals(DflowData.validate(str, ["null", "string"]), true);
  assertEquals(DflowData.validate(arr, ["boolean", "string"]), false);
  assertEquals(DflowData.validate(bool, ["null", "number", "array"]), false);
  assertEquals(DflowData.validate(num, ["null", "object", "string"]), false);
  assertEquals(DflowData.validate(null, ["object", "string"]), false);
  assertEquals(DflowData.validate(obj, ["array", "null"]), false);
  assertEquals(DflowData.validate(str, ["null", "array"]), false);
});

// DflowGraph
// ////////////////////////////////////////////////////////////////////////////

Deno.test("DflowGraph.isDflowGraph", () => {
  [{ id: "g1", nodes: [], edges: [] }].forEach((graph) => {
    assertEquals(DflowGraph.isDflowGraph(graph), true);
  });
});

Deno.test("DflowGraph#clear()", () => {
  const { dflow } = sample01();
  dflow.graph.clear();

  assertEquals(dflow.graph.nodes.size, 0);
  assertEquals(dflow.graph.edges.size, 0);
});

Deno.test("DflowGraph#runStatusIsSuccess", () => {
  const dflow = new DflowHost();
  assertEquals(dflow.graph.runStatusIsSuccess, true);

  dflow.newNode({ id: "n1", kind: "EmptyNode" });
  dflow.run();

  assertEquals(dflow.graph.runStatusIsSuccess, true);
});

Deno.test("DflowGraph#run()", async () => {
  const dflow = new DflowHost(nodesCatalog2);

  // Num#out=2 -> Sum#in1 |
  //                      |-> Sum#out=4
  // Num#out=2 -> Sum#in2 |
  dflow.newNode({
    id: "num",
    kind: NumNode.kind,
    outputs: [{ id: "out", data: 2 }],
  });
  const sumNode = dflow.newNode({
    id: "sum",
    kind: SumNode.kind,
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
  dflow.newNode({ id: "sleep", kind: SleepNode.kind });

  await dflow.run();

  const sum = sumNode.getOutputByPosition(0);
  assertEquals(sum.data, 4);
});

// DflowHost
// ////////////////////////////////////////////////////////////////////////////

Deno.test("new DflowHost has an empty graph", () => {
  const dflow = new DflowHost();
  assertObjectMatch(JSON.parse(dflow.graph.toJSON()), { nodes: [], edges: [] });
});

Deno.test("DflowHost#newNode()", () => {
  const nodeId1 = "n1";
  const dflow = new DflowHost(nodesCatalog1);
  dflow.newNode({ id: nodeId1, kind: EmptyNode.kind });

  const node1 = dflow.graph.nodes.get(nodeId1);
  assertEquals(nodeId1, node1?.id);
  assertEquals(EmptyNode.kind, node1?.kind);
});

Deno.test("DflowHost#newEdge()", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.graph.edges.get(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});

Deno.test("DflowHost#deleteNode()", () => {
  const { dflow, nodeId1, edgeId1 } = sample01();
  dflow.deleteNode(nodeId1);
  assertEquals(dflow.graph.nodes.has(nodeId1), false);
  assertEquals(dflow.graph.edges.has(edgeId1), false);
});

Deno.test("DflowHost#deleteEdge()", () => {
  const { dflow, edgeId1 } = sample01();
  dflow.deleteEdge(edgeId1);
  assertEquals(dflow.graph.edges.has(edgeId1), false);
});

Deno.test("DflowHost#newInput()", () => {
  const nodeId1 = "n1";
  const inputId1 = "i1";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: "EmptyNode" });
  const input1 = dflow.newInput(nodeId1, { id: inputId1 });
  assertEquals(inputId1, input1.id);
});

Deno.test("DflowHost#newOutput()", () => {
  const nodeId1 = "n1";
  const outputId1 = "i1";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: "EmptyNode" });
  const output1 = dflow.newOutput(nodeId1, { id: outputId1 });
  assertEquals(outputId1, output1.id);
});

// DflowOutput
// ////////////////////////////////////////////////////////////////////////////

function testOutputSetData(data: DflowValue, types?: DflowPinType[]) {
  const output = new DflowOutput({ id: "test", types });
  output.data = data;
  assertStrictEquals(data, output.data);
}

function testOutputSetDataThrows(data: DflowValue, types: DflowPinType[]) {
  assertThrows(
    () => {
      const output = new DflowOutput({ id: "test", types });
      output.data = data;
    },
    Error,
    `could not set data pinTypes=${JSON.stringify(types)}`,
  );
}

Deno.test("DflowOutput#clear()", () => {
  const output = new DflowOutput({ id: "test" });
  const data = 1;
  output.data = data;
  assertStrictEquals(data, output.data);
  output.clear();
  assertStrictEquals(undefined, output.data);
});

Deno.test("DflowOutput#set data", () => {
  const pin = new DflowOutput({ id: "test" });
  assertEquals(pin.id, "test");
  assertEquals(pin.kind, "output");
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

  testOutputSetDataThrows(str, ["null"]);
  testOutputSetDataThrows(num, ["null"]);
  testOutputSetDataThrows(bool, ["null"]);
  testOutputSetData(null, ["null"]);
  testOutputSetDataThrows(obj, ["null"]);
  testOutputSetDataThrows(arr, ["null"]);

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

  testOutputSetData(str, ["string", "null"]);
  testOutputSetDataThrows(num, ["string", "null"]);
  testOutputSetDataThrows(bool, ["string", "null"]);
  testOutputSetData(null, ["string", "null"]);
  testOutputSetDataThrows(obj, ["string", "null"]);
  testOutputSetDataThrows(arr, ["string", "null"]);

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

  testOutputSetDataThrows(str, ["number", "null"]);
  testOutputSetData(num, ["number", "null"]);
  testOutputSetDataThrows(bool, ["number", "null"]);
  testOutputSetData(null, ["number", "null"]);
  testOutputSetDataThrows(obj, ["number", "null"]);
  testOutputSetDataThrows(arr, ["number", "null"]);

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

  testOutputSetDataThrows(str, ["boolean", "null"]);
  testOutputSetDataThrows(num, ["boolean", "null"]);
  testOutputSetData(bool, ["boolean", "null"]);
  testOutputSetData(null, ["boolean", "null"]);
  testOutputSetDataThrows(obj, ["boolean", "null"]);
  testOutputSetDataThrows(arr, ["boolean", "null"]);

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

  testOutputSetDataThrows(str, ["null", "object"]);
  testOutputSetDataThrows(num, ["null", "object"]);
  testOutputSetDataThrows(bool, ["null", "object"]);
  testOutputSetData(null, ["null", "object"]);
  testOutputSetData(obj, ["null", "object"]);
  testOutputSetDataThrows(arr, ["null", "object"]);

  testOutputSetDataThrows(str, ["null", "array"]);
  testOutputSetDataThrows(num, ["null", "array"]);
  testOutputSetDataThrows(bool, ["null", "array"]);
  testOutputSetData(null, ["null", "array"]);
  testOutputSetDataThrows(obj, ["null", "array"]);
  testOutputSetData(arr, ["null", "array"]);

  testOutputSetDataThrows(str, ["object", "array"]);
  testOutputSetDataThrows(num, ["object", "array"]);
  testOutputSetDataThrows(bool, ["object", "array"]);
  testOutputSetDataThrows(null, ["object", "array"]);
  testOutputSetData(obj, ["object", "array"]);
  testOutputSetData(arr, ["object", "array"]);
});
