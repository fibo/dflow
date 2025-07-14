import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { DflowData } from "dflow";
import { newDflow } from "./_test-utils.ts";

function testConditionalIf(
  input1: DflowData,
  input2: DflowData,
  input3: DflowData,
  output: DflowData
) {
  const dflow = newDflow();

  const dataNode1 = dflow.data(input1);
  const dataNode2 = dflow.data(input2);
  const dataNode3 = dflow.data(input3);
  const testNodeId = dflow.node("if");

  dflow.link(dataNode1, [testNodeId, 0]);
  dflow.link(dataNode2, [testNodeId, 1]);
  dflow.link(dataNode3, [testNodeId, 2]);
  dflow.run();
  assert.deepEqual(dflow.out[testNodeId][0], output);
}

test("DflowNodeIf", () => {
  for (const { input1, input2, input3, output } of [
    { input1: true, input2: 1, input3: 2, output: 1 },
    { input1: false, input2: 1, input3: 2, output: 2 },
    { input1: "", input2: 1, input3: 2, output: 2 },
    { input1: "str", input2: 1, input3: 2, output: 1 }
  ])
    testConditionalIf(input1, input2, input3, output);
});
