import { strict as assert } from "node:assert";
import { Dflow, type DflowData } from "../../dflow.ts";
import { nodeDefinitions } from "./index.ts";

export function newDflow() {
  return new Dflow(nodeDefinitions);
}

export function testOneOut(
  dflow: Dflow,
  nodeKind: string,
  output: DflowData | undefined
) {
  const testNodeId = dflow.node(nodeKind);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId], [output]);
}

export function testOneInOneOut(
  dflow: Dflow,
  nodeKind: string,
  input: DflowData,
  output: DflowData | undefined
) {
  const dataNodeId = dflow.data(input);
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId], [output]);
}

export function testOneInTwoOut(
  dflow: Dflow,
  nodeKind: string,
  input: DflowData,
  output1: DflowData | undefined,
  output2: DflowData | undefined
) {
  const dataNodeId = dflow.data(input);
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId], [output1, output2]);
}

export function testTwoInOneOut(
  dflow: Dflow,
  nodeKind: string,
  input1: DflowData,
  input2: DflowData,
  output: DflowData | undefined
) {
  const dataNodeId1 = dflow.data(input1);
  const dataNodeId2 = dflow.data(input2);
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId], [output]);
}

export function testThreeInOneOut(
  dflow: Dflow,
  nodeKind: string,
  input1: DflowData,
  input2: DflowData,
  input3: DflowData,
  output: DflowData | undefined
) {
  const dataNodeId1 = dflow.data(input1);
  const dataNodeId2 = dflow.data(input2);
  const dataNodeId3 = dflow.data(input3);
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  if (dataNodeId3) dflow.link(dataNodeId3, [testNodeId, 2]);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId], [output]);
}
