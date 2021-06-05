import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { DflowHost, DflowNode } from "./dflow.ts";

class MyNode extends DflowNode {
  static kind = "MyNode";
}

const nodesCatalog1 = {
  [MyNode.kind]: MyNode,
};

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const pinId1 = "p1";
  const pinId2 = "p2";
  const edgeId1 = "e2";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: MyNode.kind });
  dflow.newNode({ id: nodeId2, kind: MyNode.kind });
  dflow.newEdge({
    id: edgeId1,
    source: { nodeId: nodeId1, pinId: pinId1 },
    target: { nodeId: nodeId2, pinId: pinId2 },
  });

  return { dflow, nodeId1, nodeId2, pinId1, pinId2, edgeId1 };
}

Deno.test("empty graph", () => {
  const dflow = new DflowHost();
  assertObjectMatch(JSON.parse(dflow.graph.toJSON()), { nodes: [], edges: [] });
});

Deno.test("newNode", () => {
  const nodeId1 = "n1";
  const dflow = new DflowHost(nodesCatalog1);
  dflow.newNode({ id: nodeId1, kind: MyNode.kind });

  const node1 = dflow.graph.nodes.get(nodeId1);
  assertEquals(nodeId1, node1?.id);
  assertEquals(MyNode.kind, node1?.kind);
});

Deno.test("newEdge", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.graph.edges.get(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});

Deno.test("newInput", () => {
  const nodeId1 = "n1";
  const inputId1 = "i1";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: "MyNode" });
  dflow.newInput(nodeId1, { id: inputId1 });

  const node1 = dflow.graph.nodes.get(nodeId1);
  const input1 = node1?.inputs.get(inputId1);
  assertEquals(inputId1, input1?.id);
});

Deno.test("newOutput", () => {
  const nodeId1 = "n1";
  const outputId1 = "i1";
  const dflow = new DflowHost();
  dflow.newNode({ id: nodeId1, kind: "MyNode" });
  dflow.newOutput(nodeId1, { id: outputId1 });

  const node1 = dflow.graph.nodes.get(nodeId1);
  const output1 = node1?.outputs.get(outputId1);
  assertEquals(outputId1, output1?.id);
});

Deno.test("clearGraph", () => {
  const { dflow } = sample01();
  dflow.clearGraph();

  assertEquals(dflow.graph.nodes.size, 0);
  assertEquals(dflow.graph.edges.size, 0);
});
