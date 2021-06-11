import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost, DflowPin } from "../dflow.ts";
import { catalog } from "./catalog.ts";
import { DflowNum } from "./data-types.ts";
import { DflowMathSin } from "./math.ts";

Deno.test(DflowMathSin.kind, () => {
  const dflow = new DflowHost(catalog);
  const num = 1;
  const numNode = dflow.newNode({ id: "in", kind: DflowNum.kind });
  const numOut = numNode.getOutputByPosition(0) as DflowPin;
  numOut.setData(num);
  const mathNode = dflow.newNode({ id: "test", kind: DflowMathSin.kind });
  const mathIn = mathNode.getInputByPosition(0) as DflowPin;
  const mathOut = mathNode.getOutputByPosition(0) as DflowPin;
  dflow.newEdge({
    id: "edge",
    source: [numNode.id, numOut.id],
    target: [mathNode.id, mathIn.id],
  });
  dflow.graph.run();
  assertEquals(mathOut.getData(), Math.sin(num));
});
