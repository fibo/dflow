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
  assert.deepEqual(
    dflow.graph.n.find((node) => node.id === testNodeId)?.o?.[0]?.d,
    output
  );
}

export function testOneInOneOut<Input, Output>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output?: Output
) {
  const dataNodeId = dflow.node("data", {
    outputs: [{ data: Dflow.isDflowData(input) ? input : undefined }]
  });
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output);
}

export function testOneInTwoOut<Input, Output1, Output2>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output1?: Output1,
  output2?: Output2
) {
  const dataNodeId = dflow.node("data", {
    outputs: [{ data: Dflow.isDflowData(input) ? input : undefined }]
  });
  const testNodeId = dflow.node(nodeKind);
  dflow.link(dataNodeId, testNodeId);
  dflow.run();
  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
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
  const dataNodeId1 = Dflow.isDflowData(input1)
    ? dflow.node("data", { outputs: [{ data: input1 }] })
    : undefined;
  const dataNodeId2 = Dflow.isDflowData(input2)
    ? dflow.node("data", { outputs: [{ data: input2 }] })
    : undefined;
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  dflow.run();
  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
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
  const dataNodeId1 = Dflow.isDflowData(input1)
    ? dflow.node("data", { outputs: [{ data: input1 }] })
    : undefined;
  const dataNodeId2 = Dflow.isDflowData(input2)
    ? dflow.node("data", { outputs: [{ data: input2 }] })
    : undefined;
  const dataNodeId3 = Dflow.isDflowData(input3)
    ? dflow.node("data", { outputs: [{ data: input3 }] })
    : undefined;
  const testNodeId = dflow.node(nodeKind);
  if (dataNodeId1) dflow.link(dataNodeId1, [testNodeId, 0]);
  if (dataNodeId2) dflow.link(dataNodeId2, [testNodeId, 1]);
  if (dataNodeId3) dflow.link(dataNodeId3, [testNodeId, 2]);
  dflow.run();
  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
  assert.deepEqual(testNodeOutput?.[0].d, output);
}
