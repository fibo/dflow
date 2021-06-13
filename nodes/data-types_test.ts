import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./data-types.ts";

Deno.test("data type num", () => {
  const nodeKind = catalog.num.kind;

  const num = Math.random();
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  assertEquals(typeof testNode.getOutputByPosition(0).getData(), "undefined");
  testNode.getOutputByPosition(0).setData(num);
  assertEquals(testNode.getOutputByPosition(0).getData(), num);
});
