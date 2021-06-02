import { assertObjectMatch } from "std/testing/asserts.ts";

import { DflowHost } from "./dflow.ts";

Deno.test("Empty graph", () => {
  const dflow = new DflowHost();

  assertObjectMatch(JSON.parse(dflow.graph.toJSON()), { nodes: [], edges: [] });
});
