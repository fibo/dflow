import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./catalog.ts";
import { DflowNum } from "./data-types.ts";
import { DflowMathSin } from "./math.ts";

Deno.test(DflowMathSin.kind, () => {
  const dflow = new DflowHost(catalog);
  const num = 1;
  const numNode = dflow.newNode({ id: "in", kind: DflowNum.kind });
  numNode.getOutputByPosition(0).setData(num);
  const mathNode = dflow.newNode({ id: "test", kind: DflowMathSin.kind });
  dflow.connect(numNode).to(mathNode);
  dflow.graph.run();
  assertEquals(mathNode.getOutputByPosition(0).getData(), Math.sin(num));
});
