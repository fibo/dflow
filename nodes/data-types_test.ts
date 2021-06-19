import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./data-types.ts";

Deno.test(catalog.number.kind, () => {
  const nodeKind = catalog.number.kind;

  const num = Math.random();
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  assertEquals(typeof testNode.getOutputByPosition(0).data, "undefined");
  testNode.getOutputByPosition(0).data = num;
  assertEquals(testNode.getOutputByPosition(0).data, num);
});
