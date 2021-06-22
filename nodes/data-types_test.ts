import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./data-types.ts";

Deno.test(catalog.boolean.kind, () => {
  const nodeKind = catalog.boolean.kind;

  const bool = true;
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.getOutputByPosition(0).data = bool;
  assertEquals(testNode.getOutputByPosition(0).data, bool);
});

Deno.test(catalog.number.kind, () => {
  const nodeKind = catalog.number.kind;

  const num = Math.random();
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.getOutputByPosition(0).data = num;
  assertEquals(testNode.getOutputByPosition(0).data, num);
});

Deno.test(catalog.string.kind, () => {
  const nodeKind = catalog.string.kind;

  const str = "foo";
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.getOutputByPosition(0).data = str;
  assertEquals(testNode.getOutputByPosition(0).data, str);
});
