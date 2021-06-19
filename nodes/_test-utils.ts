import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost, JsonArray, JsonObject, JsonValue } from "../engine.ts";
import { catalog } from "./catalog.ts";

export function testOneAnyInOneBoolOut(
  nodeKind: string,
  input: JsonValue,
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

export function testOneArrInOneNumOut(
  nodeKind: string,
  input: JsonArray,
  expected: number,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

export function testOneObjInOneArrOut(
  nodeKind: string,
  input: JsonObject,
  expected: JsonArray,
) {
  const dflow = new DflowHost(catalog);
  const dataNode = dflow.newNode({ kind: catalog.object.kind });
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
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
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
  const dataNode = dflow.newNode({ kind: catalog.number.kind });
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
  const dataNode = dflow.newNode({ kind: catalog.string.kind });
  dataNode.getOutputByPosition(0).data = input;
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.graph.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}