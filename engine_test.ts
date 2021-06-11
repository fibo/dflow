import {
  assertEquals,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";

import {
  DflowHost,
  DflowNode,
  DflowPin,
  DflowPinData,
  DflowPinType,
  DflowSerializedNode,
} from "./dflow.ts";

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

    for (const input of this.inputs.values()) {
      const inputData = input.getData();
      if (typeof inputData === "number") {
        sum += inputData;
      }
    }

    const output = this.getOutputByPosition(0);
    if (output !== null) {
      output.setData(sum);
    }
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
    super(arg, SleepNode.isAsync);
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

// DflowGraph
// ////////////////////////////////////////////////////////////////////////////

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
  dflow.graph.run();

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

  await dflow.graph.run();

  const sum = sumNode.getOutputByPosition(0) as DflowPin;
  assertEquals(sum.getData(), 4);
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
  dflow.newInput(nodeId1, { id: inputId1 });

  const node1 = dflow.graph.nodes.get(nodeId1);
  const input1 = node1?.inputs.get(inputId1);
  assertEquals(inputId1, input1?.id);
});

Deno.test("DflowHost#newOutput()", () => {
  const nodeId1 = "n1";
  const outputId1 = "i1";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: "EmptyNode" });
  dflow.newOutput(nodeId1, { id: outputId1 });

  const node1 = dflow.graph.nodes.get(nodeId1);
  const output1 = node1?.outputs.get(outputId1);
  assertEquals(outputId1, output1?.id);
});

// DflowPin
// ////////////////////////////////////////////////////////////////////////////

function testPinSetData(data: DflowPinData, types?: DflowPinType[]) {
  const pin = new DflowPin("output", { id: "test", types });
  pin.setData(data);
  assertStrictEquals(data, pin.getData());
}

function testPinSetDataThrows(data: DflowPinData, types: DflowPinType[]) {
  const kind = "output";

  assertThrows(
    () => {
      const pin = new DflowPin(kind, { id: "test", types });
      pin.setData(data);
    },
    Error,
    `could not set data pinKind=${kind} pinTypes=${JSON.stringify(types)}`,
  );
}

