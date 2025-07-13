import { strict as assert } from "node:assert";
import { Dflow } from "../../dflow.ts";
import { nodeDefinitions } from "./index.ts";

export function newDflow() {
  return new Dflow(nodeDefinitions);
}

export function testOneOut<Output>(
  dflow: Dflow,
  nodeKind: string,
  output: Output
) {
  const testNodeId = dflow.node(nodeKind);
  dflow.run();
  assert.deepEqual(dflow.graph.n[testNodeId]?.o?.[0]?.d, output);
}

export function testOneInOneOut<Input, Output>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output?: Output
) {
  const dataNodeId = dflow.data(input);
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  const testNodeOutput = dflow.graph.n[testNodeId]?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output);
}

export function testOneInTwoOut<Input, Output1, Output2>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output1?: Output1,
  output2?: Output2
) {
  const dataNodeId = dflow.data(input);
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  const testNodeOutput = dflow.graph.n[testNodeId]?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output1);
  assert.deepEqual(testNodeOutput?.[1].d, output2);
}

export function testTwoInOneOut<Input1, Input2, Output>(
  dflow: Dflow,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  output?: Output
) {
  const dataNodeId1 = dflow.data(input1);
  const dataNodeId2 = dflow.data(input2);
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  dflow.run();
  const testNodeOutput = dflow.graph.n[testNodeId]?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output);
}

export function testThreeInOneOut<Input1, Input2, Input3, Output>(
  dflow: Dflow,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  input3?: Input3,
  output?: Output
) {
  const dataNodeId1 = dflow.data(input1);
  const dataNodeId2 = dflow.data(input2);
  const dataNodeId3 = dflow.data(input3);
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  if (dataNodeId3) dflow.link(dataNodeId3, [testNodeId, 2]);
  dflow.run();
  const testNodeOutput = dflow.graph.n[testNodeId]?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output);
}
