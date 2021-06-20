import { assertArrayIncludes } from "std/testing/asserts.ts";

import { DflowArray, DflowHost } from "../engine.ts";
import { catalog } from "./dflow.ts";

Deno.test(catalog.dflowHost.kind, () => {
  const nodeKind = catalog.dflowHost.kind;

  const dflow = new DflowHost({ [nodeKind]: catalog[nodeKind] });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertArrayIncludes(testNode.getOutputByPosition(0).data as DflowArray, [
    nodeKind,
  ]);
});
