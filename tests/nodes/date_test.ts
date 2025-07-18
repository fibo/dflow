import { strict as assert } from "node:assert";
import { test } from "node:test";
import { newDflow } from "./utils.ts";

test("newDate", () => {
  const dflow = newDflow();
  const nodeKind = "newDate";

  const testNodeId = dflow.node(nodeKind);

  dflow.run();

  const [output0, output1] = dflow.out[testNodeId];

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});

test("now", () => {
  const dflow = newDflow();
  const nodeKind = "now";

  const testNodeId = dflow.node(nodeKind);

  dflow.run();

  const [output0, output1] = dflow.out[testNodeId];

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});
