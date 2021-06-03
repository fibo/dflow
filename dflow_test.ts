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
  const nodeId1 = "id1";
  const dflow = new DflowHost();
  dflow.addNode({ id: nodeId1, kind: "MyNode" });

  const node1 = dflow.graph.nodes.get(nodeId1);
  assertEquals(nodeId1, node1?.id);
});