Deno.test("DflowPin#setData()", () => {
  const num = 1;
  const bool = true;
  const str = "string";
  const arr = [num, bool, str];
  const obj = { foo: num, bar: str };

  const pin = new DflowPin("output", { id: "test" });
  assertEquals(pin.id, "test");
  assertEquals(pin.kind, "output");
  assertEquals(typeof pin.getData(), "undefined");

  testPinSetData(str);
  testPinSetData(num);
  testPinSetData(bool);
  testPinSetData(null);
  testPinSetData(obj);
  testPinSetData(arr);

  testPinSetData(str, ["string"]);
  testPinSetDataThrows(num, ["string"]);
  testPinSetDataThrows(bool, ["string"]);
  testPinSetDataThrows(null, ["string"]);
  testPinSetDataThrows(obj, ["string"]);
  testPinSetDataThrows(arr, ["string"]);

  testPinSetDataThrows(str, ["number"]);
  testPinSetData(num, ["number"]);
  testPinSetDataThrows(bool, ["number"]);
  testPinSetDataThrows(null, ["number"]);
  testPinSetDataThrows(obj, ["number"]);
  testPinSetDataThrows(arr, ["number"]);

  testPinSetDataThrows(str, ["boolean"]);
  testPinSetDataThrows(num, ["boolean"]);
  testPinSetData(bool, ["boolean"]);
  testPinSetDataThrows(null, ["boolean"]);
  testPinSetDataThrows(obj, ["boolean"]);
  testPinSetDataThrows(arr, ["boolean"]);

  testPinSetDataThrows(str, ["null"]);
  testPinSetDataThrows(num, ["null"]);
  testPinSetDataThrows(bool, ["null"]);
  testPinSetData(null, ["null"]);
  testPinSetDataThrows(obj, ["null"]);
  testPinSetDataThrows(arr, ["null"]);

  testPinSetDataThrows(str, ["object"]);
  testPinSetDataThrows(num, ["object"]);
  testPinSetDataThrows(bool, ["object"]);
  testPinSetDataThrows(null, ["object"]);
  testPinSetData(obj, ["object"]);
  testPinSetDataThrows(arr, ["object"]);

  testPinSetDataThrows(str, ["array"]);
  testPinSetDataThrows(num, ["array"]);
  testPinSetDataThrows(bool, ["array"]);
  testPinSetDataThrows(null, ["array"]);
  testPinSetDataThrows(obj, ["array"]);
  testPinSetData(arr, ["array"]);

  testPinSetData(str, ["string", "number"]);
  testPinSetData(num, ["string", "number"]);
  testPinSetDataThrows(bool, ["string", "number"]);
  testPinSetDataThrows(null, ["string", "number"]);
  testPinSetDataThrows(obj, ["string", "number"]);
  testPinSetDataThrows(arr, ["string", "number"]);

  testPinSetData(str, ["string", "boolean"]);
  testPinSetDataThrows(num, ["string", "boolean"]);
  testPinSetData(bool, ["string", "boolean"]);
  testPinSetDataThrows(null, ["string", "boolean"]);
  testPinSetDataThrows(obj, ["string", "boolean"]);
  testPinSetDataThrows(arr, ["string", "boolean"]);

  testPinSetData(str, ["string", "null"]);
  testPinSetDataThrows(num, ["string", "null"]);
  testPinSetDataThrows(bool, ["string", "null"]);
  testPinSetData(null, ["string", "null"]);
  testPinSetDataThrows(obj, ["string", "null"]);
  testPinSetDataThrows(arr, ["string", "null"]);

  testPinSetData(str, ["string", "object"]);
  testPinSetDataThrows(num, ["string", "object"]);
  testPinSetDataThrows(bool, ["string", "object"]);
  testPinSetDataThrows(null, ["string", "object"]);
  testPinSetData(obj, ["string", "object"]);
  testPinSetDataThrows(arr, ["string", "object"]);

  testPinSetData(str, ["string", "array"]);
  testPinSetDataThrows(num, ["string", "array"]);
  testPinSetDataThrows(bool, ["string", "array"]);
  testPinSetDataThrows(null, ["string", "array"]);
  testPinSetDataThrows(obj, ["string", "array"]);
  testPinSetData(arr, ["string", "array"]);

  testPinSetDataThrows(str, ["number", "boolean"]);
  testPinSetData(num, ["number", "boolean"]);
  testPinSetData(bool, ["number", "boolean"]);
  testPinSetDataThrows(null, ["number", "boolean"]);
  testPinSetDataThrows(obj, ["number", "boolean"]);
  testPinSetDataThrows(arr, ["number", "boolean"]);

  testPinSetDataThrows(str, ["number", "null"]);
  testPinSetData(num, ["number", "null"]);
  testPinSetDataThrows(bool, ["number", "null"]);
  testPinSetData(null, ["number", "null"]);
  testPinSetDataThrows(obj, ["number", "null"]);
  testPinSetDataThrows(arr, ["number", "null"]);

  testPinSetDataThrows(str, ["number", "object"]);
  testPinSetData(num, ["number", "object"]);
  testPinSetDataThrows(bool, ["number", "object"]);
  testPinSetDataThrows(null, ["number", "object"]);
  testPinSetData(obj, ["number", "object"]);
  testPinSetDataThrows(arr, ["number", "object"]);

  testPinSetDataThrows(str, ["number", "array"]);
  testPinSetData(num, ["number", "array"]);
  testPinSetDataThrows(bool, ["number", "array"]);
  testPinSetDataThrows(null, ["number", "array"]);
  testPinSetDataThrows(obj, ["number", "array"]);
  testPinSetData(arr, ["number", "array"]);

  testPinSetDataThrows(str, ["boolean", "null"]);
  testPinSetDataThrows(num, ["boolean", "null"]);
  testPinSetData(bool, ["boolean", "null"]);
  testPinSetData(null, ["boolean", "null"]);
  testPinSetDataThrows(obj, ["boolean", "null"]);
  testPinSetDataThrows(arr, ["boolean", "null"]);

  testPinSetDataThrows(str, ["boolean", "object"]);
  testPinSetDataThrows(num, ["boolean", "object"]);
  testPinSetData(bool, ["boolean", "object"]);
  testPinSetDataThrows(null, ["boolean", "object"]);
  testPinSetData(obj, ["boolean", "object"]);
  testPinSetDataThrows(arr, ["boolean", "object"]);

  testPinSetDataThrows(str, ["boolean", "array"]);
  testPinSetDataThrows(num, ["boolean", "array"]);
  testPinSetData(bool, ["boolean", "array"]);
  testPinSetDataThrows(null, ["boolean", "array"]);
  testPinSetDataThrows(obj, ["boolean", "array"]);
  testPinSetData(arr, ["boolean", "array"]);

  testPinSetDataThrows(str, ["null", "object"]);
  testPinSetDataThrows(num, ["null", "object"]);
  testPinSetDataThrows(bool, ["null", "object"]);
  testPinSetData(null, ["null", "object"]);
  testPinSetData(obj, ["null", "object"]);
  testPinSetDataThrows(arr, ["null", "object"]);

  testPinSetDataThrows(str, ["null", "array"]);
  testPinSetDataThrows(num, ["null", "array"]);
  testPinSetDataThrows(bool, ["null", "array"]);
  testPinSetData(null, ["null", "array"]);
  testPinSetDataThrows(obj, ["null", "array"]);
  testPinSetData(arr, ["null", "array"]);

  testPinSetDataThrows(str, ["object", "array"]);
  testPinSetDataThrows(num, ["object", "array"]);
  testPinSetDataThrows(bool, ["object", "array"]);
  testPinSetDataThrows(null, ["object", "array"]);
  testPinSetData(obj, ["object", "array"]);
  testPinSetData(arr, ["object", "array"]);
});
