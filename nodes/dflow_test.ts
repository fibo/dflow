import { assertArrayIncludes } from "std/testing/asserts.ts";

import { DflowArray, DflowHost } from "../engine.ts";
import { catalog } from "./catalog.ts";

/*
Deno.test(catalog.arguments.kind, () => {
  const nodeKind = catalog.arguments.kind;

  const dflow = new DflowHost(catalog);

  const testNode0 = dflow.newNode({ kind: nodeKind });

  const numNode1 = dflow.newNode({ kind: catalog.number.kind });
  numNode1.output(0).data = 1;
  const testNode1 = dflow.newNode({ kind: nodeKind });
  dflow.connect(numNode1).to(testNode1);

  const numNode2 = dflow.newNode({ kind: catalog.number.kind });
  numNode2.output(0).data = 2;
  const testNode2 = dflow.newNode({ kind: nodeKind });
  dflow.connect(numNode2).to(testNode2);

  dflow.run();

  assertEquals(testNode0.numOutputs, 1);
  assertEquals(testNode1.numOutputs, 2);
  assertEquals(testNode2.numOutputs, 3);
});
*/

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
