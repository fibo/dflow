import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { DflowHost, DflowNode, DflowPin } from "./dflow.ts";

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

const nodesCatalog1 = {
  [EmptyNode.kind]: EmptyNode,
};

const nodesCatalog2 = {
  [NumNode.kind]: NumNode,
  [SumNode.kind]: SumNode,
};

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const pinId1 = "p1";
  const pinId2 = "p2";
  const edgeId1 = "e2";
  const dflow = new DflowHost(nodesCatalog1);
  dflow.newNode({ id: nodeId1, kind: EmptyNode.kind });
  dflow.newNode({ id: nodeId2, kind: EmptyNode.kind });
  dflow.newEdge({
    id: edgeId1,
    source: [nodeId1, pinId1],
    target: [nodeId2, pinId2],
  });

  return { dflow, nodeId1, nodeId2, pinId1, pinId2, edgeId1 };
}

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

Deno.test("DflowGraph#clear()", () => {
  const { dflow } = sample01();
  dflow.graph.clear();

  assertEquals(dflow.graph.nodes.size, 0);
  assertEquals(dflow.graph.edges.size, 0);
});

Deno.test("DflowGraph#run()", () => {
  const dflow = new DflowHost(nodesCatalog2);
  dflow.newNode({
    id: "num",
    kind: NumNode.kind,
    outputs: [{ id: "out1", data: 2 }],
  });
  const sumNode = dflow.newNode({
    id: "sum",
    kind: SumNode.kind,
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out1" }],
  });
  dflow.newEdge({
    id: "e1",
    source: ["num", "out1"],
    target: ["sum", "in1"],
  });
  dflow.newEdge({
    id: "e2",
    source: ["num", "out1"],
    target: ["sum", "in2"],
  });

  dflow.graph.run();

  const sum = sumNode.getOutputByPosition(0) as DflowPin;
  assertEquals(sum.getData(), 4);
});
