import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../engine.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.now.kind, () => {
  const nodeKind = catalog.now.kind;

  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const result = testNode.output(0).data as number;

  assertEquals(typeof result, "number");
});
