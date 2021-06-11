import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./catalog.ts";
import { DflowNum } from "./data-types.ts";
import {
  DflowMathCos,
  DflowMathCosh,
  DflowMathPI,
  DflowMathSin,
  DflowMathSinh,
} from "./math.ts";

function testUnaryOperator(nodeKind: string, input: number, expected: number) {
  const dflow = new DflowHost(catalog);
  const numNode = dflow.newNode({ id: "in", kind: DflowNum.kind });
  numNode.getOutputByPosition(0).setData(input);
  const mathNode = dflow.newNode({ id: "test", kind: nodeKind });
  dflow.connect(numNode).to(mathNode);
  dflow.graph.run();
  assertEquals(mathNode.getOutputByPosition(0).getData(), expected);
}

Deno.test(DflowMathCos.kind, () => {
  testUnaryOperator(DflowMathCos.kind, 1, Math.cos(1));
});

Deno.test(DflowMathCosh.kind, () => {
  testUnaryOperator(DflowMathCosh.kind, 1, Math.cosh(1));
});

Deno.test(DflowMathPI.kind, () => {
  const dflow = new DflowHost(catalog);
  const node = dflow.newNode({ id: "test", kind: DflowMathPI.kind });
  assertEquals(node.getOutputByPosition(0).getData(), Math.PI);
});

Deno.test(DflowMathSin.kind, () => {
  testUnaryOperator(DflowMathSin.kind, 1, Math.sin(1));
});

Deno.test(DflowMathSinh.kind, () => {
  testUnaryOperator(DflowMathSinh.kind, 1, Math.sinh(1));
});
