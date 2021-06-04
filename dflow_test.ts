import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { DflowHost } from "./dflow.ts";

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

  const edge1 = dflow.graph.edges.get(edgeId1);
  assertEquals(edgeId1, edge1?.id);
});
