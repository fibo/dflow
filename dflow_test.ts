import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { DflowHost } from "./dflow.ts";

function sample01() {
  const nodeId1 = "n1";
  const nodeId2 = "n2";
  const pinId1 = "p1";
  const pinId2 = "p2";
  const edgeId1 = "e2";
  const dflow = new DflowHost();
  dflow.addNode({ id: nodeId1, kind: "MyNode" });
  dflow.addNode({ id: nodeId2, kind: "MyNode" });
  dflow.addEdge({
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

Deno.test("addNode", () => {
  const nodeId1 = "n1";
  const dflow = new DflowHost();
  dflow.addNode({ id: nodeId1, kind: "MyNode" });

  const node1 = dflow.graph.nodes.get(nodeId1);
  assertEquals(nodeId1, node1?.id);
});

Deno.test("addEdge", () => {
  const { dflow, edgeId1 } = sample01();

  const edge1 = dflow.graph.edges.get(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});

Deno.test("addInput", () => {
  const nodeId1 = "n1";
  const inputId1 = "i1";
  const dflow = new DflowHost();
  dflow.addNode({ id: nodeId1, kind: "MyNode" });
  dflow.addInput(nodeId1, { id: inputId1 });

  const node1 = dflow.graph.nodes.get(nodeId1);
  const input1 = node1?.inputs.get(inputId1);
  assertEquals(inputId1, input1?.id);
});

Deno.test("addOutput", () => {
  const nodeId1 = "n1";
  const outputId1 = "i1";
  const dflow = new DflowHost();
  dflow.addNode({ id: nodeId1, kind: "MyNode" });
  dflow.addOutput(nodeId1, { id: outputId1 });

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
