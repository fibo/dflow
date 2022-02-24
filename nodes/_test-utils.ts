import { assertEquals } from "std/testing/asserts.ts";

import { DflowArray, DflowHost, DflowObject, DflowValue } from "../engine.ts";
import { catalog } from "./catalog.ts";

export function testOneAnyInOneBoolOut(
  nodeKind: string,
  input?: DflowValue,
  output?: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.data.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrInOneNumOut(
  nodeKind: string,
  input?: DflowArray,
  output?: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneAnyInOneArrOut(
  nodeKind: string,
  input1?: DflowArray,
  input2?: DflowValue,
  output?: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
  });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneStrInOneBoolOut(
  nodeKind: string,
  input1?: DflowArray,
  input2?: string,
  output?: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({
    kind: catalog.string.kind,
  });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneStrInOneStrOut(
  nodeKind: string,
  input1?: DflowArray,
  input2?: string,
  output?: string,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({
    kind: catalog.string.kind,
  });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrInOneAnyAndOneArrOut(
  nodeKind: string,
  input1?: DflowArray,
  output1?: DflowValue,
  output2?: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
  assertEquals(testNode.output(1).data, output2);
}

export function testOneArrAndTwoNumInOneArrOut(
  nodeKind: string,
  input1?: DflowArray,
  input2?: number,
  input3?: number,
  output1?: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.output(0).data = input2;
  const dataNode3 = dflow.newNode({ kind: catalog.number.kind });
  dataNode3.output(0).data = input3;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.connect(dataNode3).to(testNode, 2);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
}

export function testOneArrInOneArrOut(
  nodeKind: string,
  input1?: DflowArray,
  output1?: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.array.kind });
  dataNode1.output(0).data = input1;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
}

export function testOneBoolInOneBoolOut(
  nodeKind: string,
  input?: boolean,
  output?: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneObjInOneArrOut(
  nodeKind: string,
  input: DflowObject,
  output: DflowArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.object.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumInOneBoolOut(
  nodeKind: string,
  input: number,
  output: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumInOneNumOut(
  nodeKind: string,
  input: number,
  output: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumOut(
  nodeKind: string,
  output: number,
) {
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneStrInOneNumOut(
  nodeKind: string,
  input: string,
  output: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.string.kind });
  dataNode.output(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoAnyInOneBoolOut(
  nodeKind: string,
  input1: DflowValue,
  input2: DflowValue,
  output: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.data.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.data.kind });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoBoolInOneBoolOut(
  nodeKind: string,
  input1?: boolean,
  input2?: boolean,
  output?: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoNumInOneBoolOut(
  nodeKind: string,
  input1?: number,
  input2?: number,
  output?: boolean,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.number.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoNumInOneNumOut(
  nodeKind: string,
  input1?: number,
  input2?: number,
  output?: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode1 = dflow.newNode({ kind: catalog.number.kind });
  dataNode1.output(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.number.kind });
  dataNode2.output(0).data = input2;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}
