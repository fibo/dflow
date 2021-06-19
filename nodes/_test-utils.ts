import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost, DflowPinData, DflowPinDataArray, DflowPinDataObject } from "../engine.ts";
import { catalog } from "./catalog.ts";

export function testOneAnyInOneBoolOut(
  nodeKind: string,
  input: DflowPinData,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.data.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneObjInOneArrOut(
  nodeKind: string,
  input: DflowPinDataObject,
  expected: DflowPinDataArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.obj.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumInOneBoolOut(
  nodeKind: string,
  input: number,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.num.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumInOneNumOut(
  nodeKind: string,
  input: number,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.num.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
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
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.str.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}
