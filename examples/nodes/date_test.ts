import { strict as assert } from "node:assert";
import { test } from "node:test";
import { newDflow } from "./_test-utils.ts";

test("newDate", () => {
  const dflow = newDflow();
  const nodeKind = "newDate";

  const testNodeId = dflow.node(nodeKind);

  dflow.run();

  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
  const output0 = testNodeOutput?.[0].d;
  const output1 = testNodeOutput?.[1].d;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});

test("now", () => {
  const dflow = newDflow();
  const nodeKind = "now";

  const testNodeId = dflow.node(nodeKind);

  dflow.run();

  const testNodeOutput = dflow.graph.n.find(
    (node) => node.id === testNodeId
  )?.o;
  const output0 = testNodeOutput?.[0].d;
  const output1 = testNodeOutput?.[1].d;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});
