import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { catalog } from "./catalog.ts";

export function testOneNumInOneBoolOut(
  nodeKind: string,
  input: number,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const numNode = dflow.newNode({ kind: catalog.num.kind });
  numNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(numNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumInOneNumOut(
  nodeKind: string,
  input: number,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const numNode = dflow.newNode({ kind: catalog.num.kind });
  numNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(numNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumOut(
  nodeKind: string,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneStrInOneNumOut(
  nodeKind: string,
  input: string,
  expected:number,
) {
  const dflow = new DflowHost(catalog);
  const strNode = dflow.newNode({ kind: catalog.str.kind });
  numNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(strNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}
