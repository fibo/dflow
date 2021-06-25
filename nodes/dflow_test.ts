import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";

import { DflowArray, DflowHost, DflowId } from "../engine.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.dflow.kind, () => {
  const nodeKind = catalog.dflow.kind;

  // Load a catalog with a single Dflow node.
  const dflow = new DflowHost({ [nodeKind]: catalog[nodeKind] });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertArrayIncludes(testNode.output(0).data as DflowArray, [
    nodeKind,
  ]);
});

Deno.test(catalog.function.kind, () => {
  const nodeKind = catalog.function.kind;

  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.data.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(testNode, 1).to(returnNode, 0);
  dflow.connect(dataNode).to(returnNode, 1);
  dflow.run();
  assertEquals(testNode.output(1).data as DflowId, testNode.id);
});
