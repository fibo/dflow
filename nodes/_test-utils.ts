import { assertEquals } from "std/testing/asserts.ts";

import { DflowArray, DflowHost, DflowObject, DflowValue } from "../engine.ts";
import { catalog } from "./catalog.ts";

export function testOneAnyInOneBoolOut(
  nodeKind: string,
  input: DflowValue,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.data.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneArrInOneNumOut(
  nodeKind: string,
  input: DflowArray,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneBoolInOneBoolOut(
  nodeKind: string,
  input: boolean,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneObjInOneArrOut(
  nodeKind: string,
  input: DflowObject,
  expected: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.object.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumInOneBoolOut(
  nodeKind: string,
  input: number,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumInOneNumOut(
  nodeKind: string,
  input: number,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneNumOut(
  nodeKind: string,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneStrInOneNumOut(
  nodeKind: string,
  input: string,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.string.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testTwoBoolInOneBoolOut(
  nodeKind: string,
  input1: boolean,
  input2: boolean,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode1.getOutputByPosition(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode2.getOutputByPosition(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testTwoNumInOneBoolOut(
  nodeKind: string,
  input1: number,
  input2: number,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.number.kind });
  dataNode1.getOutputByPosition(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.getOutputByPosition(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testTwoNumOrStrInOneBoolOut(
  nodeKind: string,
  input1: number | string,
  input2: number | string,
  expected: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.number.kind });
  dataNode1.getOutputByPosition(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.getOutputByPosition(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testTwoNumInOneNumOut(
  nodeKind: string,
  input1: number,
  input2: number,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.number.kind });
  dataNode1.getOutputByPosition(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.getOutputByPosition(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}
