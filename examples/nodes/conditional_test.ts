import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow } from "./_test-utils.ts";

function testConditionalIf(
  input1?: DflowData,
  input2?: DflowData,
  input3?: DflowData,
  output?: DflowData
) {
  const dflow = newDflow();

  const dataNode1 = dflow.newNode({
    kind: "data",
    outputs: [{ data: input1 }]
  });
  const dataNode2 = dflow.newNode({
    kind: "data",
    outputs: [{ data: input2 }]
  });
  const dataNode3 = dflow.newNode({
    kind: "data",
    outputs: [{ data: input3 }]
  });
  const testNode = dflow.newNode({ kind: "if" });

  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.connect(dataNode3).to(testNode, 2);
  dflow.run();
  const testNodeOutput = dflow.graph.n.find((node) => node.id === testNode.id)
    ?.o?.[0];
  assert.deepEqual(testNodeOutput?.d, output);
}

test("DflowNodeIf", () => {
  for (const { input1, input2, input3, output } of [
    {
      input1: undefined,
      input2: undefined,
      input3: undefined,
      output: undefined
    },
    { input1: true, input2: 1, input3: 2, output: 1 },
    { input1: false, input2: 1, input3: 2, output: 2 },
    { input1: "", input2: 1, input3: 2, output: 2 },
    { input1: "str", input2: 1, input3: 2, output: 1 }
  ])
    testConditionalIf(input1, input2, input3, output);
});
