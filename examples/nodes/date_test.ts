import { assertEquals } from "std/testing/asserts.ts";
import { newDflow } from "./_test-utils.ts";
import { nodesCatalog as catalog } from "./index.ts";

Deno.test(catalog.newDate.kind, () => {
  const nodeKind = catalog.newDate.kind;

  const dflow = newDflow();
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data as string;
  const output1 = testNode.output(1).data as number;

  assertEquals(typeof output0, "string");
  assertEquals(typeof output1, "number");
});

Deno.test(catalog.now.kind, () => {
  const nodeKind = catalog.now.kind;

  const dflow = newDflow();
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data as string;
  const output1 = testNode.output(1).data as number;

  assertEquals(typeof output0, "string");
  assertEquals(typeof output1, "number");
});
